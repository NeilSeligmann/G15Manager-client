import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import connector from './plugins/connector'

Vue.config.productionTip = false

Vue.use(connector);

new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app')
