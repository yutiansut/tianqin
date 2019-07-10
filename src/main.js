import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// import './registerServiceWorker'
import './plugins/iview.js'
import tqsdk from './plugins/tqsdk.js'

tqsdk.on('ready', function () {
  store.commit('SET_TAGS_QOUTES_MAP', tqsdk.quotesInfo)
})
tqsdk.on('error', function () {
  Vue.prototype.$Message.error('获取合约列表失败，请检查网络后刷新页面。')
})

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  console.error(err, vm, info)
}

Vue.filter('toFixed', function (value, decs) {
  let n = Number(value)
  decs = Number.isInteger(decs) ? decs : 2
  return Number.isFinite(n) ? n.toFixed(decs) : value
})

const RootData = {
  name: 'tianqin-web',
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth,
  appSplit: 1.0
}

const RootApp = new Vue({
  data: RootData,
  router,
  store,
  render: h => h(App),
  methods: {
    handlerResize: function () {
      RootData.windowHeight = window.innerHeight
      RootData.windowWidth = window.innerWidth
      this.$emit('global:resize')
    }
  },
  created: () => {
    // https://developer.mozilla.org/en-US/docs/Web/Events/resize
    window.addEventListener('resize', resizeThrottler, false)
    let resizeTimeout

    function resizeThrottler () {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null
          RootApp.handlerResize()
        }, 66)
      }
    }
  },
  errorCaptured: (err, vm, info) => {
    console.error('App.errorCaptured', err, vm, info)
    return false
  }

}).$mount('#app')
