export function loadFbSdk (appId, version) {
  return new Promise(resolve => {
    // eslint-disable-next-line
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      const js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
      js.onload = function () {
        // eslint-disable-next-line
        FB.init({
          appId,
          xfbml: false,
          version: 'v2.10',
          cookie: true
        })
        // eslint-disable-next-line
        FB.AppEvents.logPageView()
        resolve('SDK Loaded!')
      }
    }(document, 'script', 'facebook-jssdk'))
  })
}

export function getFbLoginStatus () {
  return new Promise(resolve => {
    // eslint-disable-next-line
    window.FB.getLoginStatus(responseStatus => {
      resolve(responseStatus)
    })
  })
}

export function fbLogin () {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line
      window.FB.login(response => resolve(response), error => reject(new Error(error)))
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    } catch (e) {
      reject(new Error(e))
    }
  })
}
export function fbLogout () {
  return new Promise(resolve => {
    // eslint-disable-next-line
    window.FB.logout(response => resolve(response))
  })
}
