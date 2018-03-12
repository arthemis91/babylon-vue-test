/* eslint-disable */
import BABYLON from 'babylonjs'
import GUI from 'babylonjs-gui'
import styles from './textStyles'

export function createLabel ({mesh, data}) {
  var label = new BABYLON.GUI.Rectangle('label for ' + mesh.name),
    ui = mesh.getScene().ui,
    text = new BABYLON.GUI.TextBlock()
  mesh.label = label
  label.background = styles.label[data.style].background
  label.height = styles.label[data.style].height + 'px'
  label.alpha = styles.label[data.style].alpha
  label.width = styles.label[data.style].widthForUnit * data.text.length + 'px'
  label.color = styles.label[data.style].color
  label.cornerRadius = styles.label[data.style].cornerRadius
  label.thickness = styles.label[data.style].thickness
  label.linkOffsetY = styles.label[data.style].linkOffsetY
  ui.addControl(label)
  label.linkWithMesh(mesh)
  text.text = data.text
  text.color = styles.label[data.style].textColor
  text.resizeToFit = true
  label.addControl(text)
}
export function createText ({parent, data}) {
   var text = new BABYLON.GUI.TextBlock()
   text.text = data.text
   text.color = styles[data.style].color
   text.fontSize = styles[data.style].fontSize
   text.textWrapping = true
   text.width = styles[data.style].width + 'px'
   text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
   text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
	 text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
   parent.addControl(text)
}
