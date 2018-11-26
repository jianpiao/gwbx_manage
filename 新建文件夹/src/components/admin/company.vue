<template>
  <div class="company" v-loading="company_cont_loading">
    <div class="company_tip">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><span @click="onadminindex('Adminindex')">仪表板</span></el-breadcrumb-item>
        <el-breadcrumb-item>小组</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="login.authority == 1" size="mini" type="primary" icon="el-icon-plus" style="float: right;margin: -20px 0 0 0" @click="companyFormVisible = true">
        增加小组
      </el-button>
      <el-button size="mini" icon="el-icon-refresh" style="float: right;margin: -20px 10px 0 0" @click="getcompanylist">
        刷新
      </el-button>
    </div>
    <div class="company_cont">
      <div class="company_cart" v-for="(item, index) in getcompany_data" :key="item.group_id">
        <div :class="{company_cart_dis:item.group_state == 1}">
          <div class="company_cart_tit">
            <h2>
              <span style="display: block;overflow: hidden;width: 70%;white-space: normal;float: left;">
                {{item.group_name}}
              </span>
              <i style="float: right" @click="opencompanyEdit(index,item.group_state)" class="el-icon-edit-outline"></i>
            </h2>
          </div>
          <div class="company_cart_list company_cart_listAdd"  v-if="item.group_state == 1" style="font-size: 1rem; white-space: normal;">
            该小组已禁用，通过编辑小组状态解除
          </div>
          <div class="company_cart_list l"  style="font-size: 1rem; white-space: normal;">
            <el-tag :type="item.group_state != 1 ? '' : 'danger'" size="small">组长</el-tag> {{item.admin_name}}
          </div>
          <div class="company_cart_list l" v-for="(icom, index) in item.members" :key="index" v-if="item.members.length > 0">
            <el-tag type="info" size="small">成员</el-tag>  {{icom.admin_name}}
            <div>
              <p>联系方式: {{icom.phone_number == null ? '无' : icom.phone_number}}</p>
              <p>
                所属校区:
                <span v-if="icom.campus == 0">所有</span>
                <span v-if="icom.campus == 1">高要</span>
                <span v-if="icom.campus == 2">鼎湖</span>
              </p>
            </div>
          </div>
          <div class="company_cart_list company_cart_listAdd"  v-if="item.members.length <= 0 && item.group_state != 1" @click="opencompanyEdit(index,item.group_state)">
            +
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加小组" :visible.sync="companyFormVisible">
      <el-form :model="companyFormVisible_from" ref="companyFormVisible_from" label-position="left" label-width="80px" :rules="companyFormVisible_from_rules">
        <el-card class="box-card">
          <el-form-item label="小组名称" prop="companyName" placeholder="输入小组名称">
            <el-input v-model="companyFormVisible_from.companyName"></el-input>
          </el-form-item>
          <el-form-item label="组长" prop="companyId">
            <el-select  v-model="companyFormVisible_from.companyId" placeholder="请选择一个小组管理员">
              <el-option
                v-for="item in getAdminList"
                :key="item.admin_name"
                :label="item.admin_name"
                :value="item.admin_id">
                <span style="float: left; color: #8492a6;">id: {{ item.admin_id }}</span>
                <span style="float: right; font-size:13px">{{ item.admin_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcompany('companyFormVisible_from')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑小组" :visible.sync="companyEditFormVisible">
      <el-form :model="companyEditFormVisible_from" ref="companyEditFormVisible_from" label-position="left" label-width="80px" :rules="companyEditFormVisible_from_rules">
        <el-card class="box-card">
          <el-form-item label="小组名称" prop="companyName" v-if="companyEditFormVisible_from.company_Stu">
            <el-input v-model="companyEditFormVisible_from.companyName"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="companyId" v-if="companyEditFormVisible_from.company_Stu">
            <el-select  v-model="companyEditFormVisible_from.companyId" placeholder="请选择一个小组管理员" filterable>
              <el-option
                v-for="item in getAdminList"
                :key="item.admin_name"
                :label="item.admin_name"
                :value="item.admin_id">
                <!-- <span style="float: left; color: #8492a6;">id: {{ item.admin_id }}</span> -->
                <span style="font-size:13px">{{ item.admin_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="companyVal">
            <el-select  v-model="companyEditFormVisible_from.companyVal" placeholder="请选择一个小组管理员">
              <el-option
                v-for="item in companyEditFormVisible_from.companyStart"
                :key="item.n"
                :label="item.n"
                :value="item.i">
                <!-- <span style="float: left; color: #8492a6;">id: {{ item.i }}</span> -->
                <span style="font-size:13px">{{ item.n }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成员" v-if="companyEditFormVisible_from.company_Stu">
            <el-transfer
              filterable
              :filter-method="companyEditFormVisible_from.filterMethod"
              :titles="['未选用户', '已选用户']"
              :button-texts="['移除成员', '添加成员']"
              filter-placeholder="输入用户名称搜索"
              v-model="companyEditFormVisible_from.data_sele"
              :data="companyEditFormVisible_from.data2"
              @change="onSetcompanyFrom_member">
            </el-transfer>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="companyEdit('companyEditFormVisible_from')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '../../vuex/index'

var that, $url = store.state.$url
export default {
  name: 'company',
  data () {
    return {
      login:'',
      getAdminList: [],
      getcompany_data: [],
      companyMember: [],
      companyFormVisible_from: {
        companyName: '',
        companyId: ''
      },
      companyFormVisible_from_rules: {
        companyName: [
          { required: true, message: '请输入小组名称', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择一个小组管理员', trigger: 'change' }
        ]
      },
      companyEditFormVisible_from: {
        companyName: '',
        companyId: '',
        companyVal: '',
        companyStart: [
          {
            n: '删除',
            i: 0
          }, {
            n: '禁用',
            i: 1
          }, {
            n: '正常',
            i: 2
          }
        ],
        company_seleData:[],
        data2: [],
        data_sele: [],
        filterMethod (query, item) {
          return item.pinyin.indexOf(query) > -1
        }
      },
      companyEditFormVisible_from_rules: {
        companyName: [
          { required: true, message: '请输入小组名称', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择一个小组管理员', trigger: 'blur' }
        ],
        companyVal: [
          { required: true, message: '请选择一个状态', trigger: 'blur' }
        ]
      },
      companyEditFormVisible: false,
      companyFormVisible: false,
      company_cont_loading: false
    }
  },
  created () {
    this.login = JSON.parse(localStorage.getItem('Login_'))
    this.getadminlist()
    this.getcompanylist()
  },
  methods: {
    onSetcompanyFrom_member (val_) {
      // 获取小组成员选择的名单
      console.log(val_)
      that.company_seleData = val_
    },
    getadminlist () {
      // * ==================
      // 请求
      // 获取管理员列表
      // * ==================
      that = this
      that.company_cont_loading = true
      that.$http({
        method: 'post',
        url: $url + 'GetAdminList'
      }).then(function (res) {
        that.company_cont_loading = false
        if (res.data.error == 0) {
          that.getAdminList = res.data.data
        }
      })
    },
    onadminindex (ind_) {
      this.$parent.onAdminindex(ind_)
    },
    getcompanylist () {
      // 获取小组列表
      that = this
      that.company_cont_loading = true
      that.$http({
        method: 'post',
        url: $url + 'GetGroupList'
      }).then(function (res) {
        that.company_cont_loading = false
        if (res.data.error == 0) {
          that.getcompany_data = res.data.data
        }
      })
    },
    addcompany (formName) {
      // 添加小组
      that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.$http({
            method: 'post',
            url: $url + 'AddGroup',
            data: {
              group_name: that.companyFormVisible_from.companyName,
              group_admin: that.companyFormVisible_from.companyId
            }
          }).then(function (res) {
            if (res.data.error == 0){
              that.$message({
                message: '创建成功',
                type: 'success'
              })
              that.companyFormVisible = false
              that.getcompanylist()
              that.companyFormVisible_from.companyName = ''
              that.companyFormVisible_from.companyId = ''
            } else {
              that.$message({
                message: res.data.data,
                type: 'error'
              })
            }
          })
        }
      })
    },
    opencompanyEdit (ind_, stu_) {
      // 打开编辑小组窗口
      that = this
      that.companyEditFormVisible = true
      that.companyEditFormVisible_from.company_Stu = (stu_ != 1 ? true : false)
      that.companyEditFormVisible_from.groupId = that.getcompany_data[ind_].group_id
      that.companyEditFormVisible_from.companyName = that.getcompany_data[ind_].group_name
      that.companyEditFormVisible_from.companyId = that.getcompany_data[ind_].group_admin
      that.companyEditFormVisible_from.companyVal = that.getcompany_data[ind_].group_state
      that.companyEditFormVisible_from.data_sele = []
      
      for (let t of that.getcompany_data[ind_].members) {
        that.companyEditFormVisible_from.data_sele.push(t.admin_id)
      }
      // 设置成员列表控件
      var data = [], cities = [], pinyin = [], cp = []
      for (let i of that.getAdminList) {
        cities.push(i)
        pinyin.push(i.admin_name)
      }
      for (let o of that.getcompany_data) {
        for (let k of o.members) {
          cp.push(k.admin_id)
        }
      }
      cities.forEach((city, index) => {
        data.push({
          label: (function () {
            let name = city.admin_name
            for (let i of cp) {
              if (i === city.admin_id) {
                name = name + ' (已使用)'
              }
            }
            return name
          })(),
          key: city.admin_id,
          pinyin: pinyin[index],
          disabled: (function () {
            let dis = false
            // for (let i of cp) {
            //   for(let k of that.companyEditFormVisible_from.data_sele){
            //     if (i == city.admin_id) {
            //       dis = true
            //       if (k == city.admin_id) {
            //         dis = false
            //       }
            //     }
            //   }
            // }
            if (!dis) {
              if (city.admin_id != that.companyEditFormVisible_from.companyId){
                dis = false
              } else {
                dis = true
              }
            }
            return dis
          })()
        })
      })
      that.companyEditFormVisible_from.data2 = data
    },
    companyEdit (formName) {
      // 提交修改小组信息
      that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.companyEditFormVisible = false
          // 小组信息
          that.$http({
            method: 'post',
            url: $url + 'SetGroup',
            data: {
              group_id: that.companyEditFormVisible_from.groupId,
              group_name: that.companyEditFormVisible_from.companyName,
              group_admin: that.companyEditFormVisible_from.companyId,
              group_state: that.companyEditFormVisible_from.companyVal
            }
          }).then(function (res) {
            if (res.data.error == 0){
              that.$message({
                message: '提交成功',
                type: 'success'
              })
              that.getcompanylist()
            } else {
              that.$message({
                message: res.data.data,
                type: 'error'
              })
            }
          })
          // 小组成员
          that.$http({
            method: 'post',
            url: $url + 'SetGroupMembers',
            data: {
              group_id: that.companyEditFormVisible_from.groupId,
              members_list: JSON.stringify((function () {
                let data = []
                for (let i of that.company_seleData) {
                  data.push(i)
                }
                return data
              })())
            }
          }).then(function (res) {
            if (res.data.error == 0){
              that.$message({
                message: '提交成功',
                type: 'success'
              })
              that.getcompanylist()
            } else {
              that.$message({
                message: res.data.data,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .company {
    height: calc(100% - 60px);
  }

  .company_tip {
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    padding: 20px;
  }

  .company_cont {
    display: block;
    overflow: auto;
    white-space: inherit;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .company_cart {
    display: inline-block;
    height: 100%;
    overflow: auto;
    border-right: 1px solid #d2d2d2;
  }

  .company_cart:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.03137254901960784);
  }

  .company_cart_dis {
    opacity: .6;
    background-color: #ffe4e2 !important;
    color: #ea2e21 !important;
  }

  .company_cart > div {
    margin: 20px;
    width: 230px;
    max-width: 230px;
    background-color: #fff;
    border-radius: .3rem;
    padding: 20px;
  }

  .company_cart_tit {
    margin: 0 0 10px 0;
    display: inline-table;
    width: 100%;
  }

  .company_cart_dis .company_cart_tit i{
    background-color: #F44336;
    color: #fff;
   }

  .company_cart_tit i:active {
    transform: scale(.8);
    transition:transform .2s ;
  }

  .company_cart_tit i {
    float: right;
    background-color: #f2f2f2;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  }

  .company_cart_tit h2,
  .company_cart_tit p {
    font-weight: lighter;
    margin: 0;
  }

  .company_cart_list {
    font-weight: inherit;
    background-color: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
    border-radius: .3rem;
    color: #000;
  }

  .company_cart_list div {
    background: #fff;
    font-size: 13px;
    padding: 10px;
    display: none;
    margin: 5px 0 0 0;
    border-radius: .3rem;
  }

  .company_cart_list div > p {
    color: #666;
    line-height: 1;
    margin: 5px 0;
  }

  .company_cart_dis .company_cart_list {
    background-color: #F44336;
    color: #fff;
  }

  .company_cart_dis .company_cart_list .el-tag {
    background: rgba(255, 255, 255, 0.10980392156862745);
    color: #fff;
  }

  .company_cart_list.l:hover {
    transform: scale(1.3);
    box-shadow: 0 5px 15px rgba(0 ,0 ,0 , .25);
    animation: company_cart_list .25s;
  }

  .company_cart_list.l:hover div {
    display: block;
  }

  @keyframes company_cart_list {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.3);
    }
  }

  .company_cart_dis .company_cart_listAdd,
  .company_cart_dis .company_cart_listAdd:hover{
    background-color: rgba(0, 0, 0, 0.10);
    color: #000;
  }

  .company_cart_listAdd {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.60);
    border:2px dashed #d2d2d2;
    font-size: 1.5rem;
    font-weight: normal;
    color: #777;
    cursor: pointer;
  }

  .company_cart_listAdd:hover {
    background-color: rgba(0, 0, 0, .05);
    border:2px dashed #d2d2d2;
  }

</style>
