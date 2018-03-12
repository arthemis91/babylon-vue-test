import setMeshes from '../MeshesComponent'
import {createLabel} from '../TextComponent'
class MapObject {
  constructor (data) {
    this.scale = data.scale
    this.defaultPosition = data.position
    this.static = data.static
  }
  setMeshes = this::setMeshes
  createLabel = this::createLabel
}
export default MapObject
