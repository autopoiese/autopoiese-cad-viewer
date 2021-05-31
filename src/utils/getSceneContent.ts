import * as THREE from 'three'

export const getSceneContent = ({
  scene
}: {
  scene: THREE.Scene
}): THREE.Object3D[] => {
  const content = []
  scene.traverse((object) => {
    if (
      !(object as THREE.Camera).isCamera ||
      !(object as THREE.Scene).isScene
    ) {
      content.push(object)
    }
  })
  return content
}
