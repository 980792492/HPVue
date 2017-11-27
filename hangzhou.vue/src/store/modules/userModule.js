import Vue from "vue";
import router from '../../router/index'

export default { 
    state: {
        loginForm: {
            username: '',
            password: ''
        },       
        userInfo: {
            id: '',
            userName: '',
            accountType: '',
            isAdmin: '',
            areaId: ''
        },
        psdForm: {
            oldpsd: '',
            newpsd: '',
            surepsd: ''
        },
        title:''
    },
    mutations: {
        setUserInfo(state, arg) {
            return state.userInfo = arg;
        },
        setTitle(state, arg) {
            return state.title = arg;
        }      
    }, 
    actions: {        
        login(context, parameterData) {
            // Vue.http.post('/login', parameterData, {emulateJSON:true}).then(                
            // (res) => {
            //   if(res.data.result == 'ok') { 
            //     router.replace("record");          
            //   } else {                
            //     this.$message({type:'error', message: res.data.msg, duration:2000});
            //   }                 
            // }, (res) => {
            //     this.$message({type:'error', "登录失败，请稍后再试", duration:2000});
            // });                
        },
        userInfo(context) {
            Vue.http.get('/userInfo', {emulateJSON:true}).then(                
                (res) => {
                  if(res.data.result == 'ok') {
                        context.commit('setUserInfo', {
                            id: res.data.data.id,
                            userName: res.data.data.name,
                            accountType: res.data.data.accountType,
                            isAdmin: res.data.data.isAdmin,
                            areaId: res.data.data.areaId
                        }); 

                        sessionStorage.setItem('id', res.data.data.id);
                        sessionStorage.setItem('name', res.data.data.name);
                        sessionStorage.setItem('accountType', res.data.data.accountType);
                        sessionStorage.setItem('isAdmin', res.data.data.isAdmin); 
                        sessionStorage.setItem('userName', res.data.data.username);
                        sessionStorage.setItem('areaId', res.data.data.areaId);   

                  } else {
                    router.replace("login");
                    // alert(res.data.msg);
                    // this.$message({type: 'error', message: res.data.msg, duration: 2000});
                  }               
                }, (res) => {
                  // alert(res.data.msg);
                }
            ) 
        },       
        logOut(context) {
            Vue.http.post('/logout', {}).then(
            (res) =>  {    
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('accountType');
                sessionStorage.removeItem('isAdmin');
                sessionStorage.removeItem('userName'); 
                sessionStorage.removeItem('areaId');         
                router.replace("login");
            }, (res) => {
              
            })
        }
    },
    getters: {
        getUserInfo: (state) => state.userInfo
    }  
} 