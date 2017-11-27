<template>
  <div id="app">   
    <div v-if="$route.path !== '/login'">
        <div class="wrap">
          <tophead></tophead>
          <sidebar></sidebar>
          <div class="content">   
            <!-- <breadcrumb>{{tip}}</breadcrumb>  -->
            <breadcrumb>{{title}}</breadcrumb>    
            <router-view></router-view>
          </div>
        </div>
    </div>
    <div v-else>
        <router-view>
        </router-view>
    </div>
  </div>
</template>

<script>
  //不加入路由管理的组件
  const breadcrumb = resolve => {resolve(require("./components/breadcrumb"));}
  const tophead = resolve => {resolve(require("./components/tophead"));}
  const sidebar = resolve => {resolve(require("./components/sidebar"));}

  export default {
    name: 'app',
    data () {
      return {
          // tip:''
      } 
    }, 
    computed: {      
      title: function () {
        return this.$store.state.users.title
      }
    }, 
    components: {
      tophead,
      sidebar,
      breadcrumb
    }
  }
</script>

<style>  

</style>
