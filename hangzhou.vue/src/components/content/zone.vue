<template>
  <div class="main zone">  
    <div class="btn-wrap-2">
        <el-button type="primary" class="export" @click="dialogShow('add')">新增</el-button> 
        <!-- <el-button type="primary" class="export"><a href="/static/智慧社区业主信息表.xlsx" target="_blank">导入</a></el-button> -->      
        <div class="zone-search">
          <el-input placeholder="请输入区域编号" v-model="nameInput">           
            <el-button slot="append" icon="search" @click="searchName"></el-button>
          </el-input>
        </div>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template               
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
                        <div slot="content" class="tolsowlet" style="width:180px;">{{row.areaName }}</div>
                        <a>{{ row.areaName | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{row.areaName }}</a>
              </div>

              </el-table-column>
              <el-table-column
                inline-template
                label="区域地址"
                width="200"
                >
              <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false"  v-if="row.areaAddress.length >= 10" >
                    <div slot="content" class="tolsowlet" style="width:180px;">{{row.areaAddress }}</div>
                    <a>{{ row.areaAddress | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{row.areaAddress }}</a>
              </div>
              </el-table-column>
              <el-table-column
                inline-template                
                label="负责人"
                >
                <div>
                  {{ row.chargePerson }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template               
                label="联系电话"
                >
                <div>
                  {{ row.contactPhone }}
                </div>
              </el-table-column>                        
              <el-table-column
                inline-template
                prop="detail"
                width="120"
                label="操作">
                <div>
                  <el-button @click="dialogShow('edit',row.areaId)" type="text" class="font-600">编辑</el-button>
                  <el-button @click="delConfirm(row.areaId)" type="text" class="font-600">删除</el-button>
                </div>
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
      <el-form :model="currentData" :rules="zoneRules" ref="zoneForm" label-width="100px">
          <el-form-item label="区域编号" prop="areaNo">
            <el-input v-model="currentData.areaNo" placeholder="请输入区域编号"></el-input>
          </el-form-item>
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="currentData.areaName" placeholder="请输入区域名称"></el-input>
          </el-form-item>
          <el-form-item label="区域地址" prop="areaAddress">
            <el-input v-model="currentData.areaAddress" placeholder="请输入区域地址" type="textarea" class="textarea-text"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="chargePerson">
            <el-input v-model="currentData.chargePerson" placeholder="请输入负责人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="currentData.contactPhone" placeholder="请输入联系电话"></el-input>
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
    import { mapState } from 'vuex'
    import { mapGetters } from 'vuex'

    export default {
    name: 'visitorManage',   
    data () {
       /* 自定义校验规则start */
      var areaNoValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入区域编号'));
          }
          if (value.length > 10) {
            callback(new Error('请输入小于10位的区域编号'));
          } 
          var pattern = /^[0-9a-zA-Z]*$/; 
          if (!pattern.test(value)) {
            callback(new Error('请输入字母或数字格式的编号'));
          } 
          return callback(); 
      };
      var areaNameValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入区域名称'));
          }
          if (value.length > 25) {
             callback(new Error('请输入小于25位的区域名称'));
          } 
          // var pattern = /^\w+$/;    
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          if (pattern.test(value)) {
            callback(new Error('请输入字母数字或汉字格式的区域名称'));
          } 
          return callback(); 
      };
      var areaAddressValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入区域地址'));
          }
          if (value.length > 25) {
             callback(new Error('请输入小于25位的区域地址'));
          } 
          // var pattern = /^\w+$/;    
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          if (pattern.test(value)) {
            callback(new Error('请输入字母数字或汉字格式的区域地址'));
          } 
          return callback(); 
      };
      var chargePersonValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入负责人'));
          }
          if (value.length > 10) {
             callback(new Error('请输入小于10位的负责人'));
          } 
          var pattern = /^[\u4e00-\u9fa5]*$/; 
          var pattern2 = /^[a-zA-Z]*$/;             
          if (!(pattern.test(value) || pattern2.test(value))) {
            callback(new Error('请输入汉字或字母格式的负责人'));
          } 
          return callback(); 
      };
      var contactPhoneValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入联系电话'));
          }  
         if (value.length != 11) {
             callback(new Error('请输入11位的手机号码'));
          }       
          var pattern = /^[0-9]*$/; 
          if (!pattern.test(value)) {           
            callback(new Error('请输入数字格式的联系电话'));
          } 
          return callback(); 
      };
      /* 自定义校验规则end */
      return {         
        nameInput: '',
        tableData:[],
        currentData: {
          areaId:'',
          areaName: '',
          areaAddress: '',
          chargePerson: '',
          contactPhone: ''
        },
        zoneRules: {
          areaNo: [
            {validator: areaNoValidator, trigger: 'blur'},
          ],
          areaName: [
            {validator: areaNameValidator, trigger: 'blur'}
          ],
          areaAddress: [
            {validator: areaAddressValidator, trigger: 'blur'}
          ],
          chargePerson: [
            {validator: chargePersonValidator, trigger: 'blur'}
          ],
          contactPhone: [
            {validator: contactPhoneValidator, trigger: 'blur'}
          ]
        },
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 1,
        dailogTitle: '',
        dialogVisible: false,
        saveDisabled: false
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
      this.$store.commit('setTitle', '区域设置');
      this.areaList();
    },    
    methods: {
      areaList() {          
          var parameterData = {   
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              areaNo: this.nameInput
          }; 

        this.$http.post('/area/list', parameterData, {emulateJSON:true}).then(
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.areaList();
      },
      searchName() {
        this.pageIndex =1;
        this.areaList();
      },
      dialogShow(handle, num) {          
        this.dialogVisible = true;
        if(handle == 'add') {
          this.dailogTitle = "新增区域";
          this.currentData = {
            areaId:'',
            areaNo:'',
            areaName: '',
            areaAddress: '',
            chargePerson: '',
            contactPhone: ''
          };
        } else if(handle == 'edit') {
          this.dailogTitle = "编辑区域";
          this.getCurrentData(num);
        }  
      },
      getCurrentData(num) {        
         this.$http.post('/area/getAreaDetail', {areaId: num}, {emulateJSON:true}).then(

          (res) => {
              if(res.data.result == 'ok') {  
                  this.currentData = res.data.data;                              
              } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
              }                 
          }, (res) => {
                this.$message({type: 'error', message: '信息获取失败,请稍候再试', duration: 2000});
          }
        )  
      },
      handleSubmit() {
        this.$refs.zoneForm.validate((valid) => {
              if (valid) {                                       
                  var parameterData = {         
                      areaId: this.currentData.areaId,
                      areaNo:this.currentData.areaNo,
                      areaName: this.currentData.areaName,
                      areaAddress: this.currentData.areaAddress,
                      chargePerson: this.currentData.chargePerson,
                      contactPhone: this.currentData.contactPhone                                           
                  };     
         
                  this.$http.post('/area/createOrModify', parameterData, {emulateJSON:true}).then(   
                      (res) => {                       
                         if(res.data.result == 'ok') {                              
                            this.dialogVisible = false;
                              this.areaList();
                          } else {
                             this.$message({type: 'error', message: res.data.msg, duration: 2000});
                          }                 
                       }, (res) => {
                          this.$message({type: 'error', message: '信息保存失败,请稍候再试', duration: 2000});
                       }
                  )    
              } else {               
                  return false;
              }
        });
      },
      delConfirm(areaId) {
        this.$confirm("此操作将删除该信息, 是否继续?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delData(areaId);        
        }).catch(() => {
          vm.$message({type: 'info',message: '已取消删除'});          
        });
      },
      delData(areaId) {
        this.$http.post('/area/deleteArea', {areaId: areaId}, {emulateJSON:true}).then(               
           (res) => {
              if(res.data.result == 'ok') {   

                this.areaList();
                  /*  vm.$message({type: 'info',message: '删除区域失败,存在绑定布控点'});  
                    console.log("1111");                    */
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: res.data.msg, duration: 2000});
            }
        )    
      }
    },
    computed:{
        // ...mapGetters({
        //     userData: 'getUserInfo'
        // })       

       /* ...mapState({
            userData: state => state.users.areaId
        })       
       */

        // ...mapState({
        //     areaId: state => state.users.userInfo.areaId
        // })

        userData: function () {
           return this.$store.state.users.userInfo //   取vuex里面 state 状态值
        }

        // ...mapActions([
        //   'userInfo' //映射 this.userInfo() 到 this.$store.dispatch('userInfo')
        // ])
    },
    watch: {
      dialogVisible() {
          if(!this.dialogVisible) {
             this.saveDisabled = true;     
             this.$refs.zoneForm.resetFields();
          }else {
             this.saveDisabled = false;
          }
      },
      userData() {
          if(this.userData){
              this.areaId = this.userData.areaId;
              this.areaList();
          }
      }
    }
  }
</script>
<style>  
  .main {
    font-size: 14px;
  }  
  .btn-wrap-2 {
    margin: 0 20px 20px 30px;
    overflow: hidden;
  }
  .el-button.export {
    padding: 0 !important;
    margin-top: 5px;
  }
  .el-button a {
    color: #fff;
  }
  .btn-wrap-2 .el-button.el-button--primary {
    width: 100px;
    height: 30px;
    line-height: 30px;   
    background: #79a7ff;
    border: 1px solid #79a7ff;
  }   
 .el-textarea__inner {
    font-family: Arial !important;
}
  .zone-search {
    float: right;
    width: 300px;
  }
  .zone .el-select .el-input {  
    width: 150px;
  }
  .zone .el-input-group__append {  
    text-align: center;    
  }
  .zone .btn-wrap {
    margin-left: 30px;   
  }   
  .table-wrap {
    margin: 20px 30px;
  }
  .el-input__inner {
    font-size: 14px !important;
  }  

  .page-wrap {
    margin-top: 20px;
  }  
</style>

