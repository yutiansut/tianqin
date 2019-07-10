import Vue from 'vue'
import TQSDK from 'tqsdk'
import moment from 'moment'

let wsTradeUrl = 'wss://t.shinnytech.com/trade/shinny'
if (process && process.env.NODE_ENV == 'development') {
  // wsTradeUrl = 'wss://test_t.shinnytech.com/trade/shinny'; // 测试环境
}

let tqsdk = new TQSDK({
  client_app_id: 'SHINNY_XQ_1.0',
  wsTradeUrl: wsTradeUrl
})

window.tqsdk = tqsdk

const VERSION = Number(Vue.version.split('.')[0])
const NOOP = () => {}
let eventMap = {}
let vmEventMap = {}
let globalRE = /^global:/

let tqVmEventMap = {}
let tqsdkRE = /^tqsdk:/

function mixinEvents (Vue) {
  let on = Vue.prototype.$on
  let emit = Vue.prototype.$emit

  Vue.prototype.$on = function proxyOn (eventName, fn = NOOP) {
    const vm = this
    if (Array.isArray(eventName)) {
      eventName.forEach((item) => vm.$on(item, fn))
    } else if (globalRE.test(eventName)) {
      (vmEventMap[vm._uid] || (vmEventMap[vm._uid] = [])).push(eventName)
      ;(eventMap[eventName] || (eventMap[eventName] = [])).push(vm)
      on.call(vm, eventName, fn)
    } else if (tqsdkRE.test(eventName)) {
      if (!tqVmEventMap[vm._uid]) tqVmEventMap[vm._uid] = {}
      let tq_eventName = eventName.match(/^tqsdk:(.*)/)[1]
      if (!tqVmEventMap[vm._uid][tq_eventName]) tqVmEventMap[vm._uid][tq_eventName] = []
      let temp_fn = fn.bind(vm)
      tqVmEventMap[vm._uid][tq_eventName].push(temp_fn)
      tqsdk.on(tq_eventName, temp_fn)
    } else {
      on.call(vm, eventName, fn)
    }
    return vm
  }

  Vue.prototype.$emit = function proxyEmit (eventName, ...args) {
    const vm = this
    if (globalRE.test(eventName)) {
      const vmList = eventMap[eventName] || []
      vmList.forEach(item => emit.apply(item, [eventName, ...args]))
    } else {
      emit.apply(vm, [eventName, ...args])
    }
    return vm
  }
}

function applyMixin (Vue) {
  Vue.mixin({
    beforeDestroy () {
      const vm = this
      const events = vmEventMap[vm._uid] || []
      events.forEach((event) => {
        const targetIdx = eventMap[event].findIndex(item => item._uid === vm._uid)
        eventMap[event].splice(targetIdx, 1)
      })
      delete vmEventMap[vm._uid]

      const tqevents = tqVmEventMap[vm._uid] || {}
      for (let eventName in tqevents) {
        let eventsArr = tqevents[eventName]
        eventsArr.forEach((fn) => {
          tqsdk.off(eventName, fn)
        })
      }
      delete tqVmEventMap[vm._uid]

      Object.entries(eventMap).forEach(
        ([eventName, vmList]) => vmList.length || delete eventMap[eventName]
      )
    }
  })
}

function plugin (Vue) {
  if (VERSION < 2) {
    console.error('[vue-event-proxy] only support Vue 2.0+')
    return
  }
  // Exit if the plugin has already been installed.
  if (plugin.installed) return
  plugin.installed = true
  mixinEvents(Vue)
  applyMixin(Vue)
}

Vue.use(plugin)

tqsdk.hasSettlementsDatePercent = (bid, user_id, days) => {
  let session = tqsdk.get({ name: 'session', user_id: user_id })
  let his_settlements = tqsdk.get({ name: 'his_settlements', user_id: user_id })
  if (!his_settlements) return 0
  let trading_day = session && session.trading_day ? moment(session.trading_day, 'YYYYMMDD') : moment()
  let hasDays = days
  for (let i = days; i >= 1; i--) {
    let date = trading_day.clone().subtract(i, 'days').format('YYYYMMDD')
    if (his_settlements[date] === undefined || his_settlements[date] === null) {
      hasDays--
    }
  }
  return 100 * hasDays / days
}

Vue.$tqsdk = tqsdk
Vue.prototype.$tqsdk = tqsdk

export default tqsdk
