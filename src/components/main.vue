<template>
  <div class="main_index">
    <el-container>
      <el-menu
        :default-active="menui"
        :collapse="true"
        class="el-menu-vertical-demo maincont"
        width="190px"
        style="min-width:65px"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#fff">
        <el-menu-item index="1" @click="onmenui(1)">
          <i class="el-icon-menu"></i>
          <span slot="title">面板</span>
        </el-menu-item>
        <el-menu-item index="2" @click="onmenui(2)" v-if="login.authority != 2">
          <i class="el-icon-tickets"></i>
          <span slot="title">维修单</span>
        </el-menu-item>
        <el-menu-item index="3" @click="onmenui(3)" v-if="login.authority == 2">
          <i class="el-icon-time"></i>
          <span slot="title">我的订单</span>
        </el-menu-item>
      </el-menu>
      <div style="width: calc(100% - 66px);height: 100%">
        <el-menu mode="horizontal" class="main_heah">
          <li class="el-menu-item">
            <span class="el-dropdown-link">
              <img src="../images/logo.jpg" class="main_heah_logo">
              <span class="main_heah_h1">广东理工学院报修系统</span>
            </span>
          </li>
          <li class="main_user el-menu-item">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                欢迎您，{{login.admin_name}}
                <el-tooltip class="item" effect="dark" content="该数据是身份ID" placement="bottom">
                  <el-tag size="small">{{login.admin_id}}</el-tag>
                </el-tooltip>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="width: 150px">
                <el-dropdown-item>
                  <div @click="exitLogon" >
                    注销
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </el-menu>
        <keep-alive>
          <component :is="Indexrouter"> </component>
        </keep-alive>
      </div>
    </el-container>
  </div>
</template>

<script>
import store from '../vuex/index'
import ElButton from 'element-ui/packages/button/src/button'
import Stistics from './stistics'
import Operation from './operation'
import MyselfOrder from './myselfOrder'

var that, $url = store.state.$url
export default {
  components: {
    ElButton,
    Stistics,
    Operation,
    MyselfOrder
  },
  data () {
    return {
      Indexrouter: 'Operation',
      menui: '1'
    }
  },
  created () {
    that = this
    //  检测是否登录
    that.$http({
      method: 'post',
      url: $url + 'isLogin'
    }).then(function (res) {
      if (res.data.error !== 0) {
        that.$router.push({
          name: 'login'
        })
      }
    })
    that.login = JSON.parse(localStorage.getItem('Login_'))
    if (that.login != null) {
      that.campus = that.iscampus(that.login.campus).n
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    iscampus (sty) {
      var sty
      if (sty == '全部' || sty == 0) {
        sty = {
          i: 0, n: '全部'
        }
      }
      if (sty == '高要校区' || sty == 1) {
        sty = {
          i: 1, n: '高要校区'
        }
      }
      if (sty == '鼎湖校区' || sty == 2) {
        sty = {
          i: 2, n: '鼎湖校区'
        }
      }
      return sty
    },
    exitLogon () {
      // 注销账户
      that = this
      that.$confirm('你是否要注销该账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(function () {
        that.$http({
          method: 'post',
          url: $url + 'exitLogin'
        }).then(function (res) {
          if (res.data.error === 0) {
            that.$router.push({
              name: 'login'
            })
          }
        })
      })
    },
    onmenui (ind_) {
      // 主菜单控制
      that = this
      if (ind_ == 1) {
        that.Indexrouter = 'Operation'
      }
      if (ind_ == 2) {
        that.Indexrouter = 'Stistics'
      }
      if (ind_ == 3) {
        that.Indexrouter = 'MyselfOrder'
      }
    }
  }
}
</script>

<style>
  .main_index {
    width: 100%;
  }

  .main_index>section {
    height: 100%;
  }

  .main_user {
    float: right !important;
  }

  .main_heah{
    border-bottom: 1px solid #f2f2f2 !important;
  }

  .main_heah_logo {
    width: 30px;
    height: 30px;
  }

  .main_heah_h1 {
    font-size: 1.2rem;
    margin: 0 0 0 10px;
    color: #224c7b;
  }
</style>
