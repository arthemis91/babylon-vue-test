<template>
  <div v-if = "isShown" :id = "$style.mapScreen">
    <canvas :id = "$style.mapCanvas" ref = "mapCanvas"
      @pointerup="mouseUpHandler"
      @pointerdown="mouseDownHandler"
      @keydown="keyDownHandler"
      @keyup="keyUpHandler"
      @click.right.prevent="rightClickHandler"
      @click.left="leftClickHandler"
      @mousewheel.prevent="mouseScrollHandler"
      @pointermove="mouseMoveHandler"
      @pointerout="mouseOutHandler"
    />
    <Window v-for="window in windows"
      :key="window.id"
      :id="window.id"
      v-bind:title = "window.title"
      :buttons="window.buttons"
      :text="window.text"
      :beClosed="window.beClosed"
    ></Window>
  </div>
</template>

<script>
  import MapCanvas from '../canvas/main/MapCanvas'
  import PathFinder from '../workers/PathFinder'
  import Window from './Window.vue'
  export default {
    name: 'map-screen',
    data () {
      return {
        windows: []
      }
    },
    i18n: {
      messages: {
        en: {
          loginText: 'Login',
          tryAgain: 'Try again'
        },
        ru: {
          loginText: 'Войдите',
          tryAgain: 'Попробуйте снова'
        }
      }
    },
    components: {
      Window
    },
    methods: {
      keyDownHandler (key) {
        if (this.isReady) {
          this.engine.canvasEvents.keyDownHandler(key)
        }
      },
      keyUpHandler (key) {
        if (this.isReady) {
          this.engine.canvasEvents.keyUpHandler(key)
        }
      },
      rightClickHandler (event) {
        this.engine.canvasEvents.rightClickHandler(event)
      },
      leftClickHandler (event) {
        this.engine.canvasEvents.leftClickHandler(event)
      },
      mouseScrollHandler (event) {
        this.engine.canvasEvents.mouseScrollHandler(event)
      },
      mouseDownHandler (event) {
        this.engine.canvasEvents.mouseDownHandler(event)
      },
      mouseUpHandler (event) {
        this.engine.canvasEvents.mouseUpHandler(event)
      },
      mouseMoveHandler (event) {
        this.engine.canvasEvents.mouseMoveHandler(event)
      },
      mouseOutHandler (event) {
        this.engine.canvasEvents.mouseOutHandler(event)
      }
    },
    mounted () {
    },
    updated () {
      if (this.isShown) {
        this.engine = new MapCanvas({
          canvas: this.$refs.mapCanvas,
          map: this.$store.state.mapScreen.map,
          mapObjects: this.$store.state.mapScreen.objects,
          loadedEvent: this.$store.state.mapScreen.loadedEvent
        })
        this.pathFinder = new PathFinder()
      } else {
        this.mainCanvas.dispose()
      }
    },
    computed: {
      isShown () {
        return this.$store.state.mapScreen.isShown
      },
      isReady () {
        return !this.$store.state.mapScreen.needLoaded
      },
      renderCanvas () {
      }
    }
  }
</script>
<style module>
  #mapScreen {
      position: absolute;
      width: 100%;
      height: 100%;
  }
  #mapCanvas {
      position: absolute;
      width: 100%;
      height: 100%;
  }
</style>
