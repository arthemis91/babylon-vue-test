import PathFindWorker from 'worker-loader!./PathFind.js'// eslint-disable-line

function angleBetweenTwoVectors (v1, v2) {
  var cosA = (v1.x * v2.x + v1.z * v2.z) / (Math.sqrt(v1.x * v1.x + v1.z * v1.z) * Math.sqrt(v2.x * v2.x + v2.z * v2.z))
  console.log('cosA ', cosA)
  return Math.acos(cosA)
}
/* eslint one-var: ["error", "always"] */
class PathFinder {
  constructor (sizeCell) {
    this.units = []
    this.worker = new PathFindWorker()
    this.worker.postMessage({type: 'init', sizeCell: sizeCell})
    this.worker.onmessage = this.workerResult.bind(this)
  }

  workerResult (e) {
    var _this = this,
      vec,
      angle,
      basePath,
      offset,
      i,
      position
    switch (e.data.type) {

    }
    console.log('calc time ', new Date().getTime() - this.startTime, e.data)
    if (e.data.cache) {
      console.log('cache')
    }

    if (this.units[e.data.id].squad) {
      vec = {x: e.data.path[e.data.path.length - 1][0] - _this.units[e.data.id].mesh.position.x, z: e.data.path[e.data.path.length - 1][1] - _this.units[e.data.id].mesh.position.z}
      angle = angleBetweenTwoVectors(vec, {x: 0, z: 1})
      basePath = []
      if (angle > Math.PI / 2) {
        angle = angle - Math.PI
      } else if (angle < -Math.PI / 2) {
        angle = angle + Math.PI
      }
      this.units[e.data.id].squad.units.forEach(function (unit, num, squad) {
        var path = [],
          length
        unit.positionAngle += angle
        if (unit.positionAngle > 2 * Math.PI) {
          unit.positionAngle -= 2 * Math.PI
        } else if (unit.positionAngle < 0) {
          unit.positionAngle += 2 * Math.PI
        }
        for (i in e.data.path) {
          if (num === 0) {
            offset = _this.units[e.data.id].offset
            length = Math.sqrt(offset.x * offset.x + offset.z * offset.z)
            position = {
              x: e.data.path[i][0] - length * Math.sin(unit.positionAngle),
              z: e.data.path[i][1] - length * Math.cos(unit.positionAngle)
            }
            basePath.push([position.x, position.z])
            path.push([position.x, position.z])
            unit.alligned = false
          } else {
            length = Math.sqrt(unit.offset.x * unit.offset.x + unit.offset.z * unit.offset.z)
            path.push([
              basePath[i][0] + length * Math.sin(unit.positionAngle),
              basePath[i][1] + length * Math.cos(unit.positionAngle)
            ])
          }
        }
        unit.path = path
        unit.moveAnimation()
      })
    } else {
      this.units[e.data.id].path = e.data.path
      this.units[e.data.id].moveAnimation()
    }

    delete this.units[e.data.id]
  }

  getMap () {
    this.worker.postMessage({type: 'getMap'})
  }

  moveEvent (id, next, last) {
    if (!next) {
      this.worker.postMessage({type: 'moveEvent', id: id, isEnd: true})
      return
    }
    this.worker.postMessage({type: 'moveEvent', id: id, next: next, point: last})
  }

  changePosition (id, point) {
    this.worker.postMessage({type: 'changePosition', id: id, point: point})
  }

  find (units, point) {
    this.startTime = new Date().getTime()
    var key,
      unitX,
      unitZ,
      pointX,
      pointZ
    for (key in units) {
      unitX = units[key].mesh.position.x
      unitZ = units[key].mesh.position.z
      pointX = point.x
      pointZ = point.z
      if (unitX === pointX && unitZ === pointZ) {
        continue
      }
      this.units[units[key].id] = units[key]
      this.worker.postMessage({type: 'findPath', id: units[key].id, mesh: {x: unitX, z: unitZ}, point: {x: pointX, z: pointZ}})
    }
  }

  findSquad (squads, point) {
    var key,
      leading,
      unitX,
      unitZ,
      pointX,
      pointZ
    for (key in squads) {
      leading = squads[key].findClosest(point)
      unitX = leading.mesh.position.x
      unitZ = leading.mesh.position.z
      pointX = point.x
      pointZ = point.z
      if (unitX === pointX && unitZ === pointZ) {
        continue
      }
      this.units[leading.id] = leading
      this.worker.postMessage({type: 'findPath', id: leading.id, mesh: {x: unitX, z: unitZ}, point: {x: pointX, z: pointZ}})
    }
  }
}
export default PathFinder
