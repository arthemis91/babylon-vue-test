<template>
  <div  v-if = "isShown" :id = "$style.loginScreen">
    <div :class = "$style.loginBlock">
      <div :class = "$style.loginText">{{$t("loginText")}}</div>
      <div :class = "$style.vkLogin" @click="tryLogin('vk')"></div>
      <div :class = "$style.fbLogin" @click="tryLogin('fb')"></div>
      <div :class = "$style.loginBackground"></div>
      <p v-if = "error" :class = "$style.error"> {{error}} <br /> {{$t("tryAgain")}} </p>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import {
    loadFbSdk,
    getFbLoginStatus
  } from '../socials/facebook.js'
  import {
    loadVKSdk
  } from '../socials/vkontakte.js'

  export default {
    name: 'login-screen',
    data () {
      return {
        fb: {
          appId: '1191296627633361'
        },
        vk: {
          appId: '5717823'
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
      ...mapActions([
        'tryLogin',
        'alreadyLogged'
      ])
    },
    mounted () {
      this.alreadyLogged({userId: 'testUser', network: 'test'})
      loadFbSdk(this.fb.appId)
        .then(getFbLoginStatus)
        .then(response => {
          if (response.status === 'connected') {
            // this.alreadyLogged({userId: response.authResponse.userID, network: 'fb'})
          }
        })
      loadVKSdk(this.vk.appId)
      .then(response => {})
    },
    computed: {
      isShown () {
        return this.$store.state.login.isShown
      },
      error () {
        return this.$store.state.login.error
      }
    }
  }
</script>

<style module>
#loginScreen {
    display: flex;
    width: 100%;
    height: 100%;
    background: url(../assets/login.png);
    background-position: 50%;
    background-size: cover;
}
.loginBlock {
    margin: auto;
    display: flex;
    width: 250px;
    height: 200px;
    border-radius: 16px;
    border: 2px solid #84817a;
    background-color: rgba(0,0,0, 0.8);
    flex-flow: row wrap;
    justify-content: space-around;
}
.loginText{
    color: white;
    margin: auto;
    font-weight: 700;
    font-size: 30px;
    flex: 0 100%;
    text-align: center;
}
.vkLogin {
    width: 70px;
    height: 70px;
    margin-left: auto;
    margin-right: auto;
    background: url(../assets/vk-logo.png);
    background-size: cover;
    border-radius: 10px;
    cursor: pointer;
}

.fbLogin {
    margin-right: auto;
    margin-left: auto;
    width: 70px;
    height: 70px;
    background: url(../assets/fb-logo.png);
    background-size: cover;
    border-radius: 10px;
    cursor: pointer;
}

.disabled {
    opacity: 0.6;
}
.error{
    color: pink;
    margin: auto;
    font-weight: 400;
    font-size: 20px;
    flex: 0 100%;
    text-align: center;
}
</style>
