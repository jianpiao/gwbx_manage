<template>
  <div class="total" v-loading="loading">
    <div class="content_tip">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><span @click="onadminindex('Adminindex')">仪表板</span></el-breadcrumb-item>
        <el-breadcrumb-item>统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_toal">
      <div class="card-list">
        <div class="card-content">
          <div class="card-item" v-for="(item, index) in getGroupList" :key="index">
            <div class="card-header">
              {{item.group_name}}
            </div>
            <div class="card-body">
              <div class="admin-name" @click="checkTotal(0,item.group_admin,item.admin_name)">
                <el-tag>组长</el-tag>
                <span class="span">{{item.admin_name}}</span>
              </div>
              <div class="admin-name" v-for="(member, ind) in item.members" :key="ind" @click="checkTotal(0,member.admin_id,member.admin_name)">
                <el-tag type="info">成员</el-tag>
                <el-tooltip :content="'电话'+member.phone_number" placement="top">
                  <span class="span">{{member.admin_name}}</span>
                </el-tooltip>
              </div>
            </div>
            <div class="card-footer">
              <el-button type="primary" @click="checkTotal(1,item.group_id,item.group_name)">查看小组统计</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- 统计对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <span>统计日期:</span>
      <div class="block">
        <el-date-picker
          v-model="dateSelectValue"
          type="daterange"
          range-separator="至"
          :start-placeholder="defaultDate"
          :end-placeholder="endDate"
          :clearable="false"
          @change="selectDate">
        </el-date-picker>
        <div style="float:right;" @click="print" v-show="checkPeople == 1">
          <el-button icon="el-icon-printer">打印</el-button>
        </div>
      </div>
      <span>统计信息:</span>
      <div class="diglog-body el-tabs--border-card">
        <div class="dialog-content" v-for="(item, index) in total" :key="index">
          <div><el-tag :type="item.type">{{item.tag}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;{{item.title}}</div>
          <div>{{item.data}}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import store from "../../vuex/index";
var $url = store.state.$url;

export default {
  name: "total",
  data() {
    return {
      total: [],
      getGroupList: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loading: true,
      group_id: "",
      adminName: "",
      dateSelectValue: "",
      dialogTitle: "",
      checkPeople:0,
      data:{
        admin_id: undefined,
        group_id:undefined,
        start_time: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
        end_time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
      },
      defaultDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
      endDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    };
  },
  created() {
    this.getData();
  },
  methods: {
    onadminindex(ind_) {
      this.$parent.onAdminindex(ind_);
    },
    getData() {
      //  获取管理员列表和团队列表
      let self = this;
      this.$http({
        method: "post",
        url: $url + "GetGroupList"
      }).then(function(res) {
        console.log(res.data);
        self.getGroupList = res.data.data;
        self.loading = false;
      });
    },
    checkTotal(tag, id, title) {
      //  查看统计
      this.loading = true;
      this.dateSelectValue = "";
      this.group_id = id;
      this.checkPeople = tag;
      this.adminName = title;
      tag == 0 ? this.data.admin_id = id : this.data.group_id = id //  判断是选择个人还是小组
      tag == 0 ? this.data.group_id = undefined : this.data.admin_id = undefined
      this.getTotal(this.data,title);
    },
    getTotal(data, tit) {
      //  获取统计数据
      let self = this;
      this.$http({
        method: "post",
        url: $url + "getStatisticsData",
        data: data
      }).then(function(res) {
        self.total = [
          {
            title: "完成订单数  ",
            data: res.data.data.count,
            type: "",
            tag: "完成"
          },
          {
            title: "平均评分    ",
            data: res.data.data.average,
            type: "",
            tag: "平均"
          },
          {
            title: "出色评分个数",
            data: res.data.data.level_5,
            type: "",
            tag: "出色"
          },
          {
            title: "优秀评分个数",
            data: res.data.data.level_4,
            type: "success",
            tag: "优秀"
          },
          {
            title: "一般评分个数",
            data: res.data.data.level_3,
            type: "warning",
            tag: "一般"
          },
          {
            title: "较差评分个数",
            data: res.data.data.level_2,
            type: "danger",
            tag: "较差"
          },
          {
            title: "极差评级个数",
            data: res.data.data.level_1,
            type: "info",
            tag: "极差"
          }
        ];
        self.loading = false;
        self.dialogTitle = tit;
        self.dialogFormVisible = true;
      });
    },
    selectDate(e) {
      //  选择时间
      let [dd0, dd1] = [new Date(e[0]), new Date(e[1])];
      this.data.start_time = `${dd0.getFullYear()}-${dd0.getMonth() + 1}-${dd0.getDate()}`;
      this.data.end_time = `${dd1.getFullYear()}-${dd1.getMonth() + 1}-${dd1.getDate()}`;
      this.checkPeople == 0 ? this.data.admin_id = this.group_id : this.data.group_id = this.group_id
      this.checkPeople == 0 ? this.data.group_id = undefined : this.data.admin_id = undefined
      this.getTotal(this.data,this.adminName);
    },
    print() {
      //  打印统计
      let self = this
      this.data.group_id = this.group_id
      if (this.checkPeople == 1) {
        this.$http({
          method: "post",
          url: $url + "PrintWordStatistics",
          data: self.data
        }).then(function(res) {
          self.$alert('是否要下载小组统计文档', '下载', {
            confirmButtonText: '确定',
            callback: action => {
              self.$message({
              type: action == "cancel"? "info" : "success",
              message: action == "cancel" ? "已取消" : "打印成功"
              });
              if (action == 'confirm') {
                window.open(res.data.data)
              }
            }
          });
        });
      }
    }
  }
};
</script>

<style scoped>
.content {
  height: 100%;
}

.content_tip {
  border-top: 1px solid #f2f2f2;
  background-color: #fff;
  padding: 20px;
}

.content_toal {
  height: calc(100vh - 116px);
}

.card-list {
  width: calc(100% - 40px);
  margin: 10px 20px;
}

.card-content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
}

.card-item {
  position: relative;
  background-color: #fff;
  width: 250px;
  margin: 0 10px 10px 0;
  padding: 30px 30px 60px 30px;
  border-radius: 0.4rem;
  float: left;
}

.card-header {
  font-size: 24px;
  border-radius: 0.4rem;
  text-align: center;
}

.admin-name {
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 0.4rem;
  margin-bottom: 10px;
  cursor: pointer;
}

.card-body {
  margin: 20px 0;
}

.card-footer {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  margin-bottom: 20px;
  text-align: center;
}

.span {
  margin-left: 10px;
  cursor: pointer;
}

.diglog-body {
  background-color: #fff;
}

.dialog-content {
  display: flex;
  width: calc(100% - 40px);
  padding: 15px 20px;
  border-radius: 0.4rem;
}

.dialog-content > div:nth-child(1) {
  width: 50%;
}

.dialog-content > div:nth-child(2) {
  width: 50%;
  text-align: right;
}
</style>
