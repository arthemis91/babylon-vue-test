/* eslint one-var: ["error", "always"] */
import model1 from '../assets/models/xilithian-castle.babylon'
import model1Texture from '../assets/models/Castle_Medium.png'
import model2 from '../assets/models/tree-un.babylon'
import model2Texture1 from '../assets/models/bark.jpg'
import model2Texture2 from '../assets/models/leaves1.png'
const config = require('../../config')
var assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory,
  path = '/' + assetsSubDirectory + '/models' + config.modelsVer + '/',
  i = 0,
  objectsData = {
    1: {
      id: 1,
      name: 'castle',
      position: {x: 500, y: 100, z: 400},
      model: model1.replace(path, ''),
      scale: {x: 2, y: 2, z: 2},
      path: '.' + path,
      textures: ['.' + model1Texture],
      static: true,
      label: {style: 'cityName', text: 'the Test Scene'}
    }
  }
for (i = 2; i < 103; i++) {
  objectsData[i] = {
    id: 2,
    name: 'tree',
    position: {x: 350 + (i % 10 + Math.random() * 4) * 20, y: 100, z: 250 + (parseInt(i / 10) + Math.random() * 4) * 20},
    model: model2.replace(path, ''),
    scale: {x: 0.7 + Math.random() / 4, y: 0.7 + Math.random() / 4, z: 0.7 + Math.random() / 4},
    path: '.' + path,
    textures: ['.' + model2Texture1, '.' + model2Texture2],
    static: true
  }
}
export default objectsData
