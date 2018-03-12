/* eslint one-var: ["error", "always"] */
import BABYLON from 'babylonjs'
class CameraControl {
  constructor (scene, groundObject) {
    this.scene = scene
    this.camera = this.scene.activeCamera
    this.groundObject = groundObject
    this.minY = 150
    this.maxY = 600
    this.rotateDirection = {y: 0, z: 0}
    this.scrollSpeed = 0
  }

  movement (offset, once) {
    var offsetWithRotate = {y: offset.y},
      angle = -this.camera.rotation.y,
      cameraMove
    offsetWithRotate.x = offset.x * Math.cos(angle) - offset.z * Math.sin(angle)
    offsetWithRotate.z = offset.x * Math.sin(angle) + offset.z * Math.cos(angle)
    this.cameraOffset = offsetWithRotate
    if (this.movingCameraInterval) {
      return
    }
    clearInterval(this.movingCameraInterval)
    cameraMove = function () {
      var camera = this.camera,
        newX = camera.position.x + this.cameraOffset.x,
        newY = camera.position.y + this.cameraOffset.y,
        newZ = camera.position.z + this.cameraOffset.z
      camera.position.x = newX
      camera.position.y = newY
      camera.position.z = newZ
    }
    if (once) {
      cameraMove.call(this)
      return
    }
    this.movingCameraInterval = setInterval(cameraMove.bind(this), 0)
  }

  stopMove () {
    clearInterval(this.movingCameraInterval)
    this.movingCameraInterval = false
    this.cameraOffset = {x: 0, y: 0, z: 0}
  }

  forth () {
    var offset = {x: 0, y: 10, z: 0}
    if (this.camera.position.y + offset.y <= this.maxY) {
      this.cameraScroll(offset)
    }
  }

  closer () {
    var offset = {x: 0, y: -10, z: 0}
    if (this.camera.position.y - offset.y > this.minY) {
      this.cameraScroll(offset)
    }
  }

  cameraScroll (offset) {
    this.scrollSpeed += 4
    offset.y = offset.y * this.scrollSpeed
    setTimeout(() => { this.scrollSpeed -= 4 }, 50)
    this.moveWithAnimation({offset: offset, time: 60, frames: 20})
  }

  moveWithAnimation ({offset, time, frames}) {
    var animationMove = new BABYLON.Animation(
      'cameraMoveAnimation',
      'position',
      time,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    ),
      keys = []
    this.camera.animations = []
    keys.push({
      frame: 0,
      value: new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    })
    keys.push({
      frame: frames,
      value: new BABYLON.Vector3(
        this.camera.position.x + offset.x,
        this.camera.position.y + offset.y,
        this.camera.position.z + offset.z)
    })
    animationMove.setKeys(keys)
    this.camera.animations.push(animationMove)
    this.scene.beginAnimation(this.camera, 0, frames, false)
  }
  rotation (direction) {
    if (direction) {
      this.rotateDirection = direction
    }
    if (this.rotationCameraInterval) {
      return
    }
    clearInterval(this.rotationCameraInterval)

    var cameraRotate = function () {
      var camera = this.camera,
        scene = this.scene,
        newY = camera.rotation.y + this.rotateDirection.y,
        newZ = camera.rotation.z + this.rotateDirection.z,
        animationRotate = new BABYLON.Animation(
          'rotateAnimation',
          'rotation',
          60,
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        ),
        keys = []
      camera.animations = []
      keys.push({
        frame: 0,
        value: new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z)
      })
      keys.push({
        frame: 6,
        value: new BABYLON.Vector3(camera.rotation.x, newY, newZ)
      })
      animationRotate.setKeys(keys)
      camera.animations.push(animationRotate)
      scene.beginAnimation(camera, 0, 6, false)
    }
    this.rotationCameraInterval = setInterval(cameraRotate.bind(this), 100)
  }

  stopRotation () {
    clearInterval(this.rotationCameraInterval)
    this.rotateBeginPoint = false
    this.rotationCameraInterval = false
    this.rotateDirection = {y: 0, z: 0}
  }

  rotateMouseMoving (point) {
    if (point.x > this.rotateBeginPoint.x) {
      this.rotateDirection.y = 0.25
    } else {
      this.rotateDirection.y = -0.25
    }
    this.rotation()
    this.rotateBeginPoint = point
  }
}
export default CameraControl
