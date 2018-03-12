export default function setMeshes (mesh) {
  var groundObj = mesh.getScene().groundObj
  this.mesh = mesh
  this.mesh.object = this
  this.path = []
  if (this.defaultPosition) {
    this.mesh.position.x = this.defaultPosition.x
    this.mesh.position.z = this.defaultPosition.z
    this.mesh.position.y = groundObj ? groundObj.getAltitudeAt(this.defaultPosition.x, this.defaultPosition.z) : this.defaultPosition.y
  }
}
