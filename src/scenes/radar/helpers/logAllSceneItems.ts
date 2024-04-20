export const logAllSceneItems = (scene: THREE.Scene) => {
    const names: string[] = [];
    if (scene)
      scene.traverse(function (object) {
        names.push(object.name); // Add the name of each object to the array
      });

    console.log(names);
}