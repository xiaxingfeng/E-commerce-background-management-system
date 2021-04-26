import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
    //数据请求axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
    //element ui 插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
import './../node_modules/quill/dist/quill.snow.css'
import './../node_modules/quill/dist/quill.bubble.css'
import './../node_modules/quill/dist/quill.core.css'
// import './plugins/VueQuillEditor.js'
/* // 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = router.prototype.push
router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
} */
Vue.config.productionTip = false
    //树形表格
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')