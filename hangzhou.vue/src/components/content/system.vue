 <template>
  <div class="system">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="system-tip">
        <el-tab-pane label="服务器检测" name="first">
          <div class="table-wrap-3">
              <el-table :data="tableData" style="width: 100%">
                      <el-table-column
                        inline-template                        
                        label="服务器名称"
                        >
                        <div>
                          {{ row.serverName }}
                        </div>
                      </el-table-column>
                      <el-table-column
                        inline-template
                        label="IP地址"
                        >
                        <div>
                          {{ row.ip }}
                        </div>
                      </el-table-column>
                      <el-table-column
                        inline-template
                        label="MAC地址"
                        >
                        <div>
                          {{ row.mac }}
                        </div>
                      </el-table-column>  
                      <el-table-column
                        inline-template
                        width="340"
                        label="磁盘空间（总空间/已用/剩余）GB"
                        >
                        <div>
                          {{ row.diskInfo }}
                        </div>
                      </el-table-column>
                      <el-table-column
                        inline-template
                        label="状态"
                        >
                        <!-- <div>
                          {{ row.serverStatus }}
                        </div> -->
                        <div>
                            <div v-if = "row.serverStatus == 1 ">
                               在线
                            </div>
                            <div v-if = "row.serverStatus == 0 ">
                              离线
                            </div>
                         </div>
                      </el-table-column>
                      <el-table-column
                        inline-template
                        prop="detail"
                        width="180"
                        label="操作">
                        <div> 
                          <el-button @click="dialogShow(row.id)" type="text" class="font-600">编辑</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="更新管理" name="second">
            <el-button type="primary" class="export" @click="add">新增</el-button>
          <div class="table-wrap-3">
              <el-table :data="tableData2" style="width: 100%">
                      <el-table-column
                        inline-template 
                        width="200"
                        label="时间">
                        <div>
                          {{ row.updateTime | formatYmd}}
                        </div>
                 
                      </el-table-column>
                      <el-table-column
                        inline-template
                        label="设备类型"
                        >
                       <div>
                           <div v-if = "row.type == 0 ">
                             访客机
                            </div>
                            <div v-if = "row.type == 1 ">
                              人脸闸机
                            </div>
                             <div v-if = "row.type == 2 ">
                             人脸门禁
                            </div>
                             <div v-if = "row.type == 3 ">
                            人证通
                            </div>
                         </div>         
                      </el-table-column>
                       <el-table-column
                        inline-template                       
                        label="应用名称"
                        >
                        <div>
                          {{row.versionUrl}}
                        </div>
                        
                      </el-table-column>                     
                      <el-table-column
                        inline-template                       
                        label="版本号"
                        >
                        <div>
                          {{row.version}}
                        </div>
                        
                      </el-table-column>
                      <el-table-column
                        inline-template
                        prop="detail"
                        width="180"
                        label="操作">
                        <div> 
                           <span v-if="row.status == 1" class="already-submit">已提交</span>
                           <el-button type="text"  class="font-600"  @click="appUpdate(row.id)" v-else>
                            提交
                           </el-button>
                          <el-button type="text" @click="delConfirm(row.id)" class="font-600">删除</el-button>
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

        </el-tab-pane>        
      </el-tabs>

      <el-dialog :title="dailogTitle" v-model="dialogVisible" size="tiny">
        <el-form :model="currentData" :rules="systemRules" ref="systemForm" label-width="100px">
            <el-form-item label="服务器名" prop="serverName">
              <el-input v-model="currentData.serverName" placeholder="请输入服务器名称"></el-input>
            </el-form-item>                 
            <div class="dialog-footer">
              <el-button type="primary" @click="handleSubmit" :disabled="saveDisabled">确定</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </el-form> 
      </el-dialog>
  <el-dialog :title="dailogUpdataTitle" v-model="dialoginfoVisible" size="tiny" class="blacklistdiag" >
      <el-form :model="form" :rules="ruleinfo" ref="form">
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="type" >
          <el-select v-model="form.type" class="changetencenter" >
            <el-option label="访客机" value="0"></el-option>
            <el-option label="人脸闸机" value="1"></el-option>
            <el-option label="人脸门禁" value="2"></el-option>
            <el-option label="人证通" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth" prop="version">
          <el-input v-model="form.version" auto-complete="off" class="input"></el-input>
        </el-form-item>
        <el-form-item label="更新包" :label-width="formLabelWidth" prop="versionUrl" class="upload-item">
          <el-upload           
            class="upload-demo"
            action="/appUpdate/upload"
            :before-upload="beforeAvatarUpload"
            :on-error="handleError"
            :on-success="handleSuccess"
            :file-list="fileListData"
            :default-file-list="form.versionUrl"
           >
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip" slot="tip">只能上传apk格式文件,且不能超过20M</div>
          </el-upload>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit2" :disabled="setupclick">确 定</el-button>
          <el-button @click="dialoginfoVisible = false">取 消</el-button>
        </div>
      </el-form>
    </el-dialog> 
  </div>
</template>
<script>
   import { mapState } from 'vuex'
   import { mapGetters } from 'vuex'
  export default {
    name: 'system',
    data () {
      /* 自定义校验规则start */
      var systemValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入服务器名称'));
          }
          if (value.length > 20) {
             callback(new Error('请输入小于20位的服务器名称'));
          } 
          // var pattern = /^\w+$/;    
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          if (pattern.test(value)) {
            callback(new Error('请输入字母数字或汉字格式的服务器名称'));
          } 
          return callback(); 
      };
      var ipValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入IP地址'));
          }       
          var pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; 
          if (!pattern.test(value)) {
            callback(new Error('请输入正确格式的IP地址'));
          } 
          return callback(); 
      };
      var portValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入端口'));
          }         
          var pattern = /^(\d)+$/;
          if (pattern.test(value)&&parseInt(value)<=65535&&parseInt(value)>=0) {
            callback(new Error('请输入正确格式的端口号'));
          } 
          return callback(); 
      };
      var accountValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入账号'));
          }
          if (value.length > 30) {
             callback(new Error('请输入小于30位的账号'));
          }            
          return callback(); 
      };
      var passwordValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入密码'));
          }
          if (value.length > 30) {
             callback(new Error('请输入小于30位的账号'));
          }          
          return callback(); 
      };
      var idValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请输入编号'));
          }
          if (value.length > 20) {
             callback(new Error('请输入小于20位的编号'));
          } 
          var pattern = /^[0-9a-zA-Z]*$/;  
          if (!pattern.test(value)) {
            callback(new Error('请输入字母或数字的编号'));
          } 
          return callback(); 
      };
      var typeValidator = (rule, value, callback) => {
        if (!value && this.dialoginfoVisible===true) {
          return callback(new Error('请选择设备类型'));
        }
        return callback();
      }
      var versionValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请填写版本号'));
        }
        var pattern =/^[0-9]\.[0-9]\.[0-9]{1,3}$/;
        if (!pattern.test(value)) {
            callback(new Error('请输入格式是x.x.xxx的版本号，例如1.0.0'));
          } 
        return callback();
      }

      /* 自定义校验规则end */
      return {
        activeName: 'first',
        tableData: [],
        tableData2: [],
        currentData: {
          serverName: '',
          id:''
        },
        form:{
          id:'',
          type:'',
          version:'',
          versionUrl:''
        },
        systemRules: {
          serverName: [
            {validator: systemValidator, trigger: 'blur'}
          ]
        },
        CMSRules: {
          ip: [
            {validator: ipValidator, trigger: 'blur'}
          ],
          port: [
            {validator: portValidator, trigger: 'blur'}
          ],
          account: [
            {validator: accountValidator, trigger: 'blur'}
          ],
          password: [
            {validator: passwordValidator, trigger: 'blur'}
          ],
          id: [
            {validator: idValidator, trigger: 'blur'}
          ]
        },
        ruleinfo: {
          type: [
            {validator: typeValidator, trigger: 'change'}
          ],
          version: [
            {validator: versionValidator, trigger: 'blur'}
          ]
        },//校验规则
        CMSData: {
          ip: '',
          port:　'',
          account: '',
          password: '',
          id: ''
        },
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 1,
        dailogTitle: '编辑名称',
        dailogUpdataTitle: '新增更新版本',
        dialogVisible: false,
        saveDisabled: false,
        editTag: false,
        dialoginfoVisible: false,
        setupclick:false,
        uploading:false,
        formLabelWidth: '80px',
        fileListData: []
      }
    },
    created() {      
      //this.$parent.$data.tip = "系统配置";
      this.$store.commit('setTitle', '系统配置');
      
    },
    mounted(){
      this.systemList();
      this.updateList();
    },
   methods: {
      handleClick(tab, event) {
        //this.$refs.CMSForm.resetFields();
      },
      systemList(){
          var parameterData = {   
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
          }; 
          this.$http.post('/serverInfo/list', parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') {                              
                  this.tableData = res.data.data.list;
                  // this.updataData = res.data.data.list;  
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
      updateList(){
          var parameterData = {   
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
          }; 
          this.$http.post('/appUpdate/list', parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') {                              
                  this.tableData2 = res.data.data.list;
                   // this.updateData = res.data.data.list;  
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
      add(){
        this.dialoginfoVisible = true;
          this.form = {
                type: '',
                version: '',
                versionUrl: ''
            }

      },
      dialogShow(id) {  
        this.dialogVisible = true; 
        this.currentData.id = id;

        this.$http.post('/serverInfo/queryObject', {id: id}, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') {   
                    this.currentData.serverName = res.data.data.serverName;
                } else {
                   this.$message({type: 'error', message: res.data.msg, duration: 2000});
                }                 
             }, (res) => {
                this.$message({type: 'error', message: '信息获取失败,请稍候再试', duration: 2000});
             }
         )  
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.systemList();
        this.updateList();
      },
      handleSubmit() {
        this.$refs.systemForm.validate((valid) => {           
              if (valid) {    
                   var parameterData = {         
                       serverName: this.currentData.serverName,
                       id: this.currentData.id
                   };     

                   this.$http.post('/serverInfo/createOrModify', parameterData, {emulateJSON:true}).then(               
                      (res) => {

                         if(res.data.result == 'ok') {                              
                            this.dialogVisible = false;
                            this.systemList();
                          } else {
                             this.$message({type: 'error', message: response.data.msg, duration: 2000});
                          }                 
                       }, (res) => {
                          this.$message({type: 'error', message: '请稍候再试', duration: 2000});
                       }
                   )    
              } else {               
                  return false;
              }
        });
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
     delData(id) {
         this.$http.post('/appUpdate/delete', {id: id}, {emulateJSON:true}).then(               
            (res) => {
               if(res.data.result == 'ok') {                              
                      this.updateList();            
                } else {
                   this.$message({type: 'error', message: res.data.msg, duration: 2000});
                }                 
             }, (res) => {
                this.$message({type: 'error', message: '删除失败,请稍候再试', duration: 2000});
             }
         )    
      },
      appUpdate(id){  
         this.$http.post('/appUpdate/update',{id:id}, {emulateJSON:true}).then(               
            (res) => {
               if(res.data.result == 'ok') { 
                   this.updateList();
                   this.$message({message: '提交成功', duration: 2000});
                } else {
                   this.$message({type: 'error', message: res.data.msg, duration: 2000});
                }                 
             }, (res) => {
                this.$message({type: 'error', message: '提交失败,请稍候再试', duration: 2000});
             }
         )    
      },

      handleSubmit2() {
        this.$refs.form.validate((valid) => {
              if (valid) { 
                  this.saveSystem(); 
              } else {               
                  return false;
              }
        });
      },
      saveSystem(url) {
        var parameterData = {
            type: this.form.type+'',
            version: this.form.version,
            versionUrl: this.form.versionUrl
        };
        this.$http.post("/appUpdate/create", parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') { 
                  this.dialoginfoVisible = false;     
                  this.updateList(); 
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: '信息保存失败,请稍候再试', duration: 2000});
            }
        ) 
      },

      handleSuccess(response, file, fileList) {               
        if (response.rescode == '200') {   
            this.fileListData = fileList.slice(-1);
           this.form.versionUrl = fileList[0].response.data; 
        } else { 
          if (fileList.length > 1) {
            fileList.splice(1, 1);
          } else {
            fileList.splice(0, 1);
          }         
          if(response.rescode == '202'){
              this.$message({type: 'error', message: response.msg, duration: 2000});
          } else {
              this.$message({type: 'error', message: '文件上传失败,请重试', duration: 2000});
            }
        }       
      },
       //文件上传错误回调
      handleError(err, response, file){      
        this.$message({type: 'error', message: '文件上传失败,请重试', duration: 2000});
      },      
      beforeAvatarUpload(file) {  
        const isLt2M = file.size / 1024 / 1024 < 20;  
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 20MB!'); 
          //上传出错的情况下保留上一次文件 
          this.fileListData = this.fileListData.slice(0, 1);         
        }
        return isLt2M;
    }
  },
 
    computed:{
        userData: function () {
           return this.$store.state.users.userInfo //   取vuex里面 state 状态值
        }
    },
    watch: {
      dialogVisible() {
          if(!this.dialogVisible) {         
            this.$refs.systemForm.resetFields();
            this.saveDisabled = true; 
          } else{
            this.saveDisabled = false; 
          }
      },
       dialoginfoVisible(){
        if(!this.dialoginfoVisible){
          this.fileListData=[];
          this.$refs.form.resetFields();
          this.setupclick = true;
        } else {
          this.setupclick = false;
        }
      },
      userData() {
          if(this.userData){       
              this.id = this.userData.id;
          }
      }      
    }
  }


</script>
<style>
  .system-tip {
    margin: 0 30px;
  }
  .el-tabs__item {   
    color: #8492a6;
    font-size: 16px !important;
    font-weight: 600;    
  }
  .el-tab-pane .el-button.el-button--primary {
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: #79a7ff;
    border: 1px solid #79a7ff;
  }
  .el-tabs__item:hover {
    color: #1f2d3d;
    cursor: pointer;
  }
  .el-tabs__item.is-active {
    color: #000 !important;
  }
  .table-wrap-3 {
    margin: 20px 0;
  }
  fieldset {
    margin: 10px auto 20px;
    padding-top: 20px;
    font-size: 16px;
    color: #5e6d82;
    border: 1px solid #e5e5e5;
    width: 530px;
  }
  .system .dialog-footer.cms-style {
    width: 530px;
    margin: 10px auto 20px;
    text-align: right;
  }
  .changetencenter{
    width:290px !important;
  }
  .disnoneset{
    text-align: left !important;
  }
  .already-submit {
    font-size: 12px;
    display: inline-block;
    margin-right: 10px;
  }
</style>


