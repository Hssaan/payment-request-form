import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import 'jquery/dist/jquery.min'


Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')