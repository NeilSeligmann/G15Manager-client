<template>
	<div class="chart-container" >
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
	name: 'ProfileChart',

	mixins: [
		thermalChartMixin
	],

	components: {
	},

	props: {
	},

	data: () => ({
		isDragging: false
	}),

	computed: {
		chartOptions() {
			return {
				animation: false,
				xAxis: {
					name: 'Temperature',
					nameLocation: 'center',
					min: MIN,
					max: MAX_X,
					type: 'value',
					nameTextStyle: {
						lineHeight: 45
					},
					axisLabel: {
						formatter: '{value}°c'
					}
				},
				yAxis: {
					name: 'Fan Speed',
					nameLocation: 'center',
					min: MIN,
					max: MAX_Y,
					type: 'value',
					nameTextStyle: {
						lineHeight: 60
					},
					axisLabel: {
						formatter: '{value}%'
					}
				},
				series: [
					this.chartSeries
				],
				tooltip: {
					triggerOn: 'none',
					formatter: function (params) {
						return `Temp: ${params.data[0]}°c<br>Fan: ${params.data[1]}%`;
					}
				},
			}
		}
	},

	watch: {
		isDragging() {
			if (this.isDragging) return;
			this.refreshDraggablePoints();
		}
	},

	mounted() {
		Vue.nextTick(() => {
			this.updateDataFromModel();
			this.refreshDraggablePoints();
			this.updateChart();
		})
	},

	methods: {
		refreshDraggablePoints() {
			const superThis = this;

			this.chartOptions.graphic = this.chartData.map((item, dataIndex) => {
				return {
					type: 'circle',
					position: this.$refs.chart.convertToPixel('grid', item),
					shape: {
						cx: 0,
						cy: 0,
						r: (superThis.chartSymbolSize + 5) / 2
					},
					invisible: true,
					draggable: true,
					ondrag: function (dx, dy) {
						// Call event
						superThis.onPointDragging(dataIndex, [this.x, this.y], this);
					},
					onmousedown: function () {
						superThis.isDragging = true;
					},
					onmouseup: function () {
						superThis.isDragging = false;
					},
					onmousemove: function () {
						superThis.showTooltip(dataIndex);
					},
					onmouseout: function () {
						superThis.hideTooltip(dataIndex);
					},
					z: 100
				};
			});
		},
		onPointDragging(dataIndex, pos, dragPoint) {
			const finalPos = this.$refs.chart.convertFromPixel('grid', pos);

			const limitValue = (val, MAX) => {
				if (val > MAX) val = MAX;
				if (val < MIN) val = MIN;
				return parseInt(Math.round(val), 10);
			}

			finalPos[0] = limitValue(finalPos[0], MAX_X);
			finalPos[1] = limitValue(finalPos[1], MAX_Y);

			Vue.set(this.chartData, dataIndex, finalPos);

			this.$refs.chart.setOption({
				series: [
					this.chartSeries
				]
			});

			this.updateVModel();
		},
		updateVModel() {
			let xyStrings = this.chartData.map(point => `${point[0]}c:${point[1]}%`);
			this.$emit('input', xyStrings.join(','));
		},
		showTooltip(dataIndex) {
			this.$refs.chart.dispatchAction({
				type: 'showTip',
				seriesIndex: 0,
				dataIndex
			});
		},
		hideTooltip(dataIndex) {
			this.$refs.chart.dispatchAction({
				type: 'hideTip'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
	.chart {
		height: 400px;
	}
</style>
