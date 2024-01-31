import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  IRustRadarData,
  LootContainer,
  Ore,
  Player,
  Position,
} from "./radarData.interface";
import {
  FontLoader,
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/Addons.js";
import { useWebSocket } from "../test/websocket";

interface PreloadedTextures {
  sulfur?: THREE.Texture;
  metal?: THREE.Texture;
  stone?: THREE.Texture;
  hazmat?: THREE.Texture;
  basic_crate_2?: THREE.Texture;
}
const preloadedTextures: PreloadedTextures = {};

interface Dimensions {
  width: number;
  height: number;
}

let mapScale: Dimensions = { width: 1, height: 1 };
const convertGamePositionToMap = (position: Position): THREE.Vector3 => {
  const v3: THREE.Vector3 = new THREE.Vector3();
  const customScale = 1;
  const x = position.x * customScale * mapScale.width;
  const y = position.z * customScale * mapScale.height;
  v3.set(x, y, 0.1);

  return v3;
};

const calculateMapScale = (
  geometry: THREE.PlaneGeometry,
  texture: THREE.Texture
): Dimensions => {
  const mapWidth = geometry.parameters.width;
  const mapHeight = geometry.parameters.height;

  const image = texture.image as HTMLImageElement; // Cast to HTMLImageElement for TypeScript
  const originalWidth = image.width;
  const originalHeight = image.height;

  const xScale = mapWidth / originalWidth;
  const yScale = mapHeight / originalHeight;

  console.log(
    `Original Image Dimensions: ${originalWidth} x ${originalHeight}`
  );
  console.log(`Scale: ${xScale} x ${yScale}`);

  return { width: xScale, height: yScale };
};

let map: THREE.Mesh;
const setupMap = (scene: THREE.Scene): void => {
  // Load and display image
  const loader = new THREE.TextureLoader();
  loader.load("map.png", (texture) => {
    // Image aspect ratio
    const imageAspect = texture.image.height / texture.image.width;

    // Calculate dimensions for the geometry that maintain the image's aspect ratio
    let planeWidth, planeHeight;
    if (window.innerWidth / window.innerHeight > imageAspect) {
      // Window is wider than the image
      planeHeight = window.innerHeight;
      planeWidth = planeHeight * imageAspect;
    } else {
      // Window is taller than the image
      planeWidth = window.innerWidth;
      planeHeight = planeWidth / imageAspect;
    }

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    console.log(`Map Dimensions: ${planeWidth}x${planeHeight}`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setZ(0);

    // Add mesh to the scene
    scene.add(mesh);
    map = mesh;
    mapScale = calculateMapScale(geometry, texture);
    scene.background = new THREE.Color(0x3b8493);
  });
};

const alignText = (text: THREE.Mesh, position: THREE.Vector3): void => {
  text.position.set(position.x, position.y, 0.1);
  text.geometry.computeBoundingBox();
  if (text.geometry.boundingBox) {
    // Get the bounding box size
    const size = text.geometry.boundingBox.getSize(new THREE.Vector3());
    text.position.x = text.position.x - 0.5 * size.x; // Center horizontally
    text.position.y = text.position.y - 0.5 * size.y; // Center Vertically
    text.position.z = position.z;
  }
};

const addText = async (
  textString: string,
  color: string,
  parameters: Omit<TextGeometryParameters, "font">,
  position?: Position
): Promise<THREE.Mesh | undefined> => {
  const loader = new FontLoader();

  return new Promise((resolve) => {
    loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
      const textGeometry = new TextGeometry(textString, {
        ...parameters,
        font: font,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(position?.x ?? 0, position?.y ?? 0, position?.z ?? 0.1);
      resolve(text);
    });
  });
};

export interface ISceneItem {
  dot?: THREE.Mesh;
  text?: THREE.Mesh;
  sprite?: THREE.Sprite;
}

export interface ISceneItems {
  [key: string]: ISceneItem;
}
const addPlayer = async (scene: THREE.Scene, player: Player): void => {
  // Create a circle
  let circle;
  let text;
  if (!sceneItems[player.name]) {
    const circleGeometry = new THREE.CircleGeometry(3, 32); // Adjust radius and segments
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false,
      opacity: 0.9,
    });
    circle = new THREE.Mesh(circleGeometry, circleMaterial);
    scene.add(circle);

    text = await addText(player.name, "#FF0000", { size: 5 });

    sceneItems[player.name] = { dot: circle, text };
    if (text) scene.add(text);
  } else {
    circle = sceneItems[player.name].dot;
    text = sceneItems[player.name].text;
  }

  const position = convertGamePositionToMap(player.position);
  circle?.position.set(position.x, position.y, 0.1);
  const textPosition = position;
  textPosition.setZ(0.1);
  textPosition.setY(position.y - 10);
  if (text) alignText(text, textPosition);

  // Add to the scene
};

let sceneItems: ISceneItems = {};

interface AddItem {
  scene: THREE.Scene;
  identifier: string;
  position: THREE.Vector3;
  texture: THREE.Texture;
  scale?: THREE.Vector3;
  label?: {
    text: string;
    color: string;
    size: number;
    offset?: number;
  };
  layerPosition?: number;
}
const addItem = async (input: AddItem): void => {
  let text;
  let sprite;
  const position = convertGamePositionToMap(input.position);
  if (!sceneItems[input.identifier]) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: input.texture });
    sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(position.x, position.y, position.z);
    input.scale
      ? sprite.scale.set(input.scale.x, input.scale.y, input.scale.z)
      : sprite.scale.set(10, 10, 1);

    input.scene.add(sprite);

    if (input.label) {
      text = await addText(input.label.text, input.label.color, {
        size: input.label.size,
      });
      input.scene.add(text as THREE.Mesh);
    }

    sceneItems[input.identifier] = { sprite, text };
  } else {
    text = sceneItems[input.identifier].text;
    sprite = sceneItems[input.identifier].sprite;
  }

  sprite?.position.set(position.x, position.y, input.layerPosition ?? 0.1);

  const textPosition = position;
  textPosition.setZ(input.layerPosition ?? 0.1);
  textPosition.setY(position.y - (input.label?.offset ?? 10));
  if (text) alignText(text, textPosition);
};

const refreshAll = (scene: THREE.Scene): void => {
  sceneItems = {};
  5;
  scene.clear();
};

const removeSceneItems = (
  scene: THREE.Scene,
  currentIdentifiers: string[]
): void => {
  const previousIdentifiers = Object.keys(sceneItems);
  if (currentIdentifiers.length) {
    previousIdentifiers.forEach((pId) => {
      if (!currentIdentifiers.includes(pId)) {
        const { text, dot, sprite } = sceneItems[pId];
        if (dot) scene.remove(dot as THREE.Mesh);
        if (text) scene.remove(text as THREE.Mesh);
        if (sprite) scene.remove(sprite as THREE.Sprite);
        delete sceneItems[pId];
      }
    });
  }
};

const loadTextures = (): void => {
  const textureLoader = new THREE.TextureLoader();
  preloadedTextures.sulfur = textureLoader.load("/icons/sulfur.ore.png");
  preloadedTextures.metal = textureLoader.load("/icons/metal.ore.png");
  preloadedTextures.stone = textureLoader.load("/icons/stones.png");
  preloadedTextures.hazmat = textureLoader.load("/icons/hazmatsuit.png");
  preloadedTextures.basic_crate_2 = textureLoader.load("/icons/crate.png");
};

const RadarScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { data, closeConnection } = useWebSocket();

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
      const maxZoom = 10; // Maximum zoom level, adjust as needed

      // Calculate new zoom level
      let newZoom = camera.zoom + event.deltaY * -zoomFactor;

      // Clamp the new zoom level between minZoom and maxZoom
      newZoom = Math.max(Math.min(newZoom, maxZoom), minZoom);

      // Apply the new zoom level
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("wheel", onWheel);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update scene on new WebSocket data
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !data) return;

    // Parse the data and update the scene
    const parsed: IRustRadarData = JSON.parse(data ?? "{}");

    const extractProperties = <T, K extends keyof T>(
      items: T[],
      key: K
    ): T[K][] => {
      return items.map((item) => item[key]);
    };

    removeSceneItems(scene, [
      ...extractProperties(parsed.players, "name"),
      ...extractProperties(parsed.nodes.sulfur, "id"),
      ...extractProperties(parsed.nodes.metal, "id"),
      ...extractProperties(parsed.nodes.stone, "id"),
      ...extractProperties(parsed.loot, "id"),
    ]);

    const players: Player[] = parsed.players ?? [];
    players.forEach((player) => {
      addItem({
        scene,
        identifier: player.name,
        label: {
          text: player.name,
          color: "#00FF00",
          size: 3,
          offset: 5,
        },
        position: new THREE.Vector3(
          player.position.x,
          player.position.y,
          player.position.z
        ),
        texture: preloadedTextures.hazmat as THREE.Texture,
        scale: new THREE.Vector3(8, 8, 1),
        layerPosition: 1,
      });
    });

    const sulfur: Ore[] = parsed.nodes.sulfur ?? [];
    sulfur.forEach((node) => {
      addItem({
        scene,
        identifier: node.id,
        position: new THREE.Vector3(
          node.position.x,
          node.position.y,
          node.position.z
        ),
        texture: preloadedTextures.sulfur as THREE.Texture,
        scale: new THREE.Vector3(6, 6, 1),
      });
    });

    const metal: Ore[] = parsed.nodes.metal ?? [];
    metal.forEach((node) => {
      addItem({
        scene,
        identifier: node.id,
        position: new THREE.Vector3(
          node.position.x,
          node.position.y,
          node.position.z
        ),
        texture: preloadedTextures.metal as THREE.Texture,
        scale: new THREE.Vector3(6, 6, 1),
      });
    });

    const stone: Ore[] = parsed.nodes.stone ?? [];
    stone.forEach((node) => {
      addItem({
        scene,
        identifier: node.id,
        position: new THREE.Vector3(
          node.position.x,
          node.position.y,
          node.position.z
        ),
        texture: preloadedTextures.stone as THREE.Texture,
        scale: new THREE.Vector3(6, 6, 1),
      });
    });

    const lootContainer: LootContainer[] = parsed.loot ?? [];
    lootContainer.forEach((loot) => {
      if (loot.name === "crate_normal_2")
        addItem({
          scene,
          identifier: loot.id,
          position: new THREE.Vector3(
            loot.position.x,
            loot.position.y,
            loot.position.z
          ),
          texture: preloadedTextures.basic_crate_2 as THREE.Texture,
          scale: new THREE.Vector3(6, 6, 1),
        });
    });
  }, [data]); // Depend on WebSocket data

  return <div ref={mountRef} />;
};

export default RadarScene;
