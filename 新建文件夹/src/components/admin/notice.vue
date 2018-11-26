<template>
    <div class="notice" v-loading.fullscreen.lock="noticefullscreenLoading">
      <div class="notice_tip">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span @click="onadminindex('Adminindex')">仪表板</span></el-breadcrumb-item>
          <el-breadcrumb-item>公告</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="notice_cont_d">
        <el-row :gutter="20">
          <el-col :span="4" class="notice_cont_l">
            <el-tree
              show-checkbox
              node-key="id"
              ref="noticeTypeList"
              :data="noticeTypeList_Data"
              :default-expanded-keys="noticeTypeList_initial.a"
              :default-checked-keys="noticeTypeList_initial.b"
              @check-change="noticeTypeList_GetArray"
              >
            </el-tree>
          </el-col>
          <el-col :span="20">
            <el-button  type="primary" icon="el-icon-plus" @click="noticeResAddVisible = true">
              发布公告
            </el-button>
            <el-button @click="getNoticeList" class="el-icon-refresh">
              刷新
            </el-button>
            <!--@click.stop="onnotice_listStart"-->
            <el-radio-group v-model="notice_listStart" style="float: right" @change="onnotice_listStart">
              <el-radio-button label="all">
                <div >展开</div>
              </el-radio-button>
              <el-radio-button label="none">
                <div>折叠</div>
              </el-radio-button>
            </el-radio-group>
            <div class="notice_cont" v-loading="notice_loading">
              <div v-if="noticeList_l.length > 0">
                <el-collapse v-model="noticeList_l_active" >
                  <el-collapse-item :name="index" v-for="(item, index) in noticeList_l" :key="index">
                    <template slot="title">
                      <div class="notice_cont_tit">
                        <el-tag size="warning" v-if="item.default == 1">使用中</el-tag>
                        <el-tag size="medium">{{item.notice_type == 1 ? '内部' : '公共' }}</el-tag>
                        <el-tag type="danger" size="medium" v-if="item.notice_state == 0">已删除</el-tag>
                        {{item.notice_title}}
                        <div class="notice_cont_titButton">
                          <el-dropdown type="primary" size="small" split-button @click.stop="openreviseNotice(index,false)">
                              编辑
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item>
                                <div @click.stop="setDefaultNotice(index)">{{item.default == 1 ? '取消默认公告' : '设为默认公告'}}</div>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                        <div class="notice_cont_titButton notice_cont_titDele ">
                          <el-button type="danger" size="small" @click.stop="openreviseNotice(index,true)" plain>删除</el-button>
                        </div>

                      </div>
                    </template>
                    <div class="notice_cont_p">
                      <div>{{item.notice_content}}</div>
                    </div>
                    <div class="notice_cont_time">
                      由{{item.admin_name}}发布于{{item.release_time}}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div class="notice_cont_tit" v-if="noticeList_l.length <= 0">
                <p class="notice_cont_p">列表没有公告信息</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-dialog title="发布公告" :visible.sync="noticeResAddVisible">
        <el-form :model="noticeResAdd">
          <el-card class="box-card">
            <el-form-item label="公告标题" label-width="80px">
              <el-input v-model="noticeVal.noticeTit" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label-width="80px">
              <el-input type="textarea" v-model="noticeVal.noticeCont" auto-complete="off" placeholder="公告内容"></el-input>
            </el-form-item>
            <el-form-item label="公告类型" label-width="80px">
              <el-select v-model="noticeVal.noticeTypeVal" @change="onnoticeResAdd" placeholder="公告类型">
                <el-option
                  v-for="item in noticeVal.noticeType"
                  :key="item.i"
                  :label="item.n"
                  :value="item.i">
                </el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="noticeResAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNotice">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改公告" :visible.sync="noticeResEditVisible">
        <el-form :model="noticeResAdd" v-if="noticeVal.noticeState.t">
          <el-card class="box-card">
            <el-form-item label="公告标题" label-width="80px">
              <el-input v-model="noticeVal.noticeTit" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label-width="80px">
              <el-input type="textarea" v-model="noticeVal.noticeCont" auto-complete="off" placeholder="公告内容"></el-input>
            </el-form-item>
            <el-form-item label="公告类型" label-width="80px">
              <el-select v-model="noticeResAdd.noticeTypeVal" @change="onnoticeResEdit" placeholder="公告类型">
                <el-option
                  v-for="item in noticeVal.noticeType"
                  :key="item.i"
                  :label="item.n"
                  :value="item.i">
                </el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </el-form>
        <el-form :model="noticeResAdd" v-else>
          <el-card class="box-card">
            一旦删除无法撤回，请点你一下[确认]按钮删除这条公告
          </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="noticeResEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="setreviseNotice">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import store from '../../vuex/index'
import ElButton from 'element-ui/packages/button/src/button';

var that, $url = store.state.$url
export default {
  components: {ElButton},
  name: 'notice',
  data () {
    return {
      notice_listStart: 'none',
      noticeList_l_active:[],
      noticeTypeList_Data: [{
        id: -1,
        label: '分类',
        children: [
          {
            id: 2,
            label: '公共'
          },
          {
            id: 1,
            label: '内部'
          }
        ]
      }],
      noticeTypeList_initial: {
        a: [-1],
        b: [1, 2]
      },
      noticeTypeList_StuA: [],

      noticeList: [],
      noticeList_l: [],
      noticeVal: {
        noticeCont: '',
        noticeTit: '',
        noticeTypeVal: '公共',
        noticeTypeId: 2,
        noticeType: [
          {
            n: '内部公告',
            i: 1
          }, {
            n: '公共',
            i: 2
          }
        ],
        noticeState: {
          t: true,
          n: 1
        }
      },
      notice_loading: false,
      noticeResEditVisible: false,
      noticeResAddVisible: false,
      noticefullscreenLoading: false,
      noticeResAdd: {
        noticeTypeVal: '',
        noticeTypeId: 0,
        noticeId: ''
      }
    }
  },
  created () {
    this.getNoticeList(0)
    this.noticeTypeList_StuA = this.noticeTypeList_initial.b
  },
  methods: {
    onnotice_listStart () {
      that = this
      var ary = []
      if(that.notice_listStart == 'all'){
        for(var i = 0 ; i < that.noticeList_l.length ; i++){
          ary.push(i)
        }
      }else{
        ary = []
      }
      that.noticeList_l_active = ary
    },
    noticeTypeList_GetArray () {
      var that = this, ary = []
      that.noticeTypeList_StuA = that.$refs.noticeTypeList.getCheckedKeys()
      that.noticeList.forEach((item, t) => {
        for (let i of that.noticeTypeList_StuA) {
          if (i === item.notice_type) {
            ary.splice(t, 0, item)
          }
        }
      })
      that.noticeList_l = ary
    },
    onadminindex (ind_) {
      this.$parent.onAdminindex(ind_)
    },
    setreviseNotice () {
      // * ===============
      // 接口
      // 提交修改的公告
      // * ===============
      that.noticefullscreenLoading = true
      that.$http({
        method: 'post',
        url: $url + 'ReviseNotice',
        data: {
          notice_id: that.noticeResAdd.noticeId,
          notice_type: that.noticeResAdd.noticeTypeId,
          notice_title: that.noticeVal.noticeTit,
          notice_content: that.noticeVal.noticeCont,
          notice_state: that.noticeVal.noticeState.n
        }
      }).then(function (res) {
        that.notice_loading = false
        that.noticefullscreenLoading = false
        if (res.data.error == 0) {
          that.$message({
            message: res.data.data,
            type: 'success'
          })
          that.noticeResEditVisible = false
          that.getNoticeList()
        } else {
          that.$message(
            {
              message: res.data.data,
              type: 'error'
            }
          )
        }
      })
    },
    openreviseNotice (ind_, stu_) {
      // * ===============
      // 打开公告修改窗口
      // * ===============
      that = this
      that.noticeResEditVisible = true
      that.noticeVal.noticeCont = that.noticeList[ind_].notice_content
      that.noticeVal.noticeTit = that.noticeList[ind_].notice_title
      that.noticeVal.noticeState = (stu_ ? ({n: 0, t: false}) : ({n: 1, t: true}))
      that.noticeResAdd.noticeTypeVal = that.noticeVal.noticeType[that.noticeList[ind_].notice_type - 1].n
      that.noticeResAdd.noticeTypeId = that.noticeVal.noticeType[that.noticeList[ind_].notice_type - 1].i
      that.noticeResAdd.noticeId = that.noticeList[ind_].notice_id
    },
    getNoticeList (type_) {
      // * ===============
      // 接口
      // 获取公告列表
      // * ===============
      that = this, type_ = ''
      if (type_ == undefined) {
        type_ = 0
      }
      that.notice_loading = true
      that.$http({
        method: 'post',
        url: $url + 'GetNoticeList',
        data: {
          notice_type: type_
        }
      }).then(function (res) {
        that.notice_loading = false
        if (res.data.error == 0) {
          that.noticeList = res.data.data
          that.noticeList_l = res.data.data
        }
      })
    },
    onnoticeResEdit (val_) {
      that = this
      that.noticeResAdd.noticeTypeId = val_
    },
    onnoticeResAdd (val_) {
      that = this
      console.log(val_)
      that.noticeVal.noticeTypeId = val_
    },
    addNotice () {
      // * ===============
      // 接口
      // 添加公告
      // * ===============
      that = this
      that.noticeResAddVisible = false
      that.$http({
        method: 'post',
        url: $url + 'AddNotice',
        data: {
          notice_type: that.noticeVal.noticeTypeId,
          notice_title: that.noticeVal.noticeTit,
          notice_content: that.noticeVal.noticeCont
        }
      }).then(function (res) {
        if (res.data.error == 0) {
          that.noticeList = res.data.data
          that.$message({
            message: '发布成功',
            type: 'success'
          })
          that.getNoticeList(0)
          that.noticeVal.noticeTypeId = 0
          that.noticeVal.noticeTit = ''
          that.noticeVal.noticeCont = ''
        } else {
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    setDefaultNotice (ind_) {
      // 设置为默认公告
      that = this
      that.$http({
        method: 'post',
        url: $url + 'SetDefaultNotice',
        data: {
          notice_id: that.noticeList[ind_].notice_id
        }
      }).then(function (res) {
        if (res.data.error == 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
          that.getNoticeList()
        } else {
          that.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .notice{
    height: 100%;
  }

  .notice_tip {
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    padding: 20px;
  }

  .notice_cont_d {
    margin: 5px 20px;
  }

  .notice_cont {
    background-color: #fff;
    margin: 5px 0 0 0;
    border-radius: .3rem;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 200px;
    height: calc(100vh - 175px);
   }

  .notice_cont_tit {
    padding: 0 10px;
    font-size: 1.25rem;
  }

  .notice_cont_p {
    margin: 0 10px;
    background-color: #f2f2f2;
    border-radius: .4rem;
    padding: 10px;
  }

  .notice_cont_time {
    text-align: right;
    padding: 0 20px;
    color: #555;
   }

  .notice_cont_titButton {
    float: right;
    margin: 8px 10px 0 0;
    line-height: 0;
  }

  .notice_cont_tit .notice_cont_titDele {
    display: none;
  }

  .notice_cont_tit:hover .notice_cont_titDele {
    display: block;
  }

  .notice_cont_l{
    background-color: #fff;
    margin: 45px 0 0 0;
    padding: 20px 0 !important;
    border-radius: .3rem;
  }
</style>
