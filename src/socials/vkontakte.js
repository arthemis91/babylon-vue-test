export function loadVKSdk (appId) {
  return new Promise(resolve => {
    // eslint-disable-next-line
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      const js = d.createElement(s)
      js.id = id
      js.src = '//vk.com/js/api/openapi.js?151'
      fjs.parentNode.insertBefore(js, fjs)
      js.onload = function () {
        // eslint-disable-next-line
        VK.init({
          apiId: appId
        })
        resolve('SDK Loaded!')
      }
    }(document, 'script', 'vk-jssdk'))
  }, error => new Error(error))
}
export function vkLogin () {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line
      VK.Auth.login(response => resolve(response), error => reject(new Error(error)), 4)
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 60000)
    } catch (e) {
      reject(new Error(e))
    }
  })
}
