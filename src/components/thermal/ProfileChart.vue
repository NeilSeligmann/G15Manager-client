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

const chartSymbolSize = 20;
const MIN = 0;
const MAX_X = 110;
const MAX_Y = 100;

export default {
	name: 'ProfileChart',

	components: {
	},

	props: {
		value: {
			type: String,
			required: true
		}
	},

	data: () => ({
		chartData: [],
		isDragging: false
	}),

	computed: {
		chartSeries() {
			return {
				id: 'a',
				smooth: false,
				type: 'line',
				symbolSize: chartSymbolSize,
				data: this.chartData
			};
		},
		chartOptions() {
			return {
				// title: {
				// 	text: 'Traffic Sources',
				// 	left: 'center'
				// },
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
					// axisLine: { onZero: false }
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
					// axisLine: { onZero: false }
				},
				series: [
					this.chartSeries
				]
			}
		}
	},

	watch: {
		value() {
			this.updateDataFromModel();
		},
		isDragging() {
			console.log('isDragging changed:', this.isDragging)
			if (this.isDragging) return;
			this.refreshDraggablePoints();
		}
	},

	mounted() {
		Vue.nextTick(() => {
			this.refreshDraggablePoints();
			this.updateChart();
		})
	},

	updated() {
		// this.refreshDraggablePoints();
		// this.updateChart();
	},

	methods: {
		updateDataFromModel() {
			const splitted = this.value.split(',');
			if (!splitted || splitted.length < 1) return;

			let finalData = [];

			for (const item of splitted) {
				const xy = item.replace('c', '')
					.replace('%', '')
					.split(':');
				finalData.push([parseInt(xy[0], 10), parseInt(xy[1], 10)]);
			}

			this.chartData = finalData;

			if (!this.isDragging) {
				this.refreshDraggablePoints();
			}

			this.updateChart();
		},
		refreshDraggablePoints() {
			const superThis = this;

			this.chartOptions.graphic = this.chartData.map((item, dataIndex) => {
				return {
					type: 'circle',
					position: this.$refs.chart.convertToPixel('grid', item),
					shape: {
						cx: 0,
						cy: 0,
						r: (chartSymbolSize + 4) / 2
					},
					invisible: false,
					draggable: true,
					ondrag: function (dx, dy) {
						// Call event
						superThis.onPointDragging(dataIndex, [this.x, this.y], this);
					},
					onmousedown: function () {
						console.log('onmousedown!')
						superThis.isDragging = true;
					},
					onmouseup: function () {
						console.log('onmouseup!')
						superThis.isDragging = false;
					},
					z: 100
				};
			});
		},
		updateChart() {
			this.$refs.chart.setOption(this.chartOptions)
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
		}
	}
}
</script>

<style lang="scss" scoped>
	.chart {
		height: 400px;
	}
</style>
