import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Player, Position } from "./radarData.interface";
import {
  FontLoader,
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/Addons.js";
import { useWebSocket } from "../test/websocket";

const convertGamePositionToMap = (position: Position): THREE.Vector3 => {
  const v3: THREE.Vector3 = new THREE.Vector3();
  const mapScale = 0.26;
  const x = position.x * mapScale;
  const y = position.z * mapScale;
  v3.set(x, y, 0.1);

  return v3;
};

let mapWidth;
let mapHeight;
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
    mapWidth = planeWidth;
    mapHeight = planeHeight;
    console.log(`Map Dimensions: ${planeWidth}x${planeHeight}`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setZ(0);

    // Add mesh to the scene
    scene.add(mesh);
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

export interface IPlayerSceneItem {
  dot?: THREE.Mesh;
  text?: THREE.Mesh;
}

export interface IPlayerSceneItems {
  [key: string]: IPlayerSceneItem;
}
const playerSceneItems: IPlayerSceneItems = {};
const addPlayer = async (scene: THREE.Scene, player: Player): void => {
  // Create a circle
  let circle;
  let text;
  if (!playerSceneItems[player.name]) {
    const circleGeometry = new THREE.CircleGeometry(3, 32); // Adjust radius and segments
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false,
      opacity: 0.9,
    });
    circle = new THREE.Mesh(circleGeometry, circleMaterial);
    scene.add(circle);

    text = await addText(player.name, "#FF0000", { size: 5 });

    playerSceneItems[player.name] = { dot: circle, text };
    if (text) scene.add(text);
  } else {
    circle = playerSceneItems[player.name].dot;
    text = playerSceneItems[player.name].text;
  }

  const position = convertGamePositionToMap(player.position);
  circle?.position.set(position.x, position.y, 0.1);
  const textPosition = position;
  textPosition.setZ(0.1);
  textPosition.setY(position.y - 10);
  if (text) alignText(text, textPosition);

  // Add to the scene
};

const RadarScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const data = useWebSocket();

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
    const parsed = JSON.parse(data ?? "{}");

    const players: Player[] = parsed.players ?? [];
    players.forEach((player) => {
      addPlayer(scene, player);
    });

    const previousPlayers = Object.keys(playerSceneItems);
    previousPlayers.forEach((itemKey) => {
      if (!players.find((player) => player.name == itemKey))
        delete playerSceneItems[itemKey];
    });

    // You may need to re-render the scene here if necessary
  }, [data]); // Depend on WebSocket data

  return <div ref={mountRef} />;
};

export default RadarScene;
