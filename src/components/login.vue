<template>
  <div class="login login_cen" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :model="user" :rules="rules" ref="user" status-icon>
      <div class="login_main">
        <div class="login_l">
          <img src="../images/logo.jpg" />
        </div>
        <div style="width: 100%;" v-if="loginview">
          <el-alert title="已登录" type="success" center show-icon :closable="false"></el-alert>
          <p>
            你可以
            <router-link to="/">返回</router-link>
            管理页面，或
            <a href="javascript:void(0)" @click="loginview = false">切换账户</a>
          </p>
        </div>
        <div style="width: 100%;" v-if="!loginview">
          <el-form-item label="账户" prop="name">
            <el-input placeholder="用户名" v-model="user.name" clearable @change="onuser"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" auto-complete="off" placeholder="密码" v-model="user.pass" clearable @change="onuser" @keyup.enter.native="onLogin('user')" ></el-input>
          </el-form-item>
          <div>
            记住账户
            <el-tooltip class="item" effect="dark" content="仅记住账户，密码不会被保存" placement="right">
              <el-switch v-model="loginstu" @change="onpass" @click="onpass"></el-switch>
            </el-tooltip>
          </div>
        </div>
        <div class="loginbtn_" v-if="!loginview">
          <el-button-group class="login_btn">
            <el-button type="primary" @click="onLogin('user')">确认</el-button>
          </el-button-group>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import store from '../vuex/index'
var that, $url = store.state.$url
export default {
  data () {
    return {
      fullscreenLoading: false,
      loginstu: true,
      loginview: false,
      user: {
        name: '',
        pass: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请填写用户名称',
          trigger: 'blur'
        }],
        pass: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    var that = this,
      data = JSON.parse(localStorage.getItem('Userlogin_'))
    // 初始
    if (!!data) {
      that.loginstu = data.swstr
      if (that.loginstu) {
        that.user.name = data.name
      }
    } else {
      localStorage.setItem('Userlogin_', JSON.stringify({
        name: '',
        swstr: that.loginstu
      }))
    }
    that.$http({
      method: 'post',
      url: $url + 'isLogin'
    }).then(function (res) {
      if (res.data.error === 0) {
        that.loginview = true
      }
    })
  },
  methods: {
    onuser () {
      that = this
      localStorage.setItem('Userlogin_', JSON.stringify({
        name: that.user.name,
        swstr: that.loginstu
      }))
    },
    onpass () {
      that = this
      if (that.loginstu) {
        localStorage.setItem('Userlogin_', JSON.stringify({
          name: that.user.name,
          swstr: that.loginstu
        }))
      } else {
        localStorage.setItem('Userlogin_', JSON.stringify({
          swstr: that.loginstu
        }))
      }
    },
    onLogin (formName) {
      that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.fullscreenLoading = true
          that.$http({
            method: 'post',
            url: $url + 'login',
            data: {
              admin_name: that.user.name,
              pass: that.user.pass
            }
          }).then(function (res) {
            if (res.data.error === 0) {
              that.fullscreenLoading = true
              // 管理权限
              localStorage.setItem('Login_', JSON.stringify(res.data.data))
              that.$message({
                message: '登陆成功',
                type: 'success'
              })
              that.$router.push({
                name: 'index'
              })
            } else {
              setTimeout(function () {
                that.fullscreenLoading = false
              }, 1000)
              that.$message({
                message: res.data.data,
                type: 'error'
              })
              that.user = {}
              that.$refs[formName].resetFields()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
  .login {
    background-color: #e9eef3;
    width: 100%;
  }

  .login_cen {
    overflow: auto;
    display: inline-flex;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_main {
    display: inline-flex;
    border-radius: .3rem;
    overflow: hidden;
    position: relative;
    background-color: #fff;
    max-width: 800px;
    min-width: 700px;
    width: 70%;
    height: 300px;
    padding: 40px;
  }

  .login_main .loginbtn_ {
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - 80px);
    background-color: white;
    /* border-top: 1px solid #d2d2d2; */
    padding: 0 40px;
  }

  .login_main .login_btn {
    float: right;
    margin: 10px 0 10px 0;
  }

  .login_main .login_l {
    background-image: url(https://cabbagelol.net/yjyxm/images/herd-nav.png);
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: .3rem 0 0 .3rem;
    position: relative;
    z-index: 3;
    height: calc(100% + 80px);
    border-right: 1px solid #d2d2d2;
    margin: -40px 40px 0 -40px;
    width: 1400px;
    background-color: #1a76ce;
    display: inline-flex;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_main .login_l img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
</style>
