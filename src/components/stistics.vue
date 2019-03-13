<template>
  <div class="stistics">
    <el-main v-loading.lock="fullscreenLoading" class="stistics_d">
      <el-menu
        :default-active="listtypei"
        mode="horizontal"
        @select="selelist">
        <el-menu-item v-for="(i,index) in menutype" :key="index" :index="i.i">
          {{ i.n }}
          <el-badge :value="tableData.length" :max="99" class="item"
                    v-if="listnavsele != 5 ? listnavsele == (index + 1) : 3 ==  index"></el-badge>
          <el-button size="mini" v-if="listnavsele != 5 ? listnavsele == (index + 1) : 3 ==  index" class="el-icon-refresh" style="margin: 0 0 0 10px"></el-button>
        </el-menu-item>
      </el-menu>
      <div class="main_tool">
        <el-row type="flex" class="row-bg" justify="space-between">
          <div class="grid-content bg-purple">
            <!-- <div style="display: inline-flex;margin: 0 15px 0 10px;">
              已选择 {{ tableData_I.length }} 项 移动到
            </div> -->
            <el-select v-model="value" placeholder="请选择状态" @change="onmain_tool_input">
              <el-option value="10" label="已受理" v-if="listnavsele == 1 || listnavsele == 5"></el-option>
              <el-option value="11" label="处理完成" v-if="(listnavsele == 1 || listnavsele == 2) && login.authority == 1"></el-option>
              <el-option value="12" label="无效维修单" v-if="listnavsele == 1 || listnavsele == 2"></el-option>
              <el-option value="30" label="删除" v-if="(listnavsele - 1) == 0"></el-option>
            </el-select>
            <el-button type="primary" @click="onmain_tool">应用</el-button>
            <el-button type="primary" v-show="showNumHandle" @click="numHandle()">批量分配负责人</el-button>
          </div>
          <div class="grid-content bg-purple" @change="onselecampus" style="float: right;">
            <!--@command="handleCommand"-->
            <el-dropdown >
              <el-radio-group>
                <el-button type="primary"> 生成 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
              </el-radio-group>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <div @click="onprint('all')" style="padding: 10px 0">
                    <h4 style="margin: 0;line-height: 1.5;">
                      当前列表
                      <span v-if="tableData.length <= 0" style="float: right;">
                        <el-tag size="mini"  type="warning">无数据</el-tag>
                      </span>
                    </h4>
                    <p style="margin: 0;line-height: 1.5;">生成一份当前列表上所有维修单</p>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <div style="padding: 10px 0" @click="onprint('sele')">
                    <h4 style="margin: 0;line-height: 1.5">
                      仅勾选
                      <span v-if="tableData_I.length <= 0" style="float: right;">
                        <el-tag size="mini"  type="warning">请勾选数据</el-tag>
                      </span>
                    </h4>
                    <p style="margin: 0;line-height: 1.5;">选取勾选的维修单生成</p>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-radio-group v-model="campus">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="高要校区"></el-radio-button>
              <el-radio-button label="鼎湖校区"></el-radio-button>
            </el-radio-group>
          </div>
          <el-input :placeholder="'搜索:' + campus + ' 报修ID/报修者/手机号码/宿舍号'" @keyup.enter.native="onmain_tool_search"
                    v-model="search" style="width: 320px;">
            <el-button slot="append" icon="el-icon-search" @click="onmain_tool_search"></el-button>
          </el-input>
        </el-row>
      </div>
      <el-table key="tableData" v-loading="loading" :default-expand-all="false" :border="true" :stripe="true" :highlight-current-row="true" class="ul stistics_table" size="mini"
               :max-height="screenHeight" :data="tableData" style="width: 100%" height="100%" @select="onchangedata" @select-all="onselection">
        <el-table-column fixed="left" type="selection" width="35" key="col0"></el-table-column>
        <el-table-column fixed="left" sortable prop="repair_id" label="ID" key="col1"></el-table-column>
        <el-table-column sortable label="报修者" width="90" key="col2">
          <template slot-scope="n">
            <b>{{ n.row.user_name }}</b>
          </template>
        </el-table-column>
        <el-table-column sortable prop="phone_number" label="电话号码" width="120" key="col3"></el-table-column>
        <el-table-column sortable label="校区" min-width="90" key="col4">
          <template slot-scope="n">
            <el-tag size="medium">{{ n.row.campus_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="dormitory" label="宿舍号" min-width="90" key="col5"></el-table-column>
        <el-table-column prop="repair_content" label="内容" min-width="300" key="col6">
          <template slot-scope="n" style="display: inline-flex;display: flex;">
            <div style="display: inline-flex;width: 100%;">
              <span style="float: left;width: 100%;">{{ n.row.repair_content }}</span>
              <div class="incidental_picture" style="margin: 0 0 0 10px">
                <div v-for="(i,ind) in n.row.incidental_picture" :key="ind" class="incidental_picture_img" @click="seeimg">
                  <div class="incidental_picture_zg el-icon-zoom-in"></div>
                  <img  style="width: 100%;" :src="i"/>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable label="提交时间" min-width="170" key="col7">
          <template slot-scope="c">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ c.row.up_time }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="处理时间" min-width="170" class="el-icon-time" key="col8">
          <template slot-scope="t">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ t.row.processing_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reply" label="负责人" min-width="150" key="col9">
          <template slot-scope="scope">
            <el-select v-model="scope.row.disObj_name" v-show="listnavsele == 1 || listnavsele == 2" @change="setAdmin(scope.row.repair_id,scope.row.disObj_name)" placeholder="负责人" style="width:120px;">
               <el-option
                  v-for="item in GetAdminList"
                  :key="item.disObj_id"
                  :label="item.disObj_name"
                  :value="item.disObj_id">
                </el-option>
            </el-select>
            <span v-show="listnavsele == 3 || listnavsele == 5" style="margin-left: 10px">{{ scope.row.disObj_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="evaluate" label="用户评价" v-if="listnavsele == 3" key="col10" min-width="180"></el-table-column>
        <el-table-column prop="m_notes" label="维修说明" min-width="150" key="col11"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="150" key="col12" v-if="(login.authority == 1 && (listnavsele - 1) < 2) || (login.authority == 2 && (listnavsele - 1) == 0)">
          <template slot-scope="scope">
            <div v-if="(login.authority == 1 && (listnavsele - 1) < 2) || (login.authority == 2 && (listnavsele - 1) == 0)">
              <el-dropdown size="medium" trigger="click" split-button type="primary" @click="onsetListData(scope.row.repair_id)" >
                {{menutype_btn[listnavsele - 1]}}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="onFormChange( scope.row.repair_id )">
                      变更状态
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-if="login.authority == 2 && (listnavsele - 1) == 1 " >
              <el-button type="primary" disabled>
                <div>待学生确认</div>
              </el-button>
            </div>
            <el-button type="primary" v-if="(listnavsele - 1) >= 2" @click="onFormChange( scope.row.repair_id )">
              <div>变更订单状态</div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float:left;display:flex;">
        <el-button icon="el-icon-remove-outline" @click="setScreenHeight(0)"></el-button>
        <el-input v-model="screenHeight" placeholder="请输入内容" style="width:5rem;margin:0 5px;"></el-input>
        <el-button icon="el-icon-circle-plus-outline" @click="setScreenHeight(1)"></el-button>
      </div>
      <el-pagination
        style="text-align:right;margin:5px 0;"
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="tableDataPage.length == 0 ? 1 : tableDataPage.length"
        @current-change="handleSizeChange"
        >
      </el-pagination>
    </el-main>

    <el-dialog title="变更状态"  :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>更改保修单： {{ form.stuid }}</span>
          </div>
          <el-form-item label="变更状态" :label-width="form.width">
            <el-select v-model="form.region" placeholder="请选择状态">
              <el-option value="10" label="已受理" v-if="listnavsele == 1"></el-option>
              <el-option value="11" label="处理完成" v-if="listnavsele == 2 || listnavsele == 5"></el-option>
              <el-option value="12" label="无效维修单"></el-option>
              <el-option value="30" label="删除" v-if="(listnavsele - 1) == 0"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="处理注释" :label-width="form.width">
            <el-input type="textarea" placeholder="请输入处理结果注释" v-model="form.cont">
            </el-input>
          </el-form-item> -->
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inputCancel">取 消</el-button>
        <el-button type="primary" @click="onFormRes">确 定</el-button>
      </div>
    </el-dialog>

  <!-- 选择批量分配人员 -->
  <el-dialog title="选择批量分配负责人" :visible.sync="dialogFormVisible3">
    <el-select v-model="selectAdmin" placeholder="请选择负责人" style="width:100%">
      <el-option
          v-for="item in GetAdminList"
          :key="item.disObj_id"
          :label="item.disObj_name"
          :value="item.disObj_id">
        </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible3 = false">取 消</el-button>
      <el-button type="primary" @click="setSelectAdmin()">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
import store from '../vuex/index'
import ElButton from 'element-ui/packages/button/src/button'

var that, $url = store.state.$url
export default {
  components: {
    ElButton
  },
  data () {
    return {
      login: {
        authority: null
      },
      campus: '全部',
      adminFormVisibleLoading: false,
      adminFormAdd: false,
      adminFormVisible: false,
      adminsFormVisible: false,
      dialogFormVisible: false,
      form: {
        region: '', stuid: 0, cont: '', width: '100px'
      },
      fullscreenLoading: false,
      options: [],
      search: '',
      value: '',
      valuei: 0,
      menutype_btn: ['受理订单', '处理完成'],
      menutype: [{
        n: '已报修', i: '1'
      }, {
        n: '已受理', i: '2'
      }, {
        n: '处理完成', i: '3'
      }, {
        n: '无效维修', i: '5'
      }],
      listampus: '0',
      tableDataPage:[],  //  数据总数
      page:0,            //  默认页面
      pageSize:20,       //  每个页面默认20条数据
      tableData: [],
      tableData_I: [],
      tableData_img: false,
      loading: true,

      listnavsele: '1',
      menui: '1',
      listtypei: '1',
      GetAdminList: [],
      GetAdmin_a: {
        authority: [{
          name: '超级管理员', id: 0
        }, {
          name: '普通工作人员', id: 1
        }],
        admin_state: [{
          name: '删除', id: 0
        }, {
          name: '停用', id: 1
        }, {
          name: '正常', id: 2
        }],
        campus: [{
          name: '全部', id: 0
        }, {
          name: '高要', id: 1
        }, {
          name: '鼎湖', id: 2
        }]
      },
      GetAdmin_: {
        authorityi: '超级管理员', admin_statei: '正常', campusi: '全部'
      },
      GetAdmin_id: 0,
      allocation: '',
      showNumHandle: true,
      dialogFormVisible3: false,
      formLabelWidth3: '120px',
      selectAdmin: '',
      screenHeight:!!localStorage.getItem('screenHeight') ? parseInt(localStorage.getItem('screenHeight')) : 530
    }
  },
  created () {
    that = this
    that.login = JSON.parse(localStorage.getItem('Login_'))
    if (that.login != null) {
      that.campus = that.iscampus(that.login.campus).n
      that.onselecampus()
    }
    that.getList({
      campus: that.listampus,
      repair_state: 1
    })
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
    that.getadminlist()
  },
  methods: {
    getadminlist () {
      that = this
      that.adminFormVisibleLoading = true
      that.$http({
        method: 'post',
        url: $url + 'GetDisObjList'
      }).then(function (res) {
        console.log(res.data);
        
        that.GetAdminList = res.data.data
        that.adminFormVisibleLoading = false
      })
    },
    selelist (key) {
      that = this
      that.fullscreenLoading = true
      that.getList({
        campus: that.listampus,
        repair_state: key
      })
      that.page = 0
      that.value = ''
      that.listnavsele = key
      if (key == 1) {
        this.showNumHandle = true
      } else if (key == 2) {
        this.showNumHandle = true
      } else if (key == 3) {
        this.showNumHandle = false
      } else{
        this.showNumHandle = false
      }
    },
    onselection (val) {
      this.tableData_I = val
    },
    onchangedata (val) {
      var art = []
      for (var i of val) {
        art.push(i.repair_id)
      }
      this.tableData_I = art
    },
    getList (data_) {
      // * 提交状态
      that = this
      that.$http({
        method: 'post',
        url: $url + 'getRepairList',
        data: data_
      }).then(function (res) {
        that.loading = false
        that.fullscreenLoading = false
        if (res.data.error === 0) {
          that.tableDataPage = res.data.data;
          that.setPage();
        } else {
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    setPage() {
      //  设置分页
      let [p,d,r,t,m,s,i] = [Math.ceil(this.tableDataPage.length/this.pageSize),[],this.tableDataPage,0,0,this.pageSize,0];
      p = p == 0 ? 1 : p; //  p不能等于0
      for(i =0; i < p ;i++) {
        d.push([]); //  创建新的数组
          t = i*s; //  确认数组位置
          m = t+s;
          for(t; t < m ;t++){
            if (!!r[t]) {
              d[i].push(r[t]);
            }
          }
      }
      this.tableData = d[this.page];  //  最后结果赋值到渲染的数组
    },
    seeimg (e) {
      this.$alert(e.target.nextElementSibling.outerHTML, {
        center: true,
        dangerouslyUseHTMLString: true,
        closeOnClickModal:true
      })
    },
    onmain_tool_input (val) {
      that = this
      that.valuei = val
    },
    onFormRes (index_) {
      that = this
      if (!!that.IsType_(that.form.region)) {
        that.onsetListData([{
          repair_id: that.form.stuid, repair_state: that.IsType_(that.form.region), reply: that.form.cont
        }])
        that.dialogFormVisible = false
        that.form.cont = ''
        that.form.region = ''
      } else {
        that.$message({
          message: '请选择更变状态'
        })
      }
    },
    inputCancel(){
      this.dialogFormVisible = false
      this.form.region = ''
    },
    onFormChange (index_) {
      // * =================
      // * 打开 变更状态 - 按钮
      // * =================
      that = this
      that.dialogFormVisible = true
      that.form.stuid = index_
    },
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
    IsType_ (sty) {
      var sty
      if (sty == 10) {
        sty = 2
      }
      if (sty == 11) {
        sty = 3
      }
      if (sty == 12) {
        sty = 5
      }
      if (sty == 30) {
        sty = 0
      }
      if (sty == 0) {
        sty = false
      }
      return sty
    },
    onmain_tool_search () {
      // * =================
      // * 搜索
      // * =================
      that = this
      that.fullscreenLoading = true
      that.$http({
        method: 'post',
        url: $url + 'search',
        data: {
          campus: that.campus,
          repair_state: that.IsType_(that.listnavsele),
          val: that.search
        }
      }).then(function (res) {
        that.fullscreenLoading = false
        if (res.data.error == 0) {
          that.tableDataPage = res.data.data
          that.setPage()
          // that.tableData = res.data.data
          that.$notify.info({
            title: '查询结果 - ' + that.menutype[that.listnavsele - 1].n,
            message: '在[' + that.campus + ']中找到一共[' + res.data.data.length + ']条含: ' + that.search,
            position: 'top-right'
          })
          that.search = ''
        } else {
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    onmain_tool (data_) {
      // * =================
      // * 多选提交
      // * =================
      var that = this, data = that.tableData_I, data_art = [], sty = that.valuei
      if (data.length <= 0 || sty === 0) {
        that.$message({
          message: (sty === 0 ? '请选择移动到何处' : '请选择从列表中选择一个以上的目标'),
          type: 'warning'
        })
      } else {
        var sty = that.IsType_(sty)
        function serData () {
          for (var i of that.tableData_I) {
            data_art.push({
              repair_id: i.repair_id || i,
              repair_state: sty,
              reply: ''
            })
          }
          that.onsetListData(data_art)
        }
        if (sty === 0) {
          that.$confirm('此操作将删除所选记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            serData()
          })
        } else {
          console.log('非删除')
          serData()
        }
      }
    },
    onsetListData (data_) {
      // * ================
      // * 变更状态
      // * ================
      that = this
      that.fullscreenLoading = true
      if (typeof data_ === "number") {
        data_ = [{
          repair_id: data_,
          repair_state: (function () {
            var type = Number(that.listnavsele) + 1
            if (type > 0 && type <= 5) {
              return type
            }
          })(),
          reply: ''
        }]
      }
      that.$http({
        method: 'post',
        url: $url + 'setRepairState',
        data: {
          list: JSON.stringify(data_)
        }
      }).then(function (res) {
        if (res.data.error === 0) {
          that.fullscreenLoading = false;
          that.getList({
            campus: that.listampus,
            repair_state: that.listnavsele
          })
          that.$message({
            message: '订单更变成功',
            type: 'success'
          })
        } else {
          that.fullscreenLoading = false;
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    onselecampus () {
      that = this
      that.listampus = that.iscampus(that.campus).i
      localStorage.setItem('selecampus_', that.iscampus(that.campus).i);
      that.fullscreenLoading = true
      that.getList({
        campus: that.listampus,
        repair_state: that.listnavsele
      })
    },
    onprint (is_) {
      // 打印数据列表
      that = this
      var print_data_
      if (is_ == 'all') {
        print_data_ = JSON.stringify(that.tableData)
         this.comfirmPrintWord(print_data_)
      } else {
        let ary = that.tableData_I, ary_d = that.tableData, ary_r = []
        for (let i of ary) {
          for (let t of ary_d) {
            if (i == t.repair_id) {
              ary_r.push(t)
            }
          }
        }
        if (ary_r.length > 0) {
          print_data_ = JSON.stringify(ary_r)
          this.comfirmPrintWord(print_data_)
        } else {
          that.$message({
            message: '请勾选要打印的订单',
            type: 'warning'
          })
        }
      }
    },
    comfirmPrintWord(data) {
      // 提交打印的数据并且给用户下载
      that.$http({
            method: 'post',
            url: $url + 'PrintWord',
            data: {
            print_data: data
            }
        }).then(function (res) {
          that.$alert('是否要下载维修单文档', '下载', {
          confirmButtonText: '确定',
          callback: action => {
            that.$message({
            type: action == "cancel"? "info" : "success",
            message: action == "cancel" ? "已取消" : "打印成功"
            });
            if (action == 'confirm') {
              window.open(res.data.data)
            }
          }
        });
      })
    },
    setAdmin(data_,disObj_id) {
      // * ================
      // * 分配单个人员
      // * ================
      that = this
      that.fullscreenLoading = true
      if (typeof data_ === "number") {
        data_ = [{
          repair_id: data_,
          reply: '',
          disObj_id: disObj_id
        }]
      }
      that.$http({
        method: 'post',
        url: $url + 'setRepairState',
        data: {
          list: JSON.stringify(data_)
        }
      }).then(function (res) {
        if (res.data.error === 0) {
          that.fullscreenLoading = false;
          that.getList({
            campus: that.listampus,
            repair_state: that.listnavsele
          })
          that.$message({
            message: '分配成功',
            type: 'success'
          })
        } else {
          that.fullscreenLoading = false;
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    numHandle() {
      // * =================
      // * 多选分配人员
      // * =================
      var that = this, data = that.tableData_I, data_art = [], sty = that.valuei
      if (data.length < 1) {
        that.$message({
          message: '请选择从列表中选择一个以上的负责人',
          type: 'warning'
        })
      } else {
        this.dialogFormVisible3 = true
      }
    },
    setSelectAdmin() {
      this.dialogFormVisible3 = false
      var that = this, data = that.tableData_I, data_art = []
      var sty = that.IsType_(sty)
      for (var i of that.tableData_I) {
        data_art.push({
          repair_id: i.repair_id || i,
          reply: '',
          disObj_id: this.selectAdmin
        })
      }
      that.$http({
        method: 'post',
        url: $url + 'setRepairState',
        data: {
          list: JSON.stringify(data_art)
        }
      }).then(function (res) {
        if (res.data.error === 0) {
          that.getList({
            campus: that.listampus,
            repair_state: that.listnavsele
          })
          that.$message({
            message: '分配成功',
            type: 'success'
          })
        } else {
          that.fullscreenLoading = false;
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    handleSizeChange(e) {
      //  改变页面
      this.page = e-1;
      this.setPage()
    },
    setScreenHeight(i) {
      this.screenHeight = i == 0 ? parseInt(this.screenHeight)-1 : parseInt(this.screenHeight)+1
    }
  },
  watch:{
    screenHeight(i) {
      localStorage.setItem('screenHeight',i)
    }
  }
}
</script>

<style>
  .stistics {
    width: 100%;
    height: calc(100% - 60px);
    min-width: 1200px;
  }

  .stistics .stistics_d {
    height: 100%;
    background-color:#e9eef3 ;
  }

  .main_index>section {
    height: 100%;
  }

  .main_index>section .ul {
    height: calc(100% - 112px) !important;
  }

  .main_index .incidental_picture {
    float: right;
  }

  .main_index .incidental_picture,
  .main_index .incidental_picture>div {
    display: inline-flex !important;
  }

  .main_index .incidental_picture .incidental_picture_img {
    overflow: hidden;
    border-radius: .3rem;
    position: relative;
    float: left;
    width: 28px;
    height: 28px;
    min-width: 28px;
    max-width: 28px;
    float: left;
    margin: 0 10px 0 0;
  }

  .main_index .incidental_picture .incidental_picture_img .incidental_picture_zg {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: rgba(0,0,0,.55);
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .main_index .incidental_picture .incidental_picture_img:hover .incidental_picture_zg {
    opacity: 1;
  }

  .main_index .incidental_picture img {
    width: 100%;
    height: 100%;
  }

  .main_tool {
    padding: 0px 20px;
    background-color: #e9eef3;
  }

  .main_tool > div {
    padding: 5px 0;
  }

  .main_index {
    border-bottom: 0 !important;
  }

  .main_index .stistics_table{
    width: calc(100% - 40px) !important;
    height: 100%;
    margin: 0 20px;
  }
</style>
