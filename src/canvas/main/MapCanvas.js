/* eslint one-var: ["error", "always"] */
import GroundObject from '../GroundObject'
import CanvasEvents from '../CanvasEventsHandlers'
import UserActionController from './UserActionController'
import SceneLoader from '../SceneLoader'
import MapObjectList from './MapObjectList'
import {createText} from '../TextComponent'
import BABYLON from 'babylonjs'

class MapCanvas {
  constructor ({canvas, loadedEvent, map, mapObjects}/* , completePreloaderTask,  */) {
    var engine = new BABYLON.Engine(canvas, true),
      scene = new BABYLON.Scene(engine),
      light = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(0.5, -0.2, 0.5), scene),
      camera = new BABYLON.FreeCamera('sceneCamera', new BABYLON.Vector3(400, 150, 210), scene),
      groundObj = new GroundObject(map, () => {
        setTimeout(() => {
          sceneLoader.createMeshTasks()
          sceneLoader.onFinish = function () {
            loadedEvent()
            loadedEvent()
            scene.createOrUpdateSelectionOctree()
          }
          sceneLoader.start()
          setTimeout(loadedEvent, 200)
        }, 100)
      }),
      ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', map.heightMap, groundObj.options, scene),
      groundMaterial = new BABYLON.StandardMaterial('custommat', scene),
      shadowGenerator = new BABYLON.ShadowGenerator(2048, light),
      userActionController = new UserActionController(scene),
      sceneLoader = new SceneLoader(scene)/* ,
      mapObjectList = */
    scene.groundObj = groundObj
    this.mapObjectList = new MapObjectList(mapObjects, sceneLoader)
    // groundMaterial.diffuseTexture = new BABYLON.CustomProceduralTexture('customtext', map.texture, 512, scene, true)
    engine.canvasEvents = new CanvasEvents(userActionController, groundObj)

    groundMaterial.diffuseTexture = new BABYLON.Texture(map.texture, scene)
    groundMaterial.diffuseTexture.uScale = 100
    groundMaterial.diffuseTexture.vScale = 100
    groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2)
    groundMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0)
    groundMaterial.diffuseTexture.uScale = 10.0
    groundMaterial.diffuseTexture.vScale = 10.0
    ground.material = groundMaterial
    ground.receiveShadows = true
    ground.position = {x: 500, y: 0, z: 500}
    camera.rotation.x = 0.7
    camera.rotation.y = 0.3
    camera.minZ = 1.0
    shadowGenerator.useExponentialShadowMap = false
    light.position = new BABYLON.Vector3(50, 250, 200)
    light.shadowOrthoScale = 2.0
    scene.clearColor = new BABYLON.Color3(0.5, 0.7, 0.9)
    scene.ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    scene.ui.idealWidth = 1000
    scene.ui.idealHeight = 500
    scene.ui.useSmallestIdeal = true
    createText({
      parent: scene.ui,
      data: {
        style: 'mapScreenHelp',
        text: 'camera control WASD QE or the mouse cursor on the edge of the screen and the mouse wheel'
      }
    })
    engine.runRenderLoop(() => {
      if (scene) {
        scene.render()
      }
    })

    window.addEventListener('resize', function () {
      engine.resize()
    })
    scene.registerBeforeRender(function () {
      // commonRender.tickRender()
    })
    return engine
        /* var engine = new BABYLON.Engine(canvas, true),
            scene = new BABYLON.Scene(engine),
            light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene),
            camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(200, 400, 110), scene),
            groundObj = new GroundObject(1000, 1000, 100, 0, 100, () => {setTimeout(() => {
                completePreloaderTask('createGround');
                sceneLoader.createMeshTasks()
                sceneLoader.onFinish = function () {
                    completePreloaderTask('createObjects')
                     scene.createOrUpdateSelectionOctree()
                }
                sceneLoader.start()
            }, 100)}),
            ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "../assets/globalheightmap.png", groundObj.options, scene),
            groundMaterial = new BABYLON.StandardMaterial("custommat", scene),
            shadowGenerator = new BABYLON.ShadowGenerator(2048, light),
            sceneLoader = new SceneLoader(scene, '../assets/', groundObj),
            mapObjectList =  new MapObjectList(mapObjects, sceneLoader)
        camera.rotation.x = 1.0
        camera.rotation.y = 0.3
        camera.minZ = 1.0

        light.position = new BABYLON.Vector3(50, 250, 200)
        light.shadowOrthoScale = 2.0

        scene.clearColor =  new BABYLON.Color3(0.5, 0.7, 0.9)

        groundMaterial.diffuseTexture = new BABYLON.CustomProceduralTexture("customtext", "./assets/customProceduralTextures/land", 512, scene, true)
        groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2)
        groundMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0)
        groundMaterial.diffuseTexture.uScale = 10.0
        groundMaterial.diffuseTexture.vScale = 10.0
        ground.material = groundMaterial
        ground.receiveShadows = true
        ground.position = {x: 500, y: 0, z: 500}

        shadowGenerator.useVarianceShadowMap = true; */
        /* var sceneLoader = new SceneLoader(scene, '../assets/', groundObj),
        mapObjectList =  new MapObjectList(mapObjects, sceneLoader)
        // unitList = new UnitsList([], [walkingObject], sceneLoader),
        sceneLoader.createMeshTasks()
        sceneLoader.onFinish = function () {
            var toGround = function () {
                this.mesh.position.y = groundObj.getAltitudeAt(this.mesh.position.x , this.mesh.position.z);
            },
            simulationUnitsList  = {},
            simulation = new SimulationInterface();
            units.forEach(function (unit) {
                unit.mesh.position = new BABYLON.Vector3(unit.x, unit.y, unit.z)
                delete unit.x
                delete unit.y
                delete unit.z
                unit.ground = groundObj
                // unit.mesh.position.y = groundObj.getAltitudeAt(unit.mesh.position.x , unit.mesh.position.z)
                var squad = false
                if (unit.squad){
                    squad = unit.squad.id
                }
                simulationUnitsList[unit.id] = {unit: unit, squad: squad, x: unit.mesh.x, y: unit.mesh.y, z: unit.mesh.z, size: unit.cellSize}
                unit.toGround = toGround.bind(unit)
                commonRender.addRender(unit.id, unit.toGround)
                unit.simulation = simulation
            })
            simulation.initObjects([], simulationUnitsList, 10)
            simulation.start()
            engine.hideLoadingUI()
            /* var octree = scene.createOrUpdateSelectionOctree(64, 2)
            units.forEach(function (unit) {
                octree.dynamicContent.push(unit.mesh)
            })
            completePreloaderTask('createObjects')
        }
        sceneLoader.start() */

        /* var userActionController = new UserActionController(scene),
        userActionListener = new UserActionListener(userActionController, groundObj)
        userActionListener.addHadlers()

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render()
            }
        })

        window.addEventListener("resize", function () {
            engine.resize()
        })
        scene.registerBeforeRender(function () {
            commonRender.tickRender()
        }) */
        // setTimeout(() => {engine.stopRenderLoop()}, 5000)
        // setTimeout(() => {engine.runRenderLoop(() => { if (scene) { scene.render(); } })}, 10000)
  }
}
export default MapCanvas
