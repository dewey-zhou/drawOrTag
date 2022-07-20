import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/ant-design-vue.js'
import {Modal} from 'ant-design-vue'
import { message} from 'ant-design-vue'
import moment from 'moment';


Vue.prototype.$message = message;
Vue.config.productionTip = false
Vue.filter('timeFilter',function(val){
  return moment(val).format("YYYY.MM.DD")
})
Vue.use(Modal)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
