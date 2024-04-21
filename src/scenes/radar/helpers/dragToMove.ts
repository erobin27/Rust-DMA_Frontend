import * as THREE from "three";

export const dragToMoveCamera = (
  scene?: THREE.Scene | null,
  camera?: THREE.OrthographicCamera | null,
  renderer?: THREE.WebGLRenderer | null,
  zoomScale?: number
) => {
  if (!scene || !camera || !renderer || !zoomScale) return;

  // Assuming these variables are scoped appropriately to be accessible in your event handlers
  let isDragging = false;
  const initialMousePosition = new THREE.Vector2();
  const initialCameraPosition = new THREE.Vector2();

  const onMouseDown = (event) => {
    // Calculate normalized device coordinates (-1 to +1) for both dimensions
    initialMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    initialMousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    initialCameraPosition.x = camera.position.x;
    initialCameraPosition.y = camera.position.y;

    isDragging = true;
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;

    const mousePosition = new THREE.Vector2();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const deltaX =
      ((mousePosition.x - initialMousePosition.x) *
        (camera.right - camera.left)) /
      2;
    const deltaY =
      ((mousePosition.y - initialMousePosition.y) *
        (camera.top - camera.bottom)) /
      2;

    camera.position.x = initialCameraPosition.x - deltaX * (zoomScale / 5);
    camera.position.y = initialCameraPosition.y - deltaY * (zoomScale / 5);

    // Request a render or use any existing render loop
    renderer.render(scene, camera);
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  // Adding these event listeners to your canvas or renderer
  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.domElement.addEventListener("mouseup", onMouseUp);
  renderer.domElement.addEventListener("mouseleave", onMouseUp); // Optional, for when the mouse leaves the canvas
};
