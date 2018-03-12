/* eslint one-var: ["error", "always"] */
import CameraControl from './CameraControl'
class CanvasEventsHandler {
  constructor (controller, groundObject) {
    this.userActionController = controller
    this.minCameraMoveZone = {width: 100, height: 50}
    this.canvas = this.userActionController.scene.getEngine()._renderingCanvas
    this.cameraController = new CameraControl(this.userActionController.scene, groundObject)
  }

  rightClickHandler (e) {
    var scene = this.userActionController.scene,
      pick = scene.pick(scene.pointerX, scene.pointerY)
    if (!pick.hit) {
      return false
    }
    return false
  }

  leftClickHandler (e) {
    var scene = this.userActionController.scene,
      pick = scene.pick(scene.pointerX, scene.pointerY)
    if (!pick.hit) {
      return false
    }
  }

  mouseDownHandler (e) {
    this.checkCameraRotationStart(e)
  }

  mouseOutHandler (e) {
    this.cameraController.stopMove()
  }

  mouseMoveHandler (e) {
    var x = e.pageX,
      y = e.pageY
    this.checkCameraRotation(x, y)
    this.checkSelectFrameStretch(x, y)
    this.checkCameraMoveOnEdge(x, y)
  }

  mouseUpHandler (e) {
    this.checkCameraRotationEnd(e)
  }

  mouseLeaveHandler (e) {
    this.cameraController.stopMove()
  }

  mouseScrollHandler (e) {
    if (e.deltaY > 0) {
      this.cameraController.forth()
    } else {
      this.cameraController.closer()
    }
  }

  checkSelectFrameStart (e) {
    if (e.button !== 0) {
      return
    }
    var scene = this.userActionController.scene,
      pick = scene.pick(scene.pointerX, scene.pointerY)
    if (!pick.hit) {
      return
    }
    if (pick.pickedMesh.id === 'ground') {
      this.leftMouseButtonDown = {
        scene: {x: pick.pickedPoint.x, z: pick.pickedPoint.z},
        page: {x: scene.pointerX, y: scene.pointerY}
      }
    } else if (pick.pickedMesh.parent.unit) {
      this.leftMouseButtonDown = {
        scene: {x: pick.pickedMesh.parent.position.x, z: pick.pickedMesh.parent.position.z},
        page: {x: scene.pointerX, y: scene.pointerY}
      }
    }
  }

  checkSelectFrameStretch (x, y) {
    var begin
    if (this.leftMouseButtonDown) {
      begin = this.leftMouseButtonDown.page
      if (Math.abs(x - begin.x) > 2 && Math.abs(y - begin.y)) {
        this.mouseMove = true
      }
      this.userActionController.drawSelectFrame(begin, {x: x, y: y})
    }
  }

  checkSelectFrameEnd (e) {
    if (!this.mouseMove) {
      this.leftMouseButtonDown = false
      return
    }
    var scene = this.userActionController.scene,
      pick
    this.userActionController.hideSelectFrame()
    if (this.leftMouseButtonDown) {
      pick = scene.pick(e.pageX, e.pageY)
      if (pick.hit && pick.pickedMesh.id === 'ground') {
        this.userActionController.frameSelectUnits(
          this.leftMouseButtonDown.scene,
          {x: pick.pickedPoint.x, z: pick.pickedPoint.z}
        )
      }
    }
    this.mouseMove = false
    this.leftMouseButtonDown = false
  }

  keyCodeProxy (code) {
    switch (code) {
      case 65: // Left
        code = 65
        break

      case 87: // up
        code = 87
        break

      case 68: // right
        code = 68
        break

      case 83: // down
        code = 83
        break
    }
    return code
  }

  checkKeysPressed (type) {
    var pressed = false,
      codes = [],
      key
    switch (type) {
      case 'move':
        codes = [65, 68, 83, 87]
        break
      case 'rotation':
        codes = [81, 69]
        break
    }
    for (key in codes) {
      if (this.userActionController.keysPressed[codes[key]]) {
        pressed = codes[key]
        break
      }
    }
    return pressed
  }

  keyDownHandler (key) {
    var code = this.keyCodeProxy(key.keyCode)
    this.userActionController.pressed(code)
    this.checkCameraMoveKeys(code)
    this.checkCameraRotateKeys(code)
  }

  keyUpHandler (key) {
    var code = this.keyCodeProxy(key.keyCode),
      keyPressed
    this.userActionController.unPressed(code)
    switch (code) {
      case 65: // Left
      case 87: // up
      case 68: // right
      case 83: // down
        keyPressed = this.checkKeysPressed('move')
        if (keyPressed) {
          this.checkCameraMoveKeys(keyPressed)
        } else {
          this.cameraController.stopMove()
        }
        break
      case 69:
      case 81:
        keyPressed = this.checkKeysPressed('rotation')
        this.cameraController.stopRotation()
        if (keyPressed) {
          this.checkCameraRotateKeys(keyPressed)
        }
        break
    }
  }

  checkCameraMoveOnEdge (x, y) {
    var offset = {x: 0, y: 0, z: 0}
    if (this.checkKeysPressed('move') || this.cameraController.rotateBeginPoint) {
      return
    }
    if (y <= 10) {
      offset.z = 2
    } else if (y >= window.innerHeight - 25) {
      offset.z = -2
    }
    if (x <= 10) {
      offset.x = -2
    } else if (x >= window.innerWidth - 25) {
      offset.x = 2
    }
    if (offset.x === 0 && offset.z === 0) {
      this.cameraController.stopMove()
      return
    }
    this.cameraController.movement(offset)
  }

  checkCameraRotateKeys (code) {
    var direction
    switch (code) {
      case 81: // right
        direction = {x: 0, y: -0.25, z: 0}
        break
      case 69: // left
        direction = {x: 0, y: 0.25, z: 0}
        break
    }
    if (direction) {
      this.cameraController.rotation(direction)
    }
  }

  checkCameraMoveKeys (code) {
    var offset
    switch (code) {
      case 65: // Left
        offset = {x: -2, y: 0, z: 0}
        if (this.userActionController.keysPressed[87]) {
          offset.z = 2
        } else if (this.userActionController.keysPressed[83]) {
          offset.z = -2
        }
        break
      case 87: // up
        offset = {x: 0, y: 0, z: 2}
        if (this.userActionController.keysPressed[65]) {
          offset.x = -2
        } else if (this.userActionController.keysPressed[68]) {
          offset.x = 2
        }
        break
      case 68: // right
        offset = {x: 2, y: 0, z: 0}
        if (this.userActionController.keysPressed[87]) {
          offset.z = 2
        } else if (this.userActionController.keysPressed[83]) {
          offset.z = -2
        }
        break
      case 83: // down
        offset = {x: 0, y: 0, z: -2}
        if (this.userActionController.keysPressed[65]) {
          offset.x = -2
        } else if (this.userActionController.keysPressed[68]) {
          offset.x = 2
        }
        break
    }
    if (offset) {
      this.cameraController.movement(offset)
    }
  }

  checkCameraRotationStart (e) {
    if (e.button !== 1) {
      return
    }
    this.cameraController.stopMove()
    this.cameraController.rotateBeginPoint = {x: e.pageX, y: e.pageY}
  }

  checkCameraRotationEnd (e) {
    if ((e && e.button !== 1) || this.userActionController.keysPressed[81] || this.userActionController.keysPressed[69]) {
      return
    }
    this.cameraController.stopRotation()
  }

  checkCameraRotation (x, y) {
    if (this.cameraController.rotateBeginPoint) {
      this.cameraController.rotateMouseMoving({x: x, y: y})
    }
  }
}

export default CanvasEventsHandler
