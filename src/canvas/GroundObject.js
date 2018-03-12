/* eslint one-var: ["error", "always"] */
/* eslint-env es6 */
import BABYLON from 'babylonjs'
class GroundObject {
  constructor (map, callback) {
    var computeHeightMapQuads = this::this.computeHeightMapQuads
    this.options = {
      width: map.width,
      height: map.height,
      subdivisions: map.subDiv,
      minHeight: map.minHeight,
      maxHeight: map.maxHeight,
      onReady: (mesh) => {
        computeHeightMapQuads(mesh)
        if (callback) {
          callback()
        }
      }
    }
  }

  computeHeightMapQuads (mesh) {
    this.mesh = mesh
    this.heightMapQuads = []
    var sub = mesh.subdivisions,
      positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
      v1 = BABYLON.Vector3.Zero(),
      v2 = BABYLON.Vector3.Zero(),
      v3 = BABYLON.Vector3.Zero(),
      v4 = BABYLON.Vector3.Zero(),
      v1v2 = BABYLON.Vector3.Zero(),
      v1v3 = BABYLON.Vector3.Zero(),
      v1v4 = BABYLON.Vector3.Zero(),
      norm1 = BABYLON.Vector3.Zero(),
      norm2 = BABYLON.Vector3.Zero(),
      row,
      col,
      i,
      j,
      k,
      cd,
      h,
      slope,
      d1,
      d2,
      facet1,
      facet2,
      quad
    for (row = 0; row < sub; row++) {
      for (col = 0; col < sub; col++) {
        i = col * 3
        j = row * (sub + 1) * 3
        k = (row + 1) * (sub + 1) * 3
        v1.x = positions[j + i]
        v1.y = positions[j + i + 1]
        v1.z = positions[j + i + 2]
        v2.x = positions[j + i + 3]
        v2.y = positions[j + i + 4]
        v2.z = positions[j + i + 5]
        v3.x = positions[k + i]
        v3.y = positions[k + i + 1]
        v3.z = positions[k + i + 2]
        v4.x = positions[k + i + 3]
        v4.y = positions[k + i + 4]
        v4.z = positions[k + i + 5]
        cd = (v4.z - v1.z) / (v4.x - v1.x)
        h = v1.z - cd * v1.x
        slope = new BABYLON.Vector2(cd, h)
        v2.subtractToRef(v1, v1v2)
        v3.subtractToRef(v1, v1v3)
        v4.subtractToRef(v1, v1v4)
        BABYLON.Vector3.CrossToRef(v1v3, v1v4, norm1)
        BABYLON.Vector3.CrossToRef(v1v4, v1v2, norm2)
        d1 = -(norm1.x * v1.x + norm1.y * v1.y + norm1.z * v1.z)
        d2 = -(norm2.x * v2.x + norm2.y * v2.y + norm2.z * v2.z)
        facet1 = new BABYLON.Vector4(norm1.x, norm1.y, norm1.z, d1)
        facet2 = new BABYLON.Vector4(norm2.x, norm2.y, norm2.z, d2)
        quad = {slope: slope, facet1: facet1, facet2: facet2}
        this.heightMapQuads.push(quad)
      }
    }
  }

  getAltitudeAt (x, z) {
    var col = Math.floor((x + 1 - this.mesh.position.x + this.options.width / 2) * this.options.subdivisions / this.options.width),
      row = Math.floor(-(z + 1 - this.mesh.position.z + this.options.height / 2) * this.options.subdivisions / this.options.height + this.options.subdivisions),
      quad = this.heightMapQuads[row * this.options.subdivisions + col],
      facet,
      y
    if (z < quad.slope.x * (x - this.mesh.position.x + 1) + quad.slope.y) {
      facet = quad.facet1
    } else {
      facet = quad.facet2
    }
    y = -(facet.x * (x - this.mesh.position.x + 1) + facet.z * (z - this.mesh.position.z + 1) + facet.w) / facet.y
    return y
  }
}
export default GroundObject
