import Vue from 'vue'
import ElementUI from 'element-ui'
import Logistics from './logistics'
import router from './router'
import axios from 'axios'
import state from './vuex/index'

import 'element-ui/lib/theme-chalk/index.css'
import './css/style.css'
import './fonts/iconfont.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  el: '#main',
  router,
  state,
  components: { Logistics },
  template: '<Logistics/>'
})
