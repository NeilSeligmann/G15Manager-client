import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import connector from './plugins/connector'

Vue.config.productionTip = false

Vue.use(connector);

// E-Charts
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import {
	CanvasRenderer
} from 'echarts/renderers'
import {
	LineChart
} from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent,
	GraphicComponent,
	MarkLineComponent
} from 'echarts/components'

use([
	CanvasRenderer,
	LineChart,
	GridComponent,
	TooltipComponent,
	GraphicComponent,
	MarkLineComponent
]);

Vue.component('v-chart', ECharts)

// Main Vue

new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app')
