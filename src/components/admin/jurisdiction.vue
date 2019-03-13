<template>
    <div class="jurisdiction">
      <div class="jurisdiction_tip">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span @click="onadminindex('Adminindex')">仪表板</span></el-breadcrumb-item>
          <el-breadcrumb-item>管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="jurisdiction_cont">
        <div style="margin: 0 0 10px 0;">
          <el-button type="primary" @click="adminFormAdd = true">添加角色</el-button>
          <el-button @click="getadminlist" class="el-icon-refresh">刷新</el-button>
        </div>
        <el-form>
          <el-tabs type="border-card" >
            <el-tab-pane label="管理员" v-loading.lock="adminFormVisibleLoading">
              <div v-if="GetAdminList.length > 0">
                <el-table :data="GetAdminList" border style="width: 100%" size="mini">
                  <el-table-column prop="admin_id" label="ID" width="50">
                  </el-table-column>
                  <el-table-column  label="名称" width="120">
                    <template slot-scope="scope">
                      {{scope.row.admin_name}}
                      <span v-if="scope.row.admin_id == login.admin_id">(当前账户)</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="角色" width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.authority == 1">超级管理员</span>
                      <span v-if="scope.row.authority == 2">普通工作人员</span>
                      <span v-if="scope.row.authority == 3">组长</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="67">
                    <template slot-scope="scope">
                    <span v-if="scope.row.admin_state == 0">
                      <el-tag type="danger">删除</el-tag>
                    </span>
                      <span v-if="scope.row.admin_state == 1">
                      <el-tag type="warning">停用</el-tag>
                    </span>
                      <span v-if="scope.row.admin_state == 2">
                      <el-tag type="success">正常</el-tag>
                    </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="校区" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.campus == 0">全部</span>
                      <span v-if="scope.row.campus == 1">高要</span>
                      <span v-if="scope.row.campus == 2">鼎湖</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="手机号码">
                    <template slot-scope="scope">
                      {{scope.row.phone_number}}
                    </template>
                  </el-table-column>
                  <el-table-column label="评价（0-5）" width="141">
                    <template slot-scope="scope">
                      <el-rate
                        v-model="scope.row.score"
                        disabled
                        text-color="#ff9900">
                      </el-rate>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="primary" style="width: 100%"  @click="onadminsFormedit(scope.$index)" size="small">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-else>
                没有列表
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <el-dialog title="角色编辑" :visible.sync="adminsFormVisible">
          <el-tabs type="border-card">
            <el-tab-pane label="角色">
              <el-alert
                v-if="GetAdmin_.admin_statei != '删除'"
                show-icon
                title="谨慎操作权限，请多次确认后再点应用"
                type="warning">
              </el-alert>
              <el-alert
                v-else
                show-icon
                :title="'一旦确认删除该账户，账户将失效无法被撤回；'"
                type="error">
              </el-alert>
              <br/>
              <el-card class="box-card" v-if="GetAdminList.length > 0">
                <div slot="header" class="clearfix">
                  <span style="font-size:1.1rem;font-weight:600;">账户名称: {{GetAdminList[GetAdmin_id].admin_name}}</span>
                </div>
                <div class="text item">
                  管理校区: {{GetAdminList[GetAdmin_id].campus_name}}
                </div>
                <div class="text item">
                  创建时期: {{GetAdminList[GetAdmin_id].up_date}}
                </div>
              </el-card>
              <br/>
              <el-form label-width="80px">
                <el-form-item label="权限类型" v-show="GetAdmin_.admin_statei != '删除'">
                  <el-select v-model="GetAdmin_.authorityi" placeholder="权限类型" @change="onGetAdmin_authority">
                    <el-option 
                      v-for="item in GetAdmin_a.authority" 
                      :key="item.id" 
                      :label="item.name" 
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态类型">
                  <el-select v-model="GetAdmin_.admin_statei" placeholder="状态类型" @change="onGetAdmin_admin_state">
                    <el-option 
                      v-for="item in GetAdmin_a.admin_state" 
                      :key="item.id" 
                      :label="item.name" 
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属校区" v-show="GetAdmin_.admin_statei != 0 && GetAdmin_.admin_statei != '删除'">
                  <el-select v-model="GetAdmin_.campusi" placeholder="所属校区" @change="onGetAdmin_campus">
                    <el-option 
                      v-for="(item) in GetAdmin_a.campus" 
                      :key="item.id" 
                      :label="item.name" 
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="onadminsFormVisible">应用</el-button>
            </el-tab-pane>

            <el-tab-pane label="账户">
              <el-form label-width="80px" :model="adminFormAdd_model" ref="adminFormAdd_model" :rules="adminFormAdd_model_rules">
                <el-form-item label="密码" prop="SetAdminPass">
                  <el-input v-model="adminFormAdd_model.SetAdminPass" placeholder="输入密码"></el-input>
                </el-form-item>
                <el-form-item  label="手机" prop="SetAdminIp">
                  <el-input v-model="adminFormAdd_model.SetAdminIp" placeholder="手机号码"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="onadminsFormVisible_zh('adminFormAdd_model')" @keyup.enter="onadminsFormVisible_zh('adminFormAdd_model')">应用</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>

        <el-dialog title="创建角色" :visible.sync="adminFormAdd" >
          <el-form :model="adminFormAdd_model" ref="adminFormAdd_model" label-position="left" label-width="80px" :rules="adminFormAdd_model_rules">
            <el-alert
              title="基本信息中账户名称后续不允许修改，请确认账户名称的称呼"
              :closable="false"
              type="warning">
            </el-alert>
            <br>
            <el-card class="box-card">
              <el-row>
                <el-col :span="10.5">
                  <h1>基本资料</h1>
                  <el-form-item label="账户名称" prop="SetAdminName">
                    <el-input v-model="adminFormAdd_model.SetAdminName" placeholder="账户名称 (支持中文)"></el-input>
                  </el-form-item>
                  <el-form-item label="输入密码" prop="SetAdminPass">
                    <el-input v-model="adminFormAdd_model.SetAdminPass" placeholder="输入密码 (数字或者字母,长度6-20)"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="SetAdminIp">
                    <el-input v-model="adminFormAdd_model.SetAdminIp" placeholder="手机联系方式"></el-input>
                  </el-form-item>
                  <!--<el-form-item label="类型" prop="select">-->
                    <!--<el-select v-model="GetAdmin_.authorityi" placeholder="选择一个权限" @change="onGetAdmin_authority">-->
                      <!--<el-option v-for="item in GetAdmin_a.authority"-->
                         <!--:key="item.id"-->
                         <!--:label="item.name"-->
                         <!--:value="item.id">-->
                      <!--</el-option>-->
                    <!--</el-select>-->
                  <!--</el-form-item>-->
                  <el-form-item label="状态" prop="admin_statei">
                    <el-select v-model="GetAdmin_.admin_statei" placeholder="选择一个状态" @change="onGetAdmin_admin_state">
                      <el-option v-for="item in GetAdmin_a.admin_state"
                         v-if="item.id != 0"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="校区" prop="campusi">
                    <el-select v-model="GetAdmin_.campusi" placeholder="选择一个校区" @change="onGetAdmin_campus">
                      <el-option v-for="item in GetAdmin_a.campus"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分配小组" prop="campusi" v-if="GetAdmin_.authorityi_ == 3">
                    <el-select v-model="GetAdmin_.groupi" placeholder="请选择" @change="onGetAdmin_group">
                      <el-option
                        v-for="item in GetAdmin_a.group"
                        :key="item.group_id"
                        :label="item.group_name"
                        :value="item.group_id"
                        :rules="[{ required: true, message: '请选择一个小组', trigger: 'change' }]">
                        <span style="float: left">{{ item.group_name }}</span>
                        <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.group_id }}</span> -->
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='1'>
                  &ensp;
                </el-col>
                <el-col :span="12">
                  <div class="jurisdiction_cont_list">
                    <h1>权限</h1>
                    <el-radio-group v-model="GetAdmin_.authorityi_" @change="onGetAdmin_authority">
                      <el-radio label="1">
                        <div class="jurisdiction_cont_list_lab">
                          <h1>超级管理员</h1>
                          <p>最高管理员权限</p>
                        </div>
                      </el-radio>
                      <el-radio label="3">
                        <div class="jurisdiction_cont_list_lab">
                          <h1>组长</h1>
                          <p>拥有基本管理员权限</p>
                        </div>
                      </el-radio>
                      <el-radio label="2">
                        <div class="jurisdiction_cont_list_lab">
                          <h1>普通工作人员</h1>
                          <p>无</p>
                        </div>
                      </el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onadminsFormAdd('adminFormAdd_model')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
import store from "../../vuex/index";

var that,
  $url = store.state.$url;
export default {
  name: "jurisdiction",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkPassWord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入账户密码"));
      } else {
        const reg = /^[A-Za-z0-9]{5,20}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的账户密码"));
        }
      }
    };
    return {
      radio: "1",
      from: {
        region: "",
        stuid: 0,
        cont: "",
        width: "100px"
      },
      // 文本资料
      adminFormAdd_model: {
        SetAdminName: "",
        SetAdminIp: "",
        SetAdminPass: ""
      },
      adminFormAdd_model_rules: {
        SetAdminName: [
          { required: true, message: "请输入账户名称", trigger: "blur" }
        ],
        SetAdminPass: [{ validator: checkPassWord, trigger: "blur" }],
        SetAdminIp: [{ validator: checkPhone, trigger: "blur" }]
      },
      adminFormAdd: false,
      adminsFormVisible: false,
      adminFormVisibleLoading: false,
      GetAdminList: [
        {
          admin_name: "",
          campus_name: "",
          up_date: ""
        }
      ],
      GetAdmin_a: {
        authority: [
          {
            name: "超级管理员",
            id: 1
          },
          {
            name: "普通工作人员",
            id: 2
          },
          {
            name: "组长",
            id: 3
          }
        ],
        admin_state: [
          {
            name: "删除",
            id: 0
          },
          {
            name: "停用",
            id: 1
          },
          {
            name: "正常",
            id: 2
          }
        ],
        campus: [
          {
            name: "全部",
            id: 0
          },
          {
            name: "高要",
            id: 1
          },
          {
            name: "鼎湖",
            id: 2
          }
        ],
        group: []
      },
      // 权限设定
      GetAdmin_: {
        authorityi: "超级管理员",
        authorityi_: "1",
        admin_statei: "正常",
        admin_statei_: 2,
        campusi: 0,
        campusi_: 0,
        groupi: "",
        groupi_: -1
      },
      admin_startvali: "",
      GetAdmin_id: 0,
      showGroupList: false
    };
  },
  created() {
    that = this;
    that.login = JSON.parse(localStorage.getItem("Login_"));
    that.getadminlist();
    that.getGroupList();
  },
  methods: {
    onGetAdmin_authority(val_) {
      this.GetAdmin_.authorityi_ = val_;
    },
    onGetAdmin_admin_state(val_) {
      this.GetAdmin_.admin_statei_ = val_;
    },
    onGetAdmin_campus(val_) {
      this.GetAdmin_.campusi_ = val_;
    },
    onGetAdmin_group(val_) {
      this.GetAdmin_.groupi_ = val_;
    },
    getGroupList() {
      // * ==================
      // 请求
      // 获取小组列表
      // * ==================
      that = this;
      that
        .$http({
          method: "post",
          url: $url + "GetGroupList"
        })
        .then(function(res) {
          if (res.data.error == 0) {
            that.GetAdmin_a.group = res.data.data;
          }
        });
    },
    getadminlist() {
      // * ==================
      // 请求
      // 获取管理员列表
      // * ==================
      that = this;
      that.adminFormVisibleLoading = true;
      that.$http({
        method: "post",
        url: $url + "GetAdminList"
      })
      .then(function(res) {
        res.data.data = res.data.data.filter(m => m.admin_id != 1);
        that.GetAdminList = res.data.data;
        that.adminFormVisibleLoading = false;
      });
    },
    onadminindex(ind_) {
      this.$parent.onAdminindex(ind_);
    },
    onadminsFormVisible_zh(form) {
      // 管理员账户
      that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          that.$http({
            method: "post",
            url: $url + "SetAdmin",
            data: {
              admin_id: that.GetAdminList[that.GetAdmin_id].admin_id,
              pass: that.adminFormAdd_model.SetAdminPass,
              phone_number: that.adminFormAdd_model.SetAdminIp
            }
          })
          .then(function(res) {
            if (res.data.error === 0) {
              that.$message({
                message: "修改成功",
                type: "success"
              });
              that.adminFormAdd_model.SetAdminIp = ""; //  清空输入框
              that.adminFormAdd_model.SetAdminPass = "";
              that.getadminlist();
              that.adminsFormVisible = false;
            } else {
              that.$message({
                message: "修改失败",
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    onadminsFormAdd(form) {
      // 添加管理员校验
      that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          if (that.GetAdmin_.authorityi_ == 3) {
            if (that.GetAdmin_.groupi != "") {
              that.addAdmin();
            } else {
              that.$message({
                message: "请选择一个小组",
                type: "error"
              });
            }
          } else {
            that.addAdmin();
          }
        } else {
          return false;
        }
      });
    },
    addAdmin() {
      // 添加管理员
      that = this;
      that.$http({
        method: "post",
        url: $url + "AddAdmin",
        data: {
          admin_name: that.adminFormAdd_model.SetAdminName,
          pass: that.adminFormAdd_model.SetAdminPass,
          phone_number: that.adminFormAdd_model.SetAdminIp,
          authority: that.GetAdmin_.authorityi_,
          admin_state: that.GetAdmin_.admin_statei_,
          campus: that.GetAdmin_.campusi_,
          group: that.GetAdmin_.groupi
        }
      })
      .then(function(res) {
        if (res.data.error === 0) {
          that.$message({
            message: res.data.data,
            type: "success"
          });
          that.adminFormAdd_model.SetAdminName = "";
          that.adminFormAdd_model.SetAdminPass = "";
          that.adminFormAdd_model.SetAdminIp = "";
          that.GetAdmin_.authorityi_ = "1";
          that.GetAdmin_.groupi = "";
          that.adminFormAdd = false;
          that.getadminlist();
        } else {
          that.$message({
            message: res.data.data,
            type: "error"
          });
        }
      });
    },
    onadminsFormVisible() {
      // 设置管理员
      that = this;
      that.$http({
          method: "post",
          url: $url + "SetAdmin",
          data: {
            admin_id: that.GetAdminList[that.GetAdmin_id].admin_id,
            authority: that.GetAdmin_.authorityi_,
            campus: that.GetAdmin_.campusi_,
            admin_state: that.GetAdmin_.admin_statei_
          }
        })
        .then(function(res) {
          if (res.data.error === 0) {
            that.$message({
              message: res.data.data,
              type: "success"
            });
            that.GetAdmin_.admin_statei = that.GetAdmin_a.admin_state[2].name;
            that.admin_startvali = "";
            (that.GetAdmin_id = 0), that.getadminlist();
            that.adminsFormVisible = false;
          }
        });
    },
    onadminsFormedit(index) {
      that = this;
      that.adminsFormVisible = true;
      that.GetAdmin_id = index;
      that.GetAdmin_ = {
        admin_statei:
          that.GetAdmin_a.admin_state[that.GetAdminList[index].admin_state]
            .name,
        campusi: that.GetAdmin_a.campus[that.GetAdminList[index].campus].name,
        authorityi:
          that.GetAdmin_a.authority[that.GetAdminList[index].authority - 1].name
      };
    }
  }
};
</script>

<style scoped>
.jurisdiction_tip {
  border-top: 1px solid #f2f2f2;
  background-color: #fff;
  padding: 20px;
}

.jurisdiction_tip {
  background-color: #fff;
  padding: 20px;
}

.jurisdiction_cont {
  padding: 20px;
}

.jurisdiction_cont_list {
  padding: 0 0 0 20px;
  background-color: #fff;
}

.jurisdiction_cont_list_lab {
  margin: -32px 0 -30px 33px;
  white-space: pre-line;
}

.jurisdiction_cont_list label:hover {
  background-color: #e9eef3;
}

.jurisdiction_cont_list label.el-radio.is-checked {
  background-color: #e5f2ff;
}

.jurisdiction_cont_list label {
  border-radius: 0.4rem;
  margin: 0 0 10px 0;
  padding: 20px;
  border: 1px solid #f2f2f2;
  width: calc(100% - 45px);
}
</style>
