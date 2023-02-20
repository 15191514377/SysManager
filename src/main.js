import Vue from 'vue'
import App from './App.vue'
import less from 'less'
//引入element-ui
import ElementUI from 'element-ui';  
import 'element-ui/lib/theme-chalk/index.css';
// 挂载router
import router from './router/index'
// 挂载vuex实例
import store from './store/index'
//挂载axios
import axios from 'axios'
//为axios添加拦截器
import('@/util/axios')
import VueAxios from 'vue-axios';
// 设置用户权限
import('@/permission')


Vue.config.productionTip = false

Vue.use(less)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')