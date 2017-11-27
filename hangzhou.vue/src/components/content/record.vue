<template>
  <div class="main record">
    <div class="filter-wrap">
        <div class="time-wrap">
            <span class="time-tip">登记时间 : </span>
            <el-date-picker
              v-model="queryDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
        </div>
        <div class="area-wrap">
            <div class="area-tip">布控点类型 : </div>
            <ul class="area-list">
              <li v-for="(item,index) in dispatch" :class="{active:dispatchIndex==(index)}" @click="changeDispatch(index)">
                {{item.txt}}
              </li>
            </ul>
        </div>
        <div class="area-wrap" v-if="accountType == 1">
            <div class="area-tip">区域名称 : </div>
            <ul class="area-list">
              <div :class="moreClass ? 'area-list-single' : 'area-list-multiple'">
                  <li :class="{active:regionIndex==(-1)}" @click="changeRegion(-1)">
                    全部
                  </li>
                  <li v-for="(item,index) in region" :class="{active:regionIndex==(index)}" @click="changeRegion(index)">
                    <!-- {{item.areaName}} -->
                    <a :title="item.areaName" href="javascript: void(0)">{{item.areaName}}</a>
                  </li>
              </div>

              <div class="more" @click="showMore" v-if="moreShow">
                {{moreClass ? "更多" : "收起"}} <i :class="moreClass ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
              </div>
            </ul>
        </div>
    </div>
    <div class="btn-wrap">
       <!--  <el-button type="primary" class="export"><a href="/static/智慧社区业主信息表.xlsx" target="_blank">导出</a></el-button>  -->
       <div class="name-search">
          <el-input placeholder="" v-model="selectValue">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                <el-option label="布控点编号" value="monitoringId"></el-option>
                <el-option label="布控点名称" value="monitoringName"></el-option>
                <el-option label="刷证人姓名" value="visitorName"></el-option>
                <el-option label="刷证人身份证号" value="identityNum"></el-option>
                <el-option label="区域编号" value="areaNo"></el-option>
            </el-select>
            <el-button slot="append" icon="search" @click="searchRecord"></el-button>
          </el-input>
        </div>
        <el-button @click="cleanEvt">清除</el-button>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template
                width="150"
                label="登记时间"
                >
                <div>
                  {{ row.createTime | formatYmd }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="120"
                label="姓名"
                >
                <div>
                  {{ row.visitorName }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="200"
                label="身份证号"
                >
                <div>
                  {{ row.identityNum }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="120"
                label="区域编号"
                >
                <div>
                  {{ row.areaNo }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                label="区域名称"
                >
               <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false" v-if="row.areaName.length >= 10">
                    <div slot="content" class="tolsowlet" style="width:150px;">{{row.areaName  }}</div>
                    <a>{{ row.areaName  | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{row.areaName  }}</a>
              </div>
              </el-table-column>
              <el-table-column
                inline-template
                label="(编号)布控点名称"
                >
               <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false" v-if="row.monitoringName.length >= 10">
                    <div slot="content" class="tolsowlet" style="width:150px;">({{row.monitoringId}}){{row.monitoringName}}</div>
                    <a>({{row.monitoringId}}){{ row.monitoringName  | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>({{row.monitoringId}}){{ row.monitoringName}}</a>
              </div>

              </el-table-column>
              <el-table-column
                inline-template
                label="类型"
                >
                <div>
                  <div v-if = "row.monitoringType == 1 ">
                      酒店
                  </div>
                  <div v-if = "row.monitoringType == 2 ">
                      网咖
                  </div>
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                prop="detail"
                width="70"
                label="操作">
                <el-button @click="dialogShow(row.id)" type="text" class="font-600">详情</el-button>
              </el-table-column>
      </el-table>
      <div class="page-wrap" v-if="showPageTag">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
      </div>
    </div>

     <el-dialog :title="dailogTitle" v-model="dialogVisible" class="dailog-1000">

          <div class="dispatch-info">
            <div class="dispatch-over">
                <div class="dispatch-part-1">
                  <div class="dispatch-row">
                    <div class="dispatch-tip">登记时间 : </div>
                    <div class="dispatch-txt">{{dailogData.createTime | formatYmd}}</div>
                  </div>
                  <div class="dispatch-row">
                    <div class="dispatch-tip">布控点名称 : </div>
                    <div class="dispatch-txt">{{dailogData.monitoringName}}</div>
                  </div>
                </div>
                <div class="dispatch-part-2">
                  <div class="dispatch-row">
                    <div class="dispatch-tip">区域名称 : </div>
                    <div class="dispatch-txt">{{dailogData.areaName}}</div>
                  </div>
                  <div class="dispatch-row">
                    <div class="dispatch-tip">布控点类型 : </div>
                    <div class="dispatch-txt" v-if = "dailogData.monitoringType == 1 ">
                        酒店
                    </div>
                    <div class="dispatch-txt" v-if = "dailogData.monitoringType == 2 ">
                        网咖
                    </div>
                  </div>
                </div>
            </div>
            <div class="dispatch-row">
                <div class="dispatch-tip">布控点地址 : </div>
                <div class="dispatch-txt">{{dailogData.monitoringAddress}}</div>
            </div>
          </div>
          <div class="identity-info">
              <div class="w570">
                <div class="dispatch-over">
                  <div class="dispatch-part-1">
                    <div class="dispatch-row">
                      <div class="dispatch-tip">姓名 : </div>
                      <div class="dispatch-txt">{{dailogData.visitorName}} </div>
                    </div>
                    <div class="dispatch-row">
                      <div class="dispatch-tip">性别 : </div>
                      <div class="dispatch-txt">{{dailogData.sex}}</div>
                    </div>
                  </div>
                  <div class="dispatch-part-2">
                    <div class="dispatch-row">
                      <div class="dispatch-tip">民族 : </div>
                      <div class="dispatch-txt">{{dailogData.nationality}} </div>
                    </div>
                    <div class="dispatch-row">
                      <div class="dispatch-tip">出生 : </div>
                      <div class="dispatch-txt">{{dailogData.birthday}}</div>
                    </div>
                  </div>
              </div>
              <div class="dispatch-row">
                  <div class="dispatch-tip">身份证号 : </div>
                  <div class="dispatch-txt">{{dailogData.identityNum}}</div>
              </div>
              <div class="dispatch-over">
                  <div class="dispatch-part-1">
                    <div class="dispatch-row">
                      <div class="dispatch-tip">签发机关 : </div>
                      <div class="dispatch-txt">{{dailogData.issuingOrgan}}</div>
                    </div>
                  </div>
                  <div class="dispatch-part-2">
                    <div class="dispatch-row">
                      <div class="dispatch-tip">有效期限 : </div>
                      <div class="dispatch-txt">{{dailogData.indate}} </div>
                    </div>
                  </div>
              </div>
              <div class="dispatch-row">
                  <div class="dispatch-tip">地址 : </div>
                  <div class="dispatch-txt">{{dailogData.address}} </div>
              </div>
            </div>
            <img :src="dailogData.identityImage"  class="identity-img" />
            <div class="identity-img-text">身份证照片</div>
            <img :src="dailogData.faceImage" class="face-img" />
            <div class="face-img-text">抓拍照片</div>
          </div>

          <div class="dialog-footer">
            <!-- <el-button type="primary"@click="dialogVisible = false">确 定</el-button> -->
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>

      </el-dialog>

  </div>
</template>
<script>
  import util from '../../common/util'
  export default {
    name: 'visitorManage',
    data () {
      return {
        moreClass: true,
        moreTip: "更多",
        queryDate: Date.now(),
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() >= Date.now() ;
          }
        },
        dispatchIndex: 0,
        regionIndex: -1,
        dispatch: [{
          "txt": "全部",
          "id": ''
        },
        {
          "txt": "酒店",
          "id": '1'
        },
        {
          "txt": "网咖",
          "id": '2'
        }],
        region: [],
        selectType: '',
        selectValue: '',
        tableData: [],
        dailogData: [],
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 1,
        dispatchId: '',
        regionId: '',
        dailogTitle: '记录详情',
        dialogVisible: false,
        moreShow: true,
        areaVisible: false
      }
    },
    filters: {
      // dscirttoeasy: function (value) {
      //   if (value && value.length > 10){
      //      return value.substring(0, 10) + "...";
      //   } else {
      //       return value;
      //   }
      // }
    },
    created() {
        // this.$parent.$data.tip = "记录查询";
//        this.$store.commit('setTitle', '记录查询');
    },
    mounted() {
//        this.areaList();
//        this.recordList();
    },
    methods: {
      changeDispatch(index) {
          this.dispatchIndex = index;
          this.dispatchId = this.dispatch[index].id;
          //清空精确查找
          // this.selectType = '';
          // this.selectValue = '';
          // this.pageIndex = 1;
          // this.recordList();
          this.cleanEvt();
      },
      changeRegion(index) {
          this.regionIndex = index;
          if(index >= 0) {
            this.regionId = this.region[index].areaId;
          } else {
            //选的是全部区域则区域id为空
            this.regionId = '';
          }
          //清空精确查找
          // this.selectType = '';
          // this.selectValue = '';
          // this.pageIndex = 1;
          // this.recordList();
          this.cleanEvt();
      },
      showMore() {
          this.moreClass = !this.moreClass;
      },
      handleCurrentChange(val) {
          this.pageIndex = val;
          this.recordList();
      },
      areaList() {
          this.$http.post('/area/list.json', {}, {emulateJSON:true}).then(
             (res) => {
                if(res.data.result == 'ok') {
                    this.region = res.data.data.list;
                    if(res.data.data.list.length > 5) {
                        this.moreShow = true;
                    } else {
                        this.moreShow = false;
                    }
                 } else {
                    this.$message({type: 'error', message: res.data.msg, duration: 2000});
                 }
              }, (res) => {
                 this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
              }
          )
      },
      recordList() {
        var parameterData = {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              createTime: !this.queryDate ? '' : util.format(this.queryDate,'yyyy-MM-dd'),
              monitoringType: this.dispatchId,
              areaId: this.regionId,
              selectType: this.selectType,
              selectValue: this.selectValue
            };
        this.$http.post('/identityRecord/list', parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') {
                  this.tableData = res.data.data.list;
                  this.pageTotal = res.data.data.count;

                  if(this.pageTotal <= this.pageSize) {
                     this.showPageTag = false;
                  }else{
                     this.showPageTag = true;
                  }
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }
            }, (res) => {
               this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
            }
        )
      },
      recordInfo(recordId) {
        var parameterData = {
              id: recordId
            };
        this.$http.post('/identityRecord/queryObject.json', parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') {
                  this.dailogData = res.data.data;
               } else {
                  this.$message({type: 'error', message: response.data.msg, duration: 2000});
               }
            }, (res) => {
               this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
            }
        )
      },
      dialogShow(recordId) {
        this.dialogVisible = true;
        this.recordInfo(recordId);
      },
      //清除类型查找
      cleanEvt() {
        //清空精确查找
        this.selectType = '';
        this.selectValue = '';
        this.pageIndex = 1;
        this.recordList();
      },
      //根据类型查找
      searchRecord() {
        this.pageIndex = 1;
        this.recordList();
      }
    },
    computed: {
      accountType: function () {
         // alert(this.$store.state.users.userInfo.accountType);
         return this.$store.state.users.userInfo.accountType   //获取vuex里面 state 状态值
      }
    },
    watch: {
      'queryDate': function() {
          var today = util.format(Date.now(),'yyyy-MM-dd');
          this.pageIndex = 1;
          this.selectType = '';
          this.selectValue = '';
          this.recordList();
      },
      selectType() {
          // this.selectValue = '';
      },
      accountType() {
          //公安账户
          // if(this.accountType) {
          //   if(this.accountType == 1) {
          //     this.areaVisible = true;
          //   } else if (this.accountType == 2) {
          //   //派出所账户
          //     this.areaVisible = false;
          //   }
          // }
      }
    }
  }
</script>
<style>
  .main {
    font-size: 14px;
  }
  .time-wrap {
    color: #646464 !important;
    display: block;
    overflow: hidden;
    margin-bottom: 10px;
    height: 37px;
    line-height: 37px;
  }
  .time-wrap .el-input__inner {
    color: #646464 !important;
  }

  .table-wrap {
    margin: 20px 30px;
  }
  .el-input__inner {
    font-size: 14px !important;
  }

  .dailog-1000 .el-dialog--small {
    width: 1000px;
  }

  .page-wrap {
    margin-top: 20px;
  }
</style>

