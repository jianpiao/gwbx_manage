import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    $login: {
      stu: null
    },
    $url: window.winUrl
    // 'http://gwbx2.wokecp.com/public/index.php/index/admin/'
    // 'http://12.10.60.222/gwbx/public/index.php/index/admin/'
  },
  campus: '全部'
})
