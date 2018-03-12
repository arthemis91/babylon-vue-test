/* eslint one-var: ["error", "always"] */
import MapObject from './MapObject'
class MapObjectList {
  constructor (objects, sceneLoader) {
    var key
    for (key in objects) {
      this.createObject(objects[key], sceneLoader)
    }
  }

  createObject (data, sceneLoader) {
    var obj = new MapObject(data)
      /* var obj = {scale: {x: 50, y: 50, z: 50}};
      obj.x = data.position.x;
      obj.y = data.position.y;
      obj.z = data.position.z; */
    sceneLoader.addMesh({object: obj, mesh: data.model, path: data.path, label: data.label})
  }
}
export default MapObjectList
