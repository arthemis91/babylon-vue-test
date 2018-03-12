/* eslint one-var: ["error", "always"] */
import BABYLON from 'babylonjs'
class SceneLoader {
  constructor (scene) {
    this.loader = new BABYLON.AssetsManager(scene)
    this.meshes = []
    this.meshTask = []
  }

  addMesh ({object, mesh, path, label}) {
    var contains = false,
      key
    for (key in this.meshes) {
      if (this.meshes[key].mesh === mesh) {
        contains = true
        if (object.static) {
          object.instance = true
        }
        this.meshes[key].objects.push(object)
        break
      }
    }
    if (!contains) {
      this.meshes.push({mesh: mesh, objects: [object], path: path, label: label})
    }
  }

  createMeshes (newMeshes) {
    var shadowMap = newMeshes.loadedMeshes[0].getScene().lights[0]._shadowGenerator.getShadowMap(),
      key,
      baseMesh,
      mesh,
      children,
      instanceChild,
      skeleton,
      i
    for (key in this.objects) {
      if (newMeshes.loadedMeshes.length > 1) {
        baseMesh = BABYLON.Mesh.CreateBox(this.mesh.replace('.babylon', '') + '_base', 1, newMeshes.loadedMeshes[0].getScene())
        for (i in newMeshes.loadedMeshes) {
          newMeshes.loadedMeshes[i].parent = baseMesh
          newMeshes.loadedMeshes[i].scaling = new BABYLON.Vector3(
            this.objects[key].scale.x,
            this.objects[key].scale.y,
            this.objects[key].scale.z
          )
        }
        baseMesh.isVisible = false
        baseMesh.visibility = 0
      } else {
        baseMesh = newMeshes.loadedMeshes[0]
      }
      if (this.objects[key].instance) {
        mesh = baseMesh.createInstance(this.mesh.replace('.babylon', '') + '_instance_' + key)
        children = baseMesh.getChildren()
        for (i in children) {
          instanceChild = children[i].createInstance(this.mesh.replace('.babylon', '') + '_instance_' + key + '_child_' + i)
          instanceChild.parent = mesh
        }
      } else {
        mesh = baseMesh.clone(this.mesh.replace('.babylon', '') + '_' + key)
        children = mesh.getChildren()
      }
      mesh.scaling = new BABYLON.Vector3(
        this.objects[key].scale.x,
        this.objects[key].scale.y,
        this.objects[key].scale.z
      )
      shadowMap.renderList.push(mesh)
      if (newMeshes.loadedSkeletons.length !== 0) {
        skeleton = newMeshes.loadedSkeletons[0].clone()
        for (i in children) {
          children[i].skeleton = skeleton
          children[i].scaling = new BABYLON.Vector3(this.scale.x, this.scale.y, this.scale.z)
          if (parseInt(this.objects[key].id.replace('unit', '')) < 9) {
            shadowMap.renderList.push(children[i])
          }
        }
        this.objects[key].setAnimations(skeleton)
      }
      this.objects[key].setMeshes(mesh)
      if (this.label) {
        this.objects[key].createLabel({mesh: mesh, data: this.label})
      }
    }

    for (i in newMeshes.loadedMeshes) {
      newMeshes.loadedMeshes[i].isVisible = false
    }

    baseMesh.position = new BABYLON.Vector3(-1000, -1000, 0)
  }

  createMeshTasks () {
    var key,
      meshTask
    for (key in this.meshes) {
      meshTask = this.loader.addMeshTask('mesh ' + this.meshes[key].mesh, '', this.meshes[key].path, this.meshes[key].mesh)
      meshTask.onSuccess = this.meshes[key]::this.createMeshes
    }
  }

  onFinish () {
  }

  start () {
    this.loader.load()
    this.loader.onFinish = this.onFinish
  }
}
export default SceneLoader
