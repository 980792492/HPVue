<template>
  <div class="topvlook">
    当前位置 : 
    <slot></slot>
  </div>
</template>
<script>  
  export default {
    name: 'nav',
    data () {
      return {
        
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .topvlook {
    font-size: 14px;
    color: #646464;   
    padding: 20px 30px;
    text-align: left;
    font-family: \5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
  }
</style>