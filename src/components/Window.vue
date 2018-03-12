<template>
  <div :class="$style.window" :id = "id">
    <div :class="$style.title" ref = "title">{{ title }}</div>
    <div :class="$style.text" ref = "text">{{ text }}</div>
    <div v-for="button in buttons" :class="$style[button.class]" @click="button.action"/>
    <div v-if = "beClosed" :class="$style.close" @click="close"/>
  </div>
</template>

<script>
  export default {
    name: 'main-screen',
    data () {
      return {}
    },
    props: {
      id: {
        type: String,
        default () {
          return ''
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      text: {
        type: String,
        default () {
          return ''
        }
      },
      buttons: {
        type: Array,
        default () {
          return []
        }
      },
      beClosed: {
        type: Boolean,
        default () {
          return true
        }
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
    methods: {
      close () {

      }
    },
    mounted () {
      console.log(this)
    },
    updated () {

    },
    computed: {
    }
  }
</script>

<style module>
  .window {
      position: absolute;
      width: 300px;
      height: 500px;
      background-color: rgba(0,0,0, 0.4);
      z-index: 10;
  }
  .title {
    margin: auto;
    display: flex;
    width: 200px;
    background-color: rgba(241, 180, 9, 0.8);
    flex-flow: row wrap;
    justify-content: space-around;
  }
</style>
