<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider style="width:300px;background:#1089ae;cursor:pointer" >
      <img class="logo" src="../assets/login.png">
      <div class="siderBarStyle" :class="`${currentModal == 'detect'?'active':''}`" @click="changeModal('detect')" >检测</div>
      <div class="siderBarStyle" :class="`${currentModal == 'divide'?'active':''}`"  @click="changeModal('divide')">分割</div>
      <div class="siderBarStyle" :class="`${currentModal == 'demo'?'active':''}`"  @click="changeModal('demo')">Demo</div>
      <div class="siderBarStyle" :class="`${currentModal == 'drawRectangle'?'active':''}`"  @click="changeModal('drawRectangle')">DrawRectangle</div>
      <div class="siderBarStyle" :class="`${currentModal == 'drawPolygon'?'active':''}`"  @click="changeModal('drawPolygon')">DrawPolygon</div>


    </a-layout-sider>
    <a-layout>
      <a-layout-content
      style="position:relative;"
        :style="{padding: '24px', background: '#f7f7f7'}"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      currentModal:'detect',
    };
  },
  mounted(){
    this.currentModal  = this.$route.name
  },
  computed:{
  },
  methods:{
    changeModal(current){
      this.currentModal  = current
      this.$router.push(current)
    }
  }
};
</script>
<style lang="scss" >
#components-layout-demo-custom-trigger{
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 40px;
  background: transparent;
  margin:30px  0px;
}
.siderBarStyle{
  background: #1089ae;
  color:#FFF;
  width: 100%;
  height: 50px;
  padding:0px 37px;
  font-size: 24px;
  line-height: 50px;
  margin: 20px 0px;
}
.active{
  background: #f7f7f7;
  color: #04495e;
}
.ant-layout-sider{
  background: #FFF;
}
.header-content{
  text-align: right;
  line-height: 80px;
  margin-right: 112px;
}
</style>