<template>
  <div class="main warning">  
    <div class="filter-wrap-2">  
      <div class="time-wrap">    
          <span class="time-tip">预警时间 : </span>
          <el-date-picker
            v-model="queryDate"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>      
      </div>
    </div>    
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template
                width="150"
                label="预警时间"
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
                  {{ row.name }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="180"
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
                width="150"
                label="联系人/电话"
                >
                <div>
                  {{ row.contactPerson }}/{{ row.contactPhone }}
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
        queryDate: Date.now(),
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() >= Date.now() ;
          }
        },   
        tableData: [],
        dailogData: [],
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 100,
        dailogTitle: '预警详情',
        dialogVisible: false
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
      //this.$parent.$data.tip = "预警信息";
      this.$store.commit('setTitle', '预警信息');
      this.warningList();
    },
    methods: {    
      handleCurrentChange(val) {
        this.pageIndex = val;     
        this.warningList(); 
      },
      warningList() {
        var parameterData = {           
              createTime: !this.queryDate ? '' : util.format(this.queryDate,'yyyy-MM-dd'),
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            };
        this.$http.post('/alertInfo/list', parameterData, {emulateJSON:true}).then(
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
                  this.$message({type: 'error', message: response.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
            }
        ) 
      },
      warningInfo(warnId) {
        var parameterData = {   
              id: warnId  
            };
        this.$http.post('/alertInfo/queryObject', parameterData, {emulateJSON:true}).then(
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
      dialogShow(warnId) { 
        this.dialogVisible = true;   
        this.warningInfo(warnId); 
      }
    },
    watch: {
      'queryDate': function() {
          var today = util.format(Date.now(),'yyyy-MM-dd');
          this.pageIndex = 1;        
          this.warningList();                   
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
  .time-tip {
    display: inline-block;
    margin-right: 5px;
    width: 90px;
    text-align: left;
    vertical-align: top;
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

  .filter-wrap-2 {
    margin-left: 30px;
  }
</style>

