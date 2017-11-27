<template>
  <div class="main black">  
    <div class="btn-wrap-2">
        <el-button type="primary" class="export" @click="dialogShow('add')">新增</el-button> 
        <!-- <el-button type="primary" class="export"><a href="/static/智慧社区业主信息表.xlsx" target="_blank">导入</a></el-button> -->
        <div class="black-search">
          <el-input placeholder="请输入姓名" v-model="nameInput">           
            <el-button slot="append" icon="search" @click="searchName"></el-button>
          </el-input>
        </div>  
        <div class="filte-select">    
          <el-select v-model="filteType" placeholder="全部类型">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="公共黑名单" value="1"></el-option>
                <el-option label="自建黑名单" value="2"></el-option>
          </el-select>
          <el-select v-model="filteLevel" placeholder="全部等级">
                <el-option label="全部等级" value=""></el-option>
                <el-option label="一级" value="1"></el-option>
                <el-option label="二级" value="2"></el-option>
                <el-option label="三级" value="3"></el-option>              
          </el-select>
        </div>        
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
              <el-table-column
                inline-template
                width="140"
                label="姓名"
                >
                <div>
                  {{ row.name }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="180"
                label="身份证号码"
                >
                <div>
                  {{ row.identityNum }}
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                label="类型"
                >
                <div>
                  <div v-if = "row.type == 1 ">
                    公共黑名单
                  </div>
                  <div v-if = "row.type == 2 ">
                    自建黑名单
                  </div>
                </div>
              </el-table-column>
              <el-table-column
                inline-template               
                label="等级"
                >
                 <div>
                  <div v-if = "row.level == 1 ">
                    一级
                  </div>
                  <div v-if = "row.level == 2 ">
                    二级
                  </div>
                  <div v-if = "row.level == 3 ">
                    三级
                  </div>
                </div>
              </el-table-column>
              <el-table-column
                inline-template
                width="200"
                label="描述"
                >
             <div class="descri">
                 <el-tooltip placement="bottom" effect="light" visibleArrow="false" v-if="row.descp.length >= 10">
                    <div slot="content" class="tolsowlet" style="width:200px;">{{row.descp  }}</div>
                    <a>{{ row.descp  | dscirttoeasy}}</a>
                  </el-tooltip>
                  <a v-else>{{ row.descp}}</a>
              </div>
              </el-table-column>
              <el-table-column
                inline-template              
                label="照片"
                >
                <span v-if="row.pic==/files/">暂无</span>
                <el-button v-else @click="dialogPicShow(row.pic)" type="text" class="font-600">查看</el-button>
              </el-table-column>                        
              <el-table-column
                inline-template              
                width="100"
                label="操作">
                <div>
                  <el-button @click="dialogShow('edit',row.id)" type="text" class="font-600">编辑</el-button>
                  <el-button @click="delConfirm(row.id, row.faceId)" type="text" class="font-600">删除</el-button>
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
      <el-form :model="currentData" :rules="blackRules" ref="blackForm" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="currentData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="level">            
            <el-select v-model="currentData.level" placeholder="请选择等级">
              <el-option label="一级" value="1"></el-option>
              <el-option label="二级" value="2"></el-option>
              <el-option label="三级" value="3"></el-option>              
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号码" prop="identityNum">
            <el-input v-model="currentData.identityNum" placeholder="请输入身份证号"></el-input>
          </el-form-item>   
          <el-form-item label="照片" class="upload-item">
            <el-upload
              class="upload-demo"
              accept="image/jpg, image/jpeg, image/png"
              action="/blackListInfo/upload"
              :before-upload="beforeAvatarUpload"
              :on-error="handleError"
              :on-success="handleSuccess"  
              :data="setUploadData" 
              list-type="picture"           
              :file-list="fileListData">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div> -->
            </el-upload>            
          </el-form-item>
          <el-form-item label="描述" prop="descp">
            <el-input v-model="currentData.descp" placeholder="请输入描述" type="textarea"></el-input>
          </el-form-item>                 
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit" :disabled="saveDisabled">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
      </el-form> 
    </el-dialog>

    <el-dialog title="照片" v-model="dialogPicVisible" size="tiny">
        <img :src="currentData.pic"  class="black-pic" />
    </el-dialog>       
    

  </div>
</template>
<script>  
  export default {
    name: 'blacklist',   
    data () {
      /* 自定义校验规则start */
      var nameValidator = (rule, value, callback) => {       
          if (value.length > 10) {
             callback(new Error('请输入小于10位的姓名'));
          } 
          var pattern = /^[\u4e00-\u9fa5]*$/; 
          var pattern2 = /^[a-zA-Z]*$/;             
          if (!(pattern.test(value) || pattern2.test(value))) {
            callback(new Error('请输入汉字或字母格式的姓名'));
          } 
          return callback(); 
      };
      var identityNumValidator = (rule, value, callback) => { 
          if (!value) {
             callback(new Error('请输入身份证'));
          } 
          var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (!pattern.test(value)) {
             callback(new Error('请输入正确格式的身份证号码'));
          } 
          return callback(); 
      };      
      var levelValidator = (rule, value, callback) => {       
          if(!value){
            callback(new Error('请选择等级'));
          }         
          return callback(); 
      };  
      var descpValidator = (rule, value, callback) => { 
          if (value.length > 50) {
             callback(new Error('请输入小于50个字的描述'));
          }
          return callback(); 
      };     
      /* 自定义校验规则end */
      return {         
        nameInput: '',       
        filteType: '',
        filteLevel: '',
        tableData: [],
        currentData: {
          id: '',
          name: '',
          identityNum: '',
          level: '',
          descp: '',
          pic: '',
          faceId: ''  
        },
        blackRules: {
          name: [
            {validator: nameValidator, trigger: 'blur'}
          ],
          identityNum: [
            {validator: identityNumValidator, trigger: 'blur'}
          ],   
          level: [
            {validator: levelValidator, trigger: 'change'}
          ],           
          descp: [
            {validator: descpValidator, trigger: 'blur'}
          ]
        },
        showPageTag: false,
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 1,
        dailogTitle: '',
        dialogVisible: false,
        dialogPicVisible: false,
        saveDisabled: false,      
        fileListData: [
          // {
          //   name: 'food.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          //   status: 'finished'
          // }
        ],
        uploadUrl: '',
        setUploadData: {
          faceId: ''
        }
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
      // this.$parent.$data.tip = "黑名单信息";
      this.$store.commit('setTitle', '黑名单信息');
      this.blackList();
    },
    methods: {      
      blackList() {
          var parameterData = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                type: this.filteType,
                level: this.filteLevel,
                name: this.nameInput
              };
          this.$http.post('/blackListInfo/list', parameterData, {emulateJSON:true}).then(
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
        this.blackList();
      },
      dialogShow(handle, num) {
        this.handleTag = handle;
        if(this.handleTag == 'add') {
          this.dailogTitle = "新增黑名单";          
          this.currentData = {
            id: '',
            name: '',
            identityNum: '',
            level: '',
            descp: '',
            pic: '',
            faceId: ''  
          }          
          this.setUploadData.faceId = null;

        } else if(this.handleTag == 'edit') {
          this.dailogTitle = "编辑黑名单";
          this.getCurrentData(num);
        } 
        this.dialogVisible = true;
      },
      dialogPicShow(img) {
        this.dialogPicVisible = true;         
        this.currentData.pic = img;   
      },
      getCurrentData(num) {        
        this.$http.post('/blackListInfo/queryObject', {id: num}, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') { 
                    this.currentData = {
                        id: res.data.data.id,
                        name: res.data.data.name,
                        identityNum: res.data.data.identityNum,
                        level: res.data.data.level+'',
                        descp: res.data.data.descp,
                        pic: res.data.data.pic,
                        faceId: res.data.data.faceId   
                    } 
             
                    this.setUploadData.faceId = res.data.data.faceId || null;

                    if(res.data.data.faceId){
                      this.fileListData = [{
                        name: "老照片",
                        url: "/files/"+res.data.data.pic,
                        status: 'finished'
                      }];
                    }                      
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: '信息获取失败,请稍候再试', duration: 2000});
            }
        )  
      },
      handleSubmit() {
        this.$refs.blackForm.validate((valid) => {
              if (valid) { 
                  this.saveBlack();     
              } else {               
                  return false;
              }
        });
      },
      saveBlack(url) {
        var parameterData = {
            id: this.currentData.id,
            name: this.currentData.name,
            identityNum: this.currentData.identityNum,
            // type: this.currentData.type+'',
            level: this.currentData.level+'',
            descp: this.currentData.descp,
            pic: this.currentData.pic,
            faceId: this.currentData.faceId
        };       
        this.$http.post("/blackListInfo/createOrModify", parameterData, {emulateJSON:true}).then(
           (res) => {
              if(res.data.result == 'ok') { 
                  this.dialogVisible = false;     
                  this.blackList(); 
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: '信息保存失败,请稍候再试', duration: 2000});
            }
        ) 
      },
      searchName() {
        this.pageIndex = 1;      
        this.blackList();
      },
      delConfirm(id, faceId) {
        this.$confirm("此操作将删除该信息, 是否继续?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {         
          this.delData(id, faceId);        
        }).catch(() => {
          // vm.$message({type: 'info',message: '已取消删除'});          
        });
      },
      delData(id, faceId) {
        var parameterData = {
            faceId: faceId,
            id: id
        };
        this.$http.post('/blackListInfo/delete', parameterData, {emulateJSON:true}).then(               
           (res) => {
              if(res.data.result == 'ok') {                              
                  this.blackList();          
               } else {
                  this.$message({type: 'error', message: res.data.msg, duration: 2000});
               }                 
            }, (res) => {
               this.$message({type: 'error', message: '删除失败,请稍候再试', duration: 2000});
            }
        )    
      },      
      handleSuccess(response, file, fileList) {               
        if (response.rescode == '200') {   
            this.fileListData = fileList.slice(-1); 
            this.currentData.faceId = response.data.faceId;
            this.currentData.pic = response.data.pic;            
        } else {       
            //上传出错的情况下保留上一次文件 
            this.fileListData = this.fileListData.slice(0, 1);     
            if(response.rescode == '202'){
              this.$message({type: 'error', message: response.msg, duration: 2000});
            }else{
              this.$message({type: 'error', message: '图片上传失败,请重试', duration: 2000});
            }
        }       
      },
      //照片上传错误回调
      handleError(err, response, file) {   
        //上传出错的情况下保留上一次文件 
        this.fileListData = this.fileListData.slice(0, 1);      
        this.$message({type: 'error', message: '图片上传失败,请重试', duration: 2000});
      },      
      beforeAvatarUpload(file) {  
        const isLt2M = file.size / 1024 / 1024 < 1;  
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!'); 
          //上传出错的情况下保留上一次文件 
          this.fileListData = this.fileListData.slice(0, 1);         
        }
        return isLt2M;
      }
    },
    watch: {
      dialogVisible() {
          if(!this.dialogVisible) {   
             this.saveDisabled = true;         
             this.fileListData = [];            
             this.$refs.blackForm.resetFields();
          } else {
            this.saveDisabled = false;
          }
      },
      filteType() {
          this.pageIndex = 1;
          this.blackList();
      },
      filteLevel() {
          this.pageIndex = 1;
          this.blackList();
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
  .filte-select {
    float: right;
    margin-right: 20px;
  }
  .filte-select .el-select {
    margin-right: 10px;
  }
  .filte-select .el-select .el-input {  
    width: 150px;
  }
  .black-search {
    float: right;
    width: 300px;
  }
  .black .el-dialog .el-select .el-input {  
    width: 270px;
  }
  .black .el-input-group__append {  
    text-align: center;    
  }
  .black .btn-wrap {
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
  .el-form-item.upload-item {
    text-align: left;
  }
  .el-upload__tip {
    margin-top: 0 !important;
  }
  .el-upload-list__item-status-label {
    display: none;
  }
</style>

