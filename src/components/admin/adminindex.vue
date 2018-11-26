<template>
  <div class="adminindex">
    <div class="adminindex_tip">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><span @click="onadminindex('Adminindex')">仪表板</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="adminindex_cart" v-for="(i, index) of NoticeList" :key="index" v-if="i.notice_type == 1 && i.default == 1">
      <div class="adminindex_cart_tit">
        <h1>{{i.notice_title}}</h1>
      </div>
      <div class="adminindex_cart_p">
        <div>{{i.notice_content}}</div>
      </div>
    </div>

    <div class="adminindex_cont">
      <div class="adminindex_cont_list">
        <div class="adminindex_cont_cart" v-if="login.authority == 1">
          <div class="adminindex_cont_img">
            <i class="icon iconfont icon-dianyuanguanli"></i>
          </div>
          <h2>账户管理</h2>
          <p>管理账号权限或资料</p>
          <el-button type="primary" @click="onadminindex('Jurisdiction')">管理</el-button>
        </div>
        <div class="adminindex_cont_cart">
          <div class="adminindex_cont_img">
            <i class="icon iconfont icon-tuandui"></i>
          </div>
          <h2>小组</h2>
          <p>创建小组单位或管理小组成员</p>
          <el-button type="primary" @click="onadminindex('Company')">管理</el-button>
        </div>
        <div class="adminindex_cont_cart">
          <div class="adminindex_cont_img">
            <i class="icon iconfont icon-fptj"></i>
          </div>
          <h2>统计</h2>
          <p>统计账户与全站数据</p>
          <el-button type="primary" @click="onadminindex('Content')">访问</el-button>
        </div>
        <div class="adminindex_cont_cart" v-if="login.authority == 1">
          <div class="adminindex_cont_img">
            <i class="icon iconfont icon-liaotian"></i>
          </div>
          <h2>公告</h2>
          <p>编辑报修系统公告</p>
          <el-button type="primary" @click="onadminindex('Notice')">编辑</el-button>
        </div>
      </div>
    </div>
    <div class="adminindex_footer">由Wo客校园平台提供技术支持</div>
  </div>
</template>

<script>
import store from '../../vuex/index'

var that, $url = store.state.$url
export default {
  name: 'adminindex',
  data () {
    return {
      NoticeList:'',
      login: ''
    }
  },
  created () {
    // * ==============
    // 接口
    // 获取内部公告
    // * ==============
    that = this
    that.login = JSON.parse(localStorage.getItem('Login_'))
    that.$http({
      method: 'post',
      url: $url + 'GetNoticeList',
      data: {
        notice_type: 1
      }
    }).then(function (res) {
      if (res.data.error == 0) {
        that.NoticeList = res.data.data
      }
    })
  },
  methods: {
    onadminindex (ind_) {
      // {ind_} 菜单名称
      this.$parent.onAdminindex(ind_)
    }
  }
}
</script>

<style scoped>
  .adminindex .adminindex_cont {
    padding: 20px;
    display: inline-table;
  }

  .adminindex_tip {
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    padding: 20px;
  }

  .adminindex_cart {
    background-image: url(https://cabbagelol.net/yjyxm/images/herd-nav.png);
    background-color: #fff;
    background-size: cover;
    background-position: center center;
    color: #fff;
    padding: 20px;
    border-radius: .3rem;
    margin: 20px 20px 0 20px;
  }

  .adminindex_cart .adminindex_cart_tit {
    margin: 0 10px 0 0;
  }

  .adminindex_cart_p {
  }

  .adminindex_cart > div {
    display: inline-block;
  }

  .adminindex .adminindex_cont .adminindex_cont_list{
    /*margin: 10px 0 0 0;*/
  }

  .adminindex .adminindex_cont .adminindex_cont_cart {
    background-color: #fff;
    float: left;
    width: 200px;
    padding: 30px;
    border-radius: .4rem;
    margin: 0 10px 10px 0;
  }

  .adminindex .adminindex_cont .adminindex_cont_list h2,
  .adminindex .adminindex_cont .adminindex_cont_list p {
    text-align: center;
    margin: 0;
    padding: 5px 0;
  }

  .adminindex .adminindex_cont .adminindex_cont_list button {
    margin: 10px 0 0 0;
    width: 100%;
  }

  .adminindex .adminindex_cont .adminindex_cont_list .adminindex_cont_img {
    margin: 0 25% 10px 25%;
    width: 100px;
    height: 100px;
    background-color: #545c64;
    border-radius: 50%;
    overflow: hidden;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .adminindex .adminindex_cont .adminindex_cont_list .adminindex_cont_img i {
    font-size: 2.5rem;
    color: #fff;
  }

  .adminindex .adminindex_cont .adminindex_cont_list p {
    font-size: .9rem;
    color: #777;
  }
  .adminindex_footer {
    display: block !important;
    width: 100%;
    text-align: center;
    color:#888;
    padding: 0 0 30px 0;
    font-style: 12px;
  }
</style>
