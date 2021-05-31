export const isOrthographicCamera = (
  def: THREE.Camera
): def is THREE.OrthographicCamera =>
  def && (def as THREE.OrthographicCamera).isOrthographicCamera

export const isPerspectiveCamera = (
  def: THREE.Camera
): def is THREE.PerspectiveCamera =>
  def && (def as THREE.PerspectiveCamera).isPerspectiveCamera
