import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/reset.css'

// const tophead = resolve => {resolve(require("./components/tophead"));}
// const sidebar = resolve => {resolve(require("./components/sidebar"));}
// 全局组件,不加入路由管理
// Vue.component("tophead", tophead);
// Vue.component("sidebar", sidebar);

Vue.use(VueResource)
Vue.use(Vuex)
Vue.use(ElementUI)

//store以文件形式存在时不能够异步加载该文件
import userModule from "./store/modules/userModule"
import visitorModule from "./store/modules/visitorModule" 

const  vuex_store = new Vuex.Store({
    // state:{
    //     user_name: ""
    // },
    // mutations:{
    //     showUserName(state){
    //         alert(state.user_name);
    //     }
    // }   
    modules:{
        users: userModule,
        visitors: visitorModule
    }
})

new Vue({
  el: '#app',
  router,
  // template: '<App/>',
  // components: { App },
  render: h => h(App),
  store: vuex_store
})

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push((request, next) => {
    next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
      //服务器返回的错误
      if(!response.ok){
        // window.location.href="/"
        router.replace("login");
      }
      if(response.data.status=='401'){
         router.replace("login");
         // window.location.href="/"
      }
    });
});

Vue.filter('formatYmd', function(value, format) {
    var t = new Date(value);
    var format = 'yyyy-MM-dd HH:mm';
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    });
});
Vue.filter('dscirttoeasy', function(value) {
    if (value && value.length > 10){
       return value.substring(0, 10) + "...";
    } else {
        return value;
    }
});
