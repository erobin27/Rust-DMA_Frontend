/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useWebSocket } from "../test/websocket";
import {
  ISceneItem,
  ISceneItems,
} from "./interfaces/radar/sceneItem.interface";
import { Item } from "./interfaces/game/items/item.type";
import { AddItem } from "./interfaces/radar/addItem.interface";
import { loadTextures, preloadedTextures } from "./helpers/textures";
import { addText, alignText } from "./helpers/text";
import { convertGamePositionToMap, map, setupMap } from "./helpers/map";
import {
  RenderLevel,
  Settings,
  SettingsActions,
} from "./interfaces/radar/settings.interface";
import { LootContainer } from "./interfaces/game/items/lootContainer.interface";
import { IRustRadarData } from "./interfaces/game/rustRadarData.interface";
import { dragToMoveCamera } from "./helpers/dragToMove";
import { degToRad } from "three/src/math/MathUtils.js";
import { Position } from "./interfaces/game/position.interface";

const defaultSceneItems: ISceneItems = {
  players: {},
  loot: {},
  nodes: {},
};

const enum ItemTypes {
  TEXT = "TEXT",
  SPRITE = "SPRITE",
}

const enum PlayerTypes {
  LOCAL = 'LOCAL',
  TEAM = 'TEAM',
  ENEMY = 'ENEMY',
  NPC = 'NPC',
  SLEEPER = 'SLEEPER',
}

const Radar: React.FC<{
  settings: Settings;
  settingsActions: SettingsActions;
}> = (props) => {
  // References
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Variables
  const [previousSettings, setPreviousSettings] = useState<Settings | null>(
    null
  );
  const [targetCameraPosition, setTargetCameraPosition] = useState<
    THREE.Vector3 | undefined
  >(undefined);
  const [sceneItems, setSceneItems] = useState<ISceneItems>(defaultSceneItems);

  // Websocket/Data
  const { data, removeIds } = useWebSocket();
  const { settings, settingsActions } = props;

  /*
   ************************************
   *                                  *
   *                                  *
   *       HELPER FUNCTIONS           *
   *                                  *
   *                                  *
   ************************************
   */
  const calculateCameraZoomScale = (): number => {
    return 5 / (cameraRef.current?.zoom ?? 1);
    // return 1;
  };

  const adjustItemScale = (
    sprite: THREE.Mesh | THREE.Sprite,
    originalScale: THREE.Vector3
  ) => {
    const spriteScale = calculateCameraZoomScale();
    const newScale = originalScale.clone().multiplyScalar(spriteScale);
    sprite.scale.set(newScale.x, newScale.y, newScale.z);
  };

  const adjustTextScale = (
    textMesh: THREE.Mesh,
    originalScale = new THREE.Vector3(1, 1, 1)
  ) => {
    const textScale = calculateCameraZoomScale(); // Function to calculate scale based on camera zoom
    const newScale = originalScale.clone().multiplyScalar(textScale);
    textMesh.scale.set(newScale.x, newScale.y, newScale.z);
  };

  const addItemRevised = async (input: AddItem, spriteCanUpdate = false): Promise<ISceneItem> => {
    const { category, zoomFactor } = input;
    const position = convertGamePositionToMap(input.position);

    const spriteId = `${ItemTypes.SPRITE}_${input.identifier}`;
    const existingSprite = input.scene.getObjectByName(spriteId);

    const textId = `${ItemTypes.TEXT}_${input.identifier}`;
    const existingText = input.scene.getObjectByName(textId);

    let sprite: THREE.Sprite = existingSprite as THREE.Sprite;
    let text = existingText;

    // No sprite exists yet
    if (!existingSprite) {
      console.debug("creating...", input.identifier);
      const spriteMaterial = new THREE.SpriteMaterial({ map: input.texture });
      sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(position.x, position.y, position.z);
      if (input.rotation) sprite.material.rotation = degToRad(input.rotation);
      sprite.name = spriteId;

      // Double check before adding
      if (!input.scene.getObjectByName(spriteId)) input.scene.add(sprite);
    }

    // No text label exists yet and should be created
    if (!existingText && input.label) {
      console.debug("Creating text for first time.", input.identifier);
      text = await addText({
        textId,
        textString: input.label.text,
        color: input.label.color,
        parameters: {
          size: input.label.size,
        },
      });

      // Double check before adding
      if (!input.scene.getObjectByName(textId))
        input.scene.add(text as THREE.Mesh);
    }

    // Set the sprite's position
    if (sprite) {
      const layerPosition = input.layerPosition ?? 0.1;
      sprite.position.set(position.x, position.y, layerPosition);
      adjustItemScale(sprite, input.scale);
      if (input.rotation) sprite.material.rotation = degToRad(input.rotation);
    }

    // Set the position of the text
    if (text) {
      const textPosition = position;
      textPosition.setZ(input.layerPosition ?? 0.1);

      textPosition.setY(
        position.y - (input.label?.offset ?? 10) * calculateCameraZoomScale()
      );
      alignText(text as THREE.Mesh, textPosition);
      adjustTextScale(text as THREE.Mesh);
    }

    if(spriteCanUpdate && existingSprite) {
      if(sprite.material.map?.image.src !== input.texture.source) {
        sprite.material.map = input.texture;
        if(text && input.label?.color) (text as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: input.label.color });
      }
    }

    return { text: text as THREE.Mesh, sprite, originalScale: input.scale };
  };

  const refreshAll = (scene: THREE.Scene): void => {
    console.log("REFRESHING ALL");
    setSceneItems({ ...defaultSceneItems });

    scene.clear();
  };

  const refreshItems = (scene: THREE.Scene): void => {
    console.log("REFRESHING");
    scene.clear();
  };

  // Define a function to safely remove and dispose of objects
  const safelyRemoveObject = (
    obj: THREE.Object3D | undefined,
    scene: THREE.Scene
  ): void => {
    if (!obj) return;

    // Remove the object from the scene
    scene.remove(obj);

    // Check if the object is a Mesh and has geometry and material to dispose
    if ((obj as THREE.Mesh).geometry) {
      (obj as THREE.Mesh).geometry.dispose();
    }
    if ((obj as THREE.Mesh).material) {
      const material = (obj as THREE.Mesh).material;
      if (Array.isArray(material)) {
        material.forEach((mat) => mat && mat.dispose());
      } else {
        material.dispose();
      }
    }
  };

  const removeSceneItemsByIdRevised = (
    scene: THREE.Scene,
    identifiers: string[]
  ): void => {
    identifiers.forEach((id) => {
      const spriteId = `${ItemTypes.SPRITE}_${id}`;
      const existingSprite = scene.getObjectByName(spriteId);

      const textId = `${ItemTypes.TEXT}_${id}`;
      const existingText = scene.getObjectByName(textId);

      // Use the function to remove the sprite and text
      safelyRemoveObject(existingSprite, scene);
      safelyRemoveObject(existingText, scene);
    });
  };

  const shouldDisplayItem = (position: Position): boolean => {
    const level: RenderLevel = settingsActions.renderLevel;

    switch (level) {
      case RenderLevel.ABOVE:
        return position.y > 0;
      case RenderLevel.BELOW:
        return position.y < 0;
      case RenderLevel.BOTH:
        return true;
      case RenderLevel.AUTO:
        return true; // TODO: Write auto render level code here.
      default:
        console.error('Undefined render level provided.', level);
        return false;
    }
  }
  /*
   ************************************
   *                                  *
   *                                  *
   *          USE EFFECTS             *
   *                                  *
   *                                  *
   ************************************
   */

  // Initialize Three.js scene, camera, and renderer
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    loadTextures();
    setupMap(scene);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    // Handle window resize
    const handleResize = () => {
      refreshAll(scene);
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera properties
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      // Update renderer size
      renderer.setSize(width, height);

      // If you are using an image, update its scale or position here as needed
      setupMap(scene);
      scene.remove(map);
    };

    window.addEventListener("resize", handleResize);

    // Wheel event for zooming
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomFactor = 0.01; // Adjust this factor to control zoom sensitivity
      const minZoom = 1; // Minimum zoom level, representing the "normal size"
      const maxZoom = 50; // Maximum zoom level, adjust as needed

      // Calculate new zoom level
      let newZoom = camera.zoom + event.deltaY * -zoomFactor;

      // Clamp the new zoom level between minZoom and maxZoom
      newZoom = Math.max(Math.min(newZoom, maxZoom), minZoom);

      // Apply the new zoom level
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
      const spriteScale = calculateCameraZoomScale();
      Object.values(sceneItems).forEach(
        (category: { [key: string]: ISceneItem }) => {
          Object.values(category).forEach((item: ISceneItem) => {
            if (item.sprite && item.originalScale) {
              const newScale = item.originalScale
                .clone()
                .multiplyScalar(spriteScale);
              item.sprite.scale.set(newScale.x, newScale.y, 1);
            }
          });
        }
      );
    };

    renderer.domElement.addEventListener("wheel", onWheel);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const addOrUpdateNodes = (
      nodeData: IRustRadarData["nodes"] | undefined
    ): void => {
      if (!scene || !nodeData) return;

      // logAllSceneItems(scene);
      const sulfur: Item[] = nodeData.sulfur ?? [];
      if (settings.sulfur)
        sulfur.forEach((node) => {
          addItemRevised({
            scene,
            identifier: node.id,
            position: new THREE.Vector3(
              node.position.x,
              node.position.y,
              node.position.z
            ),
            texture: preloadedTextures.sulfur as THREE.Texture,
            layerPosition: 2,
            scale: new THREE.Vector3(5, 5, 1),
            zoomFactor: calculateCameraZoomScale(),
            category: "nodes",
          });
        });

      const metal: Item[] = nodeData.metal ?? [];
      if (settings.metal)
        metal.forEach((node) => {
          addItemRevised({
            scene,
            identifier: node.id,
            position: new THREE.Vector3(
              node.position.x,
              node.position.y,
              node.position.z
            ),
            texture: preloadedTextures.metal as THREE.Texture,
            layerPosition: 2,
            scale: new THREE.Vector3(5, 5, 1),
            zoomFactor: calculateCameraZoomScale(),
            category: "nodes",
          });
        });

      const stone: Item[] = nodeData.stone ?? [];
      if (settings.stone)
        stone.forEach((node) => {
          addItemRevised({
            scene,
            identifier: node.id,
            position: new THREE.Vector3(
              node.position.x,
              node.position.y,
              node.position.z
            ),
            texture: preloadedTextures.stone as THREE.Texture,
            layerPosition: 2,
            scale: new THREE.Vector3(5, 5, 1),
            zoomFactor: calculateCameraZoomScale(),
            category: "nodes",
          });
        });
    };

    const addOrUpdateLoot = (
      lootData: IRustRadarData["loot"] | undefined
    ): void => {
      if (!scene || !lootData) return;

      const displayCrateRevised = (item: LootContainer) => {
        // console.log(item.name);
        const { name, id, position } = item;

        if (settings[name] === undefined) {
          console.debug(`Item not found in settings - (${name})`);
          return;
        }
        
        if (!shouldDisplayItem(position)) {
          return;
        }

        if (preloadedTextures[name] === undefined) {
          console.debug(`Item not found in preloadedTextures - (${name})`);
          return;
        }

        if (settings[name]) {
          addItemRevised({
            scene,
            identifier: id,
            position: new THREE.Vector3(position.x, position.y, position.z),
            texture: preloadedTextures[name] as THREE.Texture,
            layerPosition: 2,
            scale: new THREE.Vector3(5, 5, 1),
            zoomFactor: calculateCameraZoomScale(),
            category: "loot",
          });
        }
      };

      lootData.forEach((loot) => {
        if (shouldDisplayItem(loot.position)) displayCrateRevised(loot);
      });
    };

    const addOrUpdatePlayers = async (
      playerData: IRustRadarData["players"] | undefined
    ): Promise<void> => {
      if (!scene || !playerData) return;


      let playerType = PlayerTypes.LOCAL;
      const localPlayer = playerData[0]
      for (const player of playerData) {
        const playerPosition = new THREE.Vector3(
          player.position.x,
          player.position.y,
          player.position.z
        );

        if (!player.name || player.name === "") {
          return;
        }

        let item;
        if(player.name === localPlayer.name) { 
          playerType = PlayerTypes.LOCAL;
        } else if(player.sleeping){
          playerType = PlayerTypes.SLEEPER;
        } else if (player.team === localPlayer.team && player.team !== 0) {
          playerType = PlayerTypes.TEAM;
        } else {
          playerType = PlayerTypes.ENEMY;
        }
        console.log('player type:', playerType, player.name);
        switch (playerType as PlayerTypes) {
          case PlayerTypes.LOCAL:
            item = await addItemRevised({
              scene,
              identifier: player.id,
              label: {
                text: player.name,
                color: "#00FF00",
                size: 3,
                offset: 4,
              },
              position: playerPosition,
              rotation: -player.lookAngle,
              texture: preloadedTextures.localPlayer as THREE.Texture,
              scale: new THREE.Vector3(5, 5, 1),
              zoomFactor: calculateCameraZoomScale(),
              layerPosition: 1,
              category: "players",
            }, false);
            break;
          case PlayerTypes.SLEEPER:
            item = await addItemRevised({
              scene,
              identifier: player.id,
              label: {
                text: player.name,
                color: "#FFFFFF",
                size: 2,
                offset: 4,
              },
              position: playerPosition,
              rotation: 0,
              texture: preloadedTextures.sleeper as THREE.Texture,
              scale: new THREE.Vector3(3, 3, 1),
              zoomFactor: calculateCameraZoomScale(),
              layerPosition: 1,
              category: "players",
            }, false);
            break;
          case PlayerTypes.TEAM:
            item = await addItemRevised({
              scene,
              identifier: player.id,
              label: {
                text: player.name,
                color: "#00FF00",
                size: 3,
                offset: 4,
              },
              position: playerPosition,
              rotation: -player.lookAngle,
              texture: preloadedTextures.teamPlayer as THREE.Texture,
              scale: new THREE.Vector3(5, 5, 1),
              zoomFactor: calculateCameraZoomScale(),
              layerPosition: 1,
              category: "players",
            }, true);
            break;
          case PlayerTypes.ENEMY:
            item = await addItemRevised({
              scene,
              identifier: player.id,
              label: {
                text: player.name,
                color: "#FF0000",
                size: 3,
                offset: 4,
              },
              position: playerPosition,
              rotation: -player.lookAngle,
              texture: preloadedTextures.enemyPlayer as THREE.Texture,
              scale: new THREE.Vector3(5, 5, 1),
              zoomFactor: calculateCameraZoomScale(),
              layerPosition: 1,
              category: "players",
            }, true);
            break;
          case PlayerTypes.NPC:
            item = await addItemRevised({
              scene,
              identifier: player.id,
              label: {
                text: player.name,
                color: "#FF0000",
                size: 3,
                offset: 4,
              },
              position: playerPosition,
              rotation: -player.lookAngle,
              texture: preloadedTextures.npc as THREE.Texture,
              scale: new THREE.Vector3(5, 5, 1),
              zoomFactor: calculateCameraZoomScale(),
              layerPosition: 1,
              category: "players",
            }, true);
            break;
        }

        if (player.name.startsWith("love") && settingsActions.following) {
          setTargetCameraPosition(item.sprite?.clone().position);
        }
      }
    };

    const scene = sceneRef.current;

    addOrUpdateNodes(data?.nodes);
    addOrUpdatePlayers(data?.players);
    addOrUpdateLoot(data?.loot);

    console.log(calculateCameraZoomScale());
  }, [data]);

  /*
    If an option is disabled in settings then
    we should clear all of the remaining blips
    on the map of where it was previously drawn.
  */
  useEffect(() => {
    const getKeysChangedFromTrueToFalse = (
      previousObject: Settings | null,
      currentObject: Settings
    ): string[] => {
      // If it is the first time
      if (!previousObject) return [];
      const changedKeys: string[] = [];

      // Iterate through keys in the previous object
      for (const key in previousObject) {
        // Check if the key exists in the current object and the value changed from true to false
        if (
          currentObject[key] !== undefined &&
          previousObject[key] === true &&
          currentObject[key] === false
        ) {
          changedKeys.push(key);
        }
      }

      return changedKeys;
    };

    // Keys switch to false
    const keysToRemove = getKeysChangedFromTrueToFalse(
      previousSettings,
      settings
    );

    // Set the settings so can compare next time they are updated
    setPreviousSettings(settings);

    if (keysToRemove.length < 1) return;

    // Remove the keys set to false so that they are no longer in the scene
    const scene = sceneRef.current;
    if (!scene) return;

    const names: string[] = [];
    if (scene)
      scene.traverse(function (object) {
        names.push(object.name); // Add the name of each object to the array
      });
    keysToRemove.map((key) => {
      console.debug("Settings changed, removing", key);
      switch (key) {
        case "sulfur":
        case "stone":
        case "metal":
          removeSceneItemsByIdRevised(
            scene,
            data?.nodes[key].map((node) => node.id) || []
          );
          break;
        case "crate_normal_2":
        case "crate_normal_2_food":
        case "crate_normal_2_medical":
        case "crate_normal":
        case "crate_elite":
        case "bradley_crate":
        case "heli_crate":
        case "crate_basic":
        case "crate_tools":
        case "supply_drop":
        case "loot_barrel_1":
        case "loot_barrel_2":
        case "oil_barrel":
          removeSceneItemsByIdRevised(
            scene,
            data?.loot
              .filter((loot) => loot.name === key)
              .map((loot) => loot.id) || []
          );
          break;
        default:
          console.error("unknown setting change:", key);
      }

      console.log("Updated Settings");
    });
  }, [settings]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    removeSceneItemsByIdRevised(scene, removeIds);
  }, [removeIds]);

  useEffect(() => {
    if (!settingsActions.refresh) return;
    const scene = sceneRef.current;
    if (!scene) return;

    refreshItems(scene);
    setupMap(scene);
    settingsActions.setRefresh(false);
  }, [settingsActions.refresh]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    refreshItems(scene);
    setupMap(scene);
  }, [settingsActions.renderLevel]);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera) return;

    camera.position.setX(targetCameraPosition?.x ?? 0);
    camera.position.setY(targetCameraPosition?.y ?? 0);
  }, [targetCameraPosition]);

  dragToMoveCamera(
    sceneRef.current,
    cameraRef.current,
    rendererRef.current,
    calculateCameraZoomScale(),
    settingsActions.setFollowing
  );

  return <div ref={mountRef} />;
};

export default Radar;
