<template>
  <div class="main dispatched">    
    <div class="filter-wrap">        
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
                <el-option label="区域编号" value="areaNo"></el-option>                       
            </el-select>
            <el-button slot="append" icon="search" @click="searchDispatch()"></el-button>
          </el-input>
        </div>
        <el-button @click="cleanEvt">清除</el-button>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template
                width="90"
                label="布控点编号"
                >
                <div>
                  {{ row.id }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template                               
                label="布控点名称"
                >
              <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false" v-if="row.monitoringName.length >= 10">
                    <div slot="content" class="tolsowlet" style="width:150px;">{{row.monitoringName }}</div>
                    <a>{{ row.monitoringName | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{ row.monitoringName}}</a>
                </div>
              </el-table-column>
             <el-table-column
                inline-template
                width="90"
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
                    <div slot="content" class="tolsowlet" style="width:150px;">{{row.areaName}}</div>
                    <a>{{ row.areaName | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{ row.areaName}}</a>                 
                </div>
              </el-table-column>
              <el-table-column
                inline-template                            
                label="布控点地址"
                >
               <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false" v-if="row.monitoringAddress.length >= 10">
                    <div slot="content" class="tolsowlet" style="width:150px;">{{row.monitoringAddress}}</div>
                    <a>{{ row.monitoringAddress | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{ row.monitoringAddress}}</a>    
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
                width="150"               
                label="最后使用时间"
                >
                <div>
                  {{ row.modifyTime | formatYmd }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="80" 
                label="设备状态"
                >               
                <div>
                  <div v-if = "row.devStatus == 1 ">
                      在线
                  </div>
                  <div v-if = "row.devStatus == 2 ">
                      离线
                  </div>
                </div>
              </el-table-column>   
              <el-table-column
                inline-template
                width="70"
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
                <el-button @click="dialogShow(row.id)" type="text" class="font-600">编辑</el-button>
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

    <el-dialog :title="dailogTitle" v-model="dialogVisible" size="tiny">
      <el-form :model="currentDispatch" :rules="dispatchRules" ref="dispatchForm" label-width="100px">
          <el-form-item label="布控点名称" prop="name">
            <el-input v-model="currentDispatch.name" placeholder="请输入布控点名称"></el-input>
          </el-form-item>                 
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit" :disabled="saveDisabled">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
      </el-form> 
    </el-dialog>

  </div>
</template>
<script>  
  export default {
    name: 'visitorManage',   
    data () {
      /* 自定义校验规则start */
      var dispatchValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入布控点名称'));
          }
          if (value.length > 20) {
             callback(new Error('请输入小于20位的布控点名称'));
          } 
          // var pattern = /^\w+$/;    
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          if (pattern.test(value)) {
            callback(new Error('请输入字母数字或汉字格式的布控点名称'));
          } 
          return callback(); 
      };
      /* 自定义校验规则end */
      return {         
        moreClass: true,
        moreTip: "更多",        
        dispatchIndex: 0,        
        dispatchId: '',               
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
        regionIndex: -1, 
        regionId: '',
        region: [],
        selectType: '',
        selectValue: '',
        tableData: [],
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 100,
        dailogTitle: '编辑别名',
        dialogVisible: false,
        currentDispatch: {
          name: ''
        },        
        dispatchRules: {
          name: [
            {validator: dispatchValidator, trigger: 'blur'}
          ]
        },
        saveDisabled: false,
        moreShow: false
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
      //this.$parent.$data.tip = "布控点信息";
      this.$store.commit('setTitle', '布控点信息');
      // alert(this.$store.state.users.userInfo.accountType);
      this.areaList();
      this.dispatchList();      
    },
    methods: {
      changeDispatch(index) {
        this.dispatchIndex = index;    
        this.dispatchId = this.dispatch[index].id; 
        //清空精确查找
        // this.selectType = '';
        // this.selectValue = '';
        // this.pageIndex = 1; 
        // this.dispatchList();
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
        // this.dispatchList();
        this.cleanEvt();      
      },
      showMore() {        
        this.moreClass = !this.moreClass;  
      },
      areaList() {  
          this.$http.post('/area/list.json', {}, {emulateJSON:true}).then(
             (res) => {
                if(res.data.result == 'ok') {                              
                    this.region = res.data.data.list; 

                    if(res.data.data.list.length > 9) {
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
      dispatchList() {
          var parameterData = {   
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,             
              monitoringType: this.dispatchId,
              areaId: this.regionId,
              selectType: this.selectType,
              selectValue: this.selectValue  
          };
          this.$http.post('/devInfo/list', parameterData, {emulateJSON:true}).then(
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
          );
      },
      dispatchInfo() {
          var parameterData = {   
              id: this.dispatchInfoId             
          };
          this.$http.post('/devInfo/queryObject', parameterData, {emulateJSON:true}).then(
             (res) => {
                if(res.data.result == 'ok') {   
                    this.currentDispatch.name = res.data.data.monitoringName;
                 } else {
                    this.$message({type: 'error', message: res.data.msg, duration: 2000});
                 }                 
              }, (res) => {
                 this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
              }
          );
      },     
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.dispatchList();
      },
      searchDispatch() {
        this.pageIndex = 1;
        this.dispatchList();
      },
      dialogShow(id) {  
        this.dialogVisible = true;        
        this.dispatchInfoId = id;
        this.dispatchInfo();
      },
      //清除类型查找
      cleanEvt() {
        //清空精确查找
        this.selectType = '';
        this.selectValue = '';
        this.pageIndex = 1;
        this.dispatchList();
      },
      handleSubmit() {       
        this.$refs.dispatchForm.validate((valid) => {
              if (valid) {                    
                  var parameterData = {  
                        id: this.dispatchInfoId,
                        monitoringName: this.currentDispatch.name
                  };
                  this.$http.post('/devInfo/modifyDevName', parameterData, {emulateJSON:true}).then(
                     (res) => {                        
                        if(res.data.result == 'ok') {                           
                            this.dialogVisible = false;                      
                            this.dispatchList();
                         } else {
                            this.$message({type: 'error', message: res.data.msg, duration: 2000});
                         }                 
                      }, (res) => {
                        this.$message({type: 'error', message: '读取信息失败,请稍候再试', duration: 2000});
                      }
                  );  
              } else {                               
                  return false;
              }
        });
      }
    },   
    computed: {
      accountType: function () {                  
         return this.$store.state.users.userInfo.accountType   //获取vuex里面 state 状态值
      }
    }, 
    watch: {
      dialogVisible() {
          if(!this.dialogVisible) { 
             this.saveDisabled = true;
             this.$refs.dispatchForm.resetFields();
          } else {
             this.saveDisabled = false;
          }
      },
      selectType() {        
          // this.selectValue = '';
      }
    }
  }
</script>
<style>  
  .main {
    font-size: 14px;
  }
  .btn-wrap {
    margin: 20px 20px 20px 0;
    overflow: hidden;
  }
  .el-button.export {
    padding: 0 !important;
    margin-top: 5px;
  }
  .el-button a {
    color: #fff;
  }
  .btn-wrap .el-button.el-button--primary {
    width: 100px;
    height: 30px;
    line-height: 30px;   
    background: #79a7ff;
    border: 1px solid #79a7ff;
  }    
  /*.area-wrap {   
    margin-bottom: 10px;
  }
  .area-tip {
    float: left;
    width: 90px;
    text-align: right;
    margin-right: 10px;
    color: #646464 !important;
    height: 32px;
    line-height: 32px;
  }
  .area-list {
    overflow: hidden;   
    position: relative;  
  }
  .area-list-single {
    height: 32px;
    overflow: hidden;
    width: 95%;
  } 
  .area-list-single li:hover {
    color: #587ed1;
  }
  .area-list-multiple {
    height: 32px;
    width: 95%;
  } 
  .area-list li {
    float: left;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
  }
  .area-list li.active {
    color: #587ed1;
    font-weight: bolder;
  }*/
  .name-search {
    float: left;
    width: 450px;
  }
  .dispatched .el-select .el-input {  
    width: 150px;
  }
  .dispatched .el-input-group__append {  
    text-align: center;    
  }
  .dispatched .btn-wrap {
    margin-left: 30px;   
  } 
  .filter-wrap {
    overflow: hidden;
    padding: 0 30px 10px;
    border-bottom: 1px solid #e0e6ed;   
    color: #646464 !important;
  }
  .table-wrap {
    margin: 20px 30px;
  }
  .el-input__inner {
    font-size: 14px !important;
  }
  .el-textarea__inner {
    font-family: Arial !important;
}

  .more {
    position: absolute;
    top: 0;
    right: 0;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
  } 

  .more:hover {
    color: #587ed1;
  }

  .dailog-1000 .el-dialog--small {
    width: 1000px;
  }

  .page-wrap {
    margin-top: 20px;
  }
</style>

