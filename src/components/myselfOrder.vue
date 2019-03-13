<template>
  <div class="stistics">
    <el-main v-loading.lock="fullscreenLoading" class="stistics_d">
      <el-menu
        :default-active="listtypei"
        mode="horizontal"
        @select="selelist">
        <el-menu-item v-for="(i,index) in menutype" :key="index" :index="i.i">
          {{ i.n }}
          <el-badge :value="tableData.length" v-if="listnavsele != 5 ? listnavsele == (index + 2) : 3 ==  index" :max="99" class="item"></el-badge>
          <el-button size="mini" v-if="listnavsele != 5 ? listnavsele == (index + 2) : 3 ==  index" class="el-icon-refresh" style="margin: 0 0 0 10px"></el-button>
        </el-menu-item>
      </el-menu>
      <div class="main_tool">
        <el-row type="flex" class="row-bg" justify="space-between">
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
          </div>
        </el-row>
      </div>
      <el-table v-loading="loading" :default-expand-all="false" :border="true" :stripe="true" :highlight-current-row="true" class="ul stistics_table" size="mini"
                max-height="540" :data="tableData" style="width: 100%" height="100%" @select="onchangedata" @select-all="onselection">
        <el-table-column fixed="left" type="selection" min-width="35" key="col0"></el-table-column>
        <el-table-column fixed="left" sortable prop="repair_id" label="ID" key="col1"></el-table-column>
        <el-table-column sortable label="报修者" min-width="90" key="col2">
          <template slot-scope="n">
            <b>{{ n.row.user_name }}</b>
          </template>
        </el-table-column>
        <el-table-column sortable prop="phone_number" label="电话号码" min-width="120" key="col3"></el-table-column>
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
        <el-table-column prop="admin_name" label="分配人员" min-width="100" key="col9"></el-table-column>
        <el-table-column prop="evaluate" label="用户评价" key="col10"></el-table-column>
        <el-table-column prop="m_notes" label="维修说明" min-width="150" key="col11">
          <template slot-scope="t">
            <span style="margin-left: 10px" @click="modifyNote(t.$index,t.row.m_notes)">{{ t.row.m_notes.length > 0? t.row.m_notes : '填写内容' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:center;margin:5px 0;"
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="tableDataPage.length"
        @current-change="handleSizeChange"
        >
      </el-pagination>
    </el-main>

    <el-dialog title="编辑维修说明" :visible.sync="dialogFormVisibleNote">
      <el-form :model="notes">
        <el-form-item label="维修说明" :label-width="100+'px'">
          <el-input v-model="notes.note" autocomplete="off" :maxlength="100" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleNote = false">取 消</el-button>
        <el-button type="primary" @click="comfirmNote">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import store from "../vuex/index";
import ElButton from "element-ui/packages/button/src/button";

var that,
  $url = store.state.$url;
export default {
  components: {
    ElButton
  },
  data() {
    return {
      login: {
        authority: null
      },
      campus: "全部",
      adminFormVisibleLoading: false,
      adminFormAdd: false,
      adminFormVisible: false,
      adminsFormVisible: false,
      dialogFormVisible: false,
      dialogFormVisibleNote: false,
      notes: {
        note: ''
      },
      modifyIndex: null,
      form: {
        region: "",
        stuid: 0,
        cont: "",
        width: "100px"
      },
      fullscreenLoading: false,
      options: [],
      search: "",
      value: "",
      valuei: 0,
      menutype_btn: ["受理订单", "处理完成"],
      menutype: [
        {
          n: "已受理",
          i: "2"
        },
        {
          n: "处理完成",
          i: "3"
        }
      ],
      listampus: "0",
      tableDataPage:[],  //  数据总数
      page:0,            //  默认页面
      pageSize:20,       //  每个页面默认20条数据
      tableData: [],
      tableData_I: [],
      tableData_img: false,
      loading: true,

      listnavsele: "2",
      menui: "1",
      listtypei: "2",
      GetAdminList: [],
      GetAdmin_a: {
        authority: [
          {
            name: "超级管理员",
            id: 0
          },
          {
            name: "普通工作人员",
            id: 1
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
        ]
      },
      GetAdmin_: {
        authorityi: "超级管理员",
        admin_statei: "正常",
        campusi: "全部"
      },
      GetAdmin_id: 0
    };
  },
  created() {
    that = this;
    that.login = JSON.parse(localStorage.getItem("Login_"));
    if (that.login != null) {
      that.campus = that.iscampus(that.login.campus).n;
      that.onselecampus();
    }
    that.getList({
      campus: that.listampus,
      repair_state: 2
    });
    that
      .$http({
        method: "post",
        url: $url + "isLogin"
      })
      .then(function(res) {
        if (res.data.error !== 0) {
          that.$router.push({
            name: "login"
          });
        }
      });
    // that.getadminlist();
  },
  methods: {
    // getadminlist() {
    //   //  获取我的维修记录
    //   that = this;
    //   that.adminFormVisibleLoading = true;
    //   that.$http({
    //     method: "post",
    //     url: $url + "myRepair"
    //   })
    //   .then(function(res) {
    //     that.GetAdminList = res.data.data;
    //     that.adminFormVisibleLoading = false;
    //   });
    // },
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
    selelist(key) {
      that = this;
      that.fullscreenLoading = true;
      that.getList({
        campus: that.listampus,
        repair_state: key
      });
      that.page = 0 // 如果切换状态的时候页面设置回默认第0页面
      that.listnavsele = key;
      if (key == 1) {
        this.showNumHandle = true;
      } else if (key == 2) {
        this.showNumHandle = true;
      } else if (key == 3) {
        this.showNumHandle = false;
      } else {
        this.showNumHandle = false;
      }
    },
    onselection(val) {
      this.tableData_I = val;
    },
    onchangedata(val) {
      var art = [];
      for (var i of val) {
        art.push(i.repair_id);
      }
      this.tableData_I = art;
    },
    getList(data_) {
      // * 提交状态
      that = this;
      that.$http({
        method: "post",
        url: $url + "myRepair",
        data: data_
      })
      .then(function(res) {
        that.loading = false;
        that.fullscreenLoading = false;
        if (res.data.error === 0) {
          that.tableDataPage = res.data.data
          that.setPage()
        } else {
          that.$message({
            message: res.data.data,
            type: "error"
          });
        }
      });
    },
    seeimg(e) {
      this.$alert(e.target.nextElementSibling.outerHTML, {
        center: true,
        dangerouslyUseHTMLString: true
      });
    },
    iscampus(sty) {
      var sty;
      if (sty == "全部" || sty == 0) {
        sty = {
          i: 0,
          n: "全部"
        };
      }
      if (sty == "高要校区" || sty == 1) {
        sty = {
          i: 1,
          n: "高要校区"
        };
      }
      if (sty == "鼎湖校区" || sty == 2) {
        sty = {
          i: 2,
          n: "鼎湖校区"
        };
      }
      return sty;
    },
    IsType_(sty) {
      var sty;
      if (sty == 10) {
        sty = 2;
      }
      if (sty == 11) {
        sty = 3;
      }
      if (sty == 12) {
        sty = 5;
      }
      if (sty == 30) {
        sty = 0;
      }
      if (sty == 0) {
        sty = false;
      }
      return sty;
    },

    onselecampus() {
      that = this;
      that.listampus = that.iscampus(that.campus).i;
      localStorage.setItem("selecampus_", that.iscampus(that.campus).i);
      that.fullscreenLoading = true;
      that.getList({
        campus: that.listampus,
        repair_state: that.listnavsele
      });
    },
    onprint(is_) {
      // 打印数据列表
      that = this;
      var print_data_;
      if (is_ == "all") {
        if (that.tableData.length > 0) {
          print_data_ = JSON.stringify(that.tableData)
          that.printWord(print_data_)
        } else {
          that.$message({
            message: "没有可打印的维修单",
            type: "warning"
          });
        }
      } else {
        let ary = that.tableData_I,
          ary_d = that.tableData,
          ary_r = [];
        for (let i of ary) {
          for (let t of ary_d) {
            if (i == t.repair_id) {
              ary_r.push(t);
            }
          }
        }
        if (ary_r.length > 0) {
          print_data_ = JSON.stringify(ary_r)
          that.printWord(print_data_)
        } else {
          that.$message({
            message: "请勾选要打印的订单",
            type: "warning"
          });
        }
      }
    },
    printWord(print_data_) {
      //  确认下载维修文档
      that.$http({
        method: "post",
        url: $url + "PrintWord",
        data: {
          print_data: print_data_
        }
      })
      .then(function(res) {
        that.$alert("是否要下载维修单文档", "下载", {
          confirmButtonText: "确定",
          callback: action => {
            that.$message({
              type: action == "cancel"? "info" : "success",
              message: action == "cancel" ? "已取消" : "打印成功"
            });
            if (action == "confirm") {
              window.open(res.data.data);
            }
          }
        });
      });
    },
    handleSizeChange(e) {
      //  改变页面
      this.page = e-1;
      this.setPage()
    },
    modifyNote(index,note) {
      this.modifyIndex = index;
      this.notes.note = note;
      this.dialogFormVisibleNote = true;
    },
    comfirmNote() {
      //  提交维修说明
      that = this;
      that.$http({
        method: "post",
        url: $url + "setNotes",
        data: {
          repair_id: that.tableData[that.modifyIndex].repair_id,
          m_notes: that.notes.note
        }
      })
      .then(function(res) {
        if (res.data.error == 0) {
          that.$message({
            type: "success",
            message: "提交维修说明成功"
          });
          that.getList({
            campus: that.listampus,
            repair_state: that.listnavsele
          });
        } else {
          that.$message({
            type: "error",
            message: "提交维修说明失败"
          });
        }
      });
      that.dialogFormVisibleNote = false;
    }
  }
};
</script>

<style>
@import url('../css/myselfOrder.css');
</style>
