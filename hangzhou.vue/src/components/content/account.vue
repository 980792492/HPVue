<template>
  <div class="main acount">  
    <div class="btn-wrap-2">
        <el-button type="primary" class="export" @click="dialogShow('add')">新增</el-button>
        <div class="acount-search">
          <el-input placeholder="请输入姓名" v-model="nameInput">           
            <el-button slot="append" icon="search" @click="searchName"></el-button>
          </el-input>
        </div>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template
                width="140"
                label="手机号码"
                >
                <div>
                  {{ row.phone }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                label="姓名"
                >
                <div>
                  {{ row.name }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                label="类型"
                >            
                <div>
                  <div v-if = "row.isAdmin == 1 ">
                     管理员
                  </div>
                  <div v-if = "row.isAdmin == 0 ">

                      员工账号

                  </div>
               </div>
              </el-table-column>
              <el-table-column
                inline-template
                prop="detail"
                width="180"
                label="操作">
                <div>
                  <el-button @click="resetEvt(row.id)" type="text" class="font-600">重置密码</el-button>                  
                  <el-button @click="dialogShow('edit',row.id)" type="text" class="font-600">编辑</el-button>
                  <el-button @click="delConfirm(row.id)" type="text" class="font-600">删除</el-button>
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
      <el-form :model="currentData" :rules="accountRules" ref="acountForm" label-width="100px">
          <el-form-item label="账号类型" prop="isAdmin" >                      
            <el-select v-model="currentData.isAdmin" placeholder="请选择账号类型">
              <el-option label="员工账号" value="0"></el-option>
              <el-option label="管理员" value="1"></el-option>
            </el-select>          
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="currentData.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="currentData.name" placeholder="请输入姓名"></el-input>
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
      var phoneValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入手机号码'));
          }
          if (value.length != 11) {
             callback(new Error('请输入11位的手机号码'));
          } 
          var pattern = /^[0-9]*$/;              
          if (!pattern.test(value)) {
            callback(new Error('请输入数字格式的手机号码'));
          } 
          return callback(); 
      };  

      var nameValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入姓名'));
          }
          if (value.length > 10) {
             callback(new Error('请输入小于10位姓名'));
          }        
          return callback(); 
      };
      /* 自定义校验规则end */
      return {         
        nameInput: '',
        tableData:[],
        currentData: { isAdmin: '',
            phone:'',
            name: '',
            id:''},
        accountRules: {
          isAdmin: [
            {required: true, message: '请选择账号类型', trigger: 'change'}
          ],
          phone: [
            {validator: phoneValidator, trigger: 'blur'}
          ],
          name: [
            {validator: nameValidator, trigger: 'blur'}
          ]
        },
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 1,
        dailogTitle: '',
        dialogVisible: false,
        saveDisabled: false,
        employeeAccount: true,
        Administrator: true
      }
    },   
    created() {      
      // this.$parent.$data.tip = "账号管理";
      this.$store.commit('setTitle', '账号管理');
      this.accountList();

    },
    methods: {
      changeEvet(){
        this.$refs.acountForm.validateField('isAdmin', () => {
          });

      },
      accountList() {
         var parameterData = {   
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              name: this.nameInput
        }; 
        this.$http.post('/user/list', parameterData, {emulateJSON:true}).then(
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
              }) 
      },      
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.accountList();
      },
      dialogShow(handle, num) {          
        this.dialogVisible = true;
        this.handleTag = handle;
        if(handle == 'add') {
          this.dailogTitle = "新增区域";
        /*  this.currentData = {
            isAdmin: '',
            phone:'',
            name: '',
            id:''
          }*/

        } else if(handle == 'edit') {
          this.dailogTitle = "编辑用户";
          this.getCurrentData(num);
        }  
      },
      getCurrentData(num) {        
        this.$http.post('/user/queryObject', {id: num}, {emulateJSON:true}).then(
           (res) => {               
              if(res.data.result == 'ok') {   
                    this.currentData = {
                      isAdmin: res.data.data.isAdmin +'',
                      phone:res.data.data.phone,
                      name: res.data.data.name,
                      id:res.data.data.id
                    }
                    sessionStorage.setItem('currentId', this.currentData.id);
                } else {
                   this.$message({type: 'error', message: res.data.msg, duration: 2000});
                }                 
             }, (res) => {
                this.$message({type: 'error', message: '信息获取失败,请稍候再试', duration: 2000});
             }
         )  
      },
      handleSubmit(handle) {
        this.$refs.acountForm.validate((valid) => {
           var id = sessionStorage.getItem('currentId');
           if(valid){
                if(this.handleTag == 'edit'){
                          var parameterData = {         
                               name: this.currentData.name,
                               phone: this.currentData.phone,
                               isAdmin: this.currentData.isAdmin + '',
                               username:this.currentData.phone,
                               id:id
                             }
                           this.$http.post('/user/modify', parameterData, {emulateJSON:true}).then(              
                             (res) => {
                                if(res.data.result == 'ok') {                              
                                      this.dialogVisible = false;  
                                      this.accountList();                            
                                } else {
                                       this.$message({type: 'error', message: res.data.msg, duration: 2000});
                                    }                 
                              }, (res) => {
                                    this.$message({type: 'error', message: '信息保存失败,请稍候再试', duration: 2000});
                          }) 
                        
                  } else if (this.handleTag == 'add'){
                          var parameterData = {         
                               name: this.currentData.name,
                               phone: this.currentData.phone,
                               isAdmin: this.currentData.isAdmin + '',
                               username: this.currentData.phone
                             }
                        this.$http.post('/user/create', parameterData, {emulateJSON:true}).then(               
                           (res) => {
                              if(res.data.result == 'ok') {                              
                                    this.dialogVisible = false;  
                                    this.accountList();                            
                              } else {
                                     this.$message({type: 'error', message: res.data.msg, duration: 2000});
                                  }                 
                            }, (res) => {
                                  this.$message({type: 'error', message: '信息保存失败,请稍候再试', duration: 2000});
                        }) 
                      } 
                  }  else {               

                  return false;
              }
        });
      },
   
      searchName() {
        this.pageIndex = 1;      
        this.accountList();
      },
      delConfirm(id) {
        this.$confirm("此操作将删除该信息, 是否继续?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delData(id);        
        }).catch(() => {
           vm.$message({type: 'info',message: '已取消删除'});          
        });
      },
      //重置

      resetEvt(id) {
        var vm = this;       
        var txt = "是否重置此账号的密码为默认密码123456？";
        vm.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          vm.resetPassword(id);
        }).catch(() => {
           vm.$message({type: 'info',message: '已取消重置密码'});
        });
      },
      delData(id) {
         this.$http.post('/user/delete', {id: id}, {emulateJSON:true}).then(               
            (res) => {
               if(res.data.result == 'ok') {                              
                      this.accountList();            
                } else {
                   this.$message({type: 'error', message: res.data.msg, duration: 2000});
                }                 
             }, (res) => {
                this.$message({type: 'error', message: '删除失败,请稍候再试', duration: 2000});
             }
         )    
      },
      resetPassword(id) {
        var vm = this;
        /*var id = sessionStorage.getItem('currentId');
        console.log(id);*/
        var parameterData = {
            id: id
        };
        vm.$http.post("/user/resetPwd",parameterData, {emulateJSON:true}).then(
            (res) => {
                if(res.data.result=="ok") {
                   vm.$message({type: 'success',message: '重置密码成功!'});
                } else {
                  vm.$message({type: 'error', message: res.data.msg, duration: 2000});
                }
            }, (res) => {
               vm.$message({type: 'error', message: '请求失败,请稍候', duration: 2000});
            }
        );
      }
    },
    computed:{
       
      /*  accountType: function () {
         // alert(this.$store.state.users.userInfo.accountType);          
          return this.$store.state.users.userInfo.accountType   //获取vuex里面 state 状态值
        },
*/
        username: function () {
           return this.$store.state.users.userInfo.username //   取vuex里面 state 状态值
        }

      
    },
    watch: {
      dialogVisible() {
          if(!this.dialogVisible) { 
             this.saveDisabled = true;        
             this.$refs.acountForm.resetFields();
          } else {
             this.saveDisabled = false;
          }
      },
      userData() {
           if(this.userData){      
              this.id = this.userData.id;
              this.username=this.userData.userName;
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
  
  .acount-search {
    float: right;
    width: 300px;
  }
  .acount .el-select .el-input {  
    width: 270px;
  }
  .acount .el-input-group__append {  
    text-align: center;    
  }
  .acount .btn-wrap {
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

