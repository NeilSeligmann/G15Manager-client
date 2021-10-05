<template>
	<div class="chart-preview-container">
		<v-chart class="chart"
			ref="chart"
			:option="chartOptions"
			manual-update />
	</div>
</template>

<script>
import Vue from 'vue';
import thermalChartMixin from './thermalChart.mixin';

const MIN = 0;
const MAX_X = 110;
const MAX_Y = 100;

export default {
	name: 'ProfileChartPreview',

	mixins: [
		thermalChartMixin
	],

	components: {
	},

	props: {
	},

	data: () => ({
	}),

	computed: {
		chartOptions() {
			return {
				animation: false,
				xAxis: {
					min: MIN,
					max: MAX_X,
					type: 'value',
					axisLabel: {
						formatter: '{value}°c'
					}
				},
				yAxis: {
					min: MIN,
					max: MAX_Y,
					type: 'value',
				},
				series: [
					this.chartSeries
				],
				tooltip: {
					show: true,
					formatter: function (params) {
						return `Temp: ${params.data[0]}°c<br>Fan: ${params.data[1]}%`;
					}
				},
				grid: {
					top: '8%',
					bottom: '12%'
				},
			}
		},
		chartSymbolSize() {
			return 10;
		},
	},

	watch: {
	},

	mounted() {
		Vue.nextTick(() => {
			this.updateDataFromModel();
			this.updateChart();
		})
	},

	methods: {
	}
}
</script>

<style lang="scss" scoped>
	.chart {
		height: 200px;
		width: 100%;
	}
</style>
