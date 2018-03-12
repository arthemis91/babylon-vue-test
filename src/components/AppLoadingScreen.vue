<template>
  <div v-if = "isShown" :id = "$style.preloader">
    <div :id = "$style.progressBar">
      <div :class = "$style.bar" :style="{width: loaded}"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app-loading-screen',
    data () {
      return {
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
    },
    mounted () {
    },
    computed: {
      isShown () {
        var store = this.$store.state.appLoading
        return store.isShown
      },
      loaded () {
        var store = this.$store.state.appLoading
        return 100 * (store.loaded / store.needToLoad) + '%'
      }
    }
  }
</script>

<style module>
  #preloader {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(../assets/login.png);
    background-position: 50%;
    background-size: cover;
    background-color: black;
    z-index: 10;
  }
  #progressBar {
      margin-left: auto;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: 50px;
      width: 600px;
      height: 30px;
      background: radial-gradient(ellipse at center, rgba(23,1,0,1) 0%, rgba(0,0,0,1) 100%);
      border-radius: 10px;
  }
  #progressBar .bar{
      background: linear-gradient(180deg, rgba(255,155,74,1) 0%, rgba(0,0,0,1) 100%);
      height: 24px;
      margin-top: 1px;
      width: 0%;
      border-radius: 10px;
      border: 2px solid #877747;
      transition: width .2s linear;
  }
</style>
