<template>
  <div id="app">
    <!-- <router-view/> -->
    <login-screen></login-screen>
    <app-loading-screen></app-loading-screen>
    <map-screen></map-screen>
  </div>
</template>

<script>
  import LoginScreen from './components/LoginScreen.vue'
  import AppLoadingScreen from './components/AppLoadingScreen.vue'
  import MapScreen from './components/MapScreen.vue'
  export default {
    name: 'app',
    components: {
      LoginScreen,
      AppLoadingScreen,
      MapScreen
    }
  }
</script>

<style>
  html, body{
      height: 100%;
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
