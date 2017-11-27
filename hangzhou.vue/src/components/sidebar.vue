 <template>
  <div class="sidebar">
    <ul>
      <!-- <li v-for="(item,index) in lists" :class="{active: item.iscur}" @click="setCur(index)"> -->
      <!-- <li v-for="(item,index) in lists" :class="{active:iscur==(index+1)}" @click="iscur=(index+1)"> -->
     <!--  <li v-for="(item,index) in lists" :class="{active:iscur==item.urlPath}" @click="iscur=$route.path"> -->
      <li v-for="(item,index) in lists">
        <router-link :to="{path: item.urlPath}" class="menu" v-if="item.showMenu == 1">
          <i :class="'m_icon'+(index+1)" class="m_icon-base"></i>{{item.txt}}
        </router-link>
      </li>

      <!-- <li class="active">
        <router-link to="/visitor" class="menu">
          <i class="m_icon1"></i>访客管理
        </router-link>
      </li>
      -->
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        // iscur: 1,
        showMenuTag: 0,
        lists: [
          //{"urlPath": "/visitor", "txt":"访客管理", "iscur": true},

          // {"urlPath": "/record", "txt":"记录查询", "showMenu": 1},
          // {"urlPath": "/warning", "txt":"预警信息", "showMenu": 1},
          // {"urlPath": "/dispatched", "txt":"布控点信息", "showMenu": 1},
          // {"urlPath": "/zone", "txt":"区域设置", "showMenu": 1},
          // {"urlPath": "/blacklist", "txt":"黑名单信息", "showMenu": 1}
        ]
      }
    },
    mounted() {      
      // this.sideBarList();          
    },
    methods: {
      // setCur: function(index) {
      //   this.iscur = index+1;
      //   // this.lists.map(function (v,i) {
      //   //     i==index? v.iscur=true : v.iscur=false;
      //   // });
      // }
      sideBarList() {

          this.isAdmin = this.userData.isAdmin;
          this.accountType = this.userData.accountType;

          // this.isAdmin = sessionStorage.getItem("isAdmin");
          // this.accountType = sessionStorage.getItem("accountType");         

          if(this.accountType==1) {
            //公安账户
            this.lists = [ 
                {"urlPath": "/record", "txt":"记录查询", "showMenu": 1},
                {"urlPath": "/warning", "txt":"预警信息", "showMenu": 1},
                {"urlPath": "/dispatched", "txt":"布控点信息", "showMenu": 1},
                {"urlPath": "/zone", "txt":"区域设置", "showMenu": 1},
                {"urlPath": "/blacklist", "txt":"黑名单信息", "showMenu": 1}
            ];
            //公安账户下的管理员
            if(this.isAdmin) {
              this.lists.push(                
                {"urlPath": "/account", "txt":"账号管理", "showMenu": this.isAdmin},
                {"urlPath": "/system", "txt":"系统配置", "showMenu": this.isAdmin}
              );
            }
          } else if(this.accountType==2) {
            //派出所账户
            this.lists = [ 
                {"urlPath": "/record", "txt":"记录查询", "showMenu": 1},
                {"urlPath": "/warning", "txt":"预警信息", "showMenu": 1},
                {"urlPath": "/dispatched", "txt":"布控点信息", "showMenu": 1},                   
                {"urlPath": "/blacklist", "txt":"黑名单信息", "showMenu": 1}
            ];
            //派出所账户下的管理员
            if(this.isAdmin) {
              this.lists.push(                
                {"urlPath": "/account", "txt":"账号管理", "showMenu": this.isAdmin}
              );
            }
          }              
      }
    },
    computed: {
      userData: function () {          
         return this.$store.state.users.userInfo   //获取vuex里面 state 状态值
      }
    },
    watch: {
      userData() {
          if(this.userData){
              this.sideBarList();
          }
      }      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sidebar {
    width: 200px;
    position: fixed;
    top: 100px;
    bottom: 0px;
    z-index: 102;
    overflow-x: hidden;
    background: #587ed1;    
  }
  .sidebar ul {
    width: 250px;
    overflow-y: scroll;
    height: 100%;
    text-align: left;
  }
  .sidebar ul li {
    display: block;
    text-decoration: none;
    font-size: 16px;
    overflow: hidden;
  }
  .menu.router-link-active {
    color: #fff;
    background: url("../assets/choose.png") no-repeat;
    background-position: 0 -12px;
  }

  .menu {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #d0e8f9;
    display: inline-block;
  }
  li.active .menu {
    color: #fff;
  }
  .menu:hover {
    color: #fff;
  }
  .m_icon-base{
    background: url("data:image/png;base64,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CAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwiMEQACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMIDAAAgMIDCAwAAIDCAwgMAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMIDIDAAAIDCAyAwAACAwgMgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAIDIDCAwAACAyAwgMAAAgMgMIDAAAgMIDCAwAAIDCAwgMAACAyw2XYZwbawO8nLkrw0ySlJ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") no-repeat
  }
  .menu i {
    width: 40px;
    height: 50px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    margin-left: 20px;
  }
  .m_icon1 {
    background-position: -152px -30px;
  }
  .menu:hover .m_icon1, .menu.router-link-active .m_icon1 {
    background-position: -82px -30px;
  }
  .m_icon2 {
    background-position: -152px -110px;
  }
  .menu:hover .m_icon2, .menu.router-link-active .m_icon2 {
    background-position: -82px -110px;
  }
  .m_icon3 {
    background-position: -152px -190px;
  }
  .menu:hover .m_icon3, .menu.router-link-active .m_icon3 {
    background-position: -82px -190px;
  }
  .m_icon4 {
    background-position: -152px -270px;
  }
  .menu:hover .m_icon4, .menu.router-link-active .m_icon4 {
    background-position: -82px -270px;
  }
  .m_icon5 {
    background-position: -152px -350px;
  }
  .menu:hover .m_icon5, .menu.router-link-active .m_icon5 {
    background-position: -82px -350px;
  }
  .m_icon6 {
    background-position: -152px -430px;
  }
  .menu:hover .m_icon6, .menu.router-link-active .m_icon6 {
    background-position: -82px -430px;
  } 
  .m_icon7 {
    background-position: -152px -510px;
  }
  .menu:hover .m_icon7, .menu.router-link-active .m_icon7 {
    background-position: -82px -510px;
  }  
</style>
