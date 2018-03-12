/* eslint one-var: ["error", "always"] */
class UserActionController {
  constructor (scene) {
    this.scene = scene
    this.selected = []
    this.squads = []
    this.keysPressed = {}
  }

  pressed (code) {
    this.keysPressed[code] = true
  }

  unPressed (code) {
    console.log('unpress ', code)
    delete this.keysPressed[code]
  }
}
export default UserActionController
