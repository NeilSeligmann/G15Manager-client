export default {
	components: {
	},
	props: {
		value: {
			type: String,
			required: true
		},
		current: {
			type: Number,
			default: null
		}
	},
	data: () => ({
		chartData: [],
	}),
	computed: {
		chartSymbolSize() {
			return 20;
		},
		markLine() {
			if (!this.current) return null

			return {
				symbol: false,
				silent: true,
				label: {
					color: '#ff0000',
					distance: 2
				},
				data: [
					{
						name: 'Current Temperature',
						xAxis: this.current,
						lineStyle: {
							color: '#ff0000'
						}
					},
				]
			}
		},
		chartSeries() {
			return {
				id: 'a',
				smooth: false,
				type: 'line',
				symbolSize: this.chartSymbolSize,
				data: this.chartData,
				markLine: this.markLine
			};
		},
	},
	watch: {
		value() {
			this.updateDataFromModel();
		},
		current() {
			this.updateChart();
		}
	},
	mounted() {
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

			if (!this.isDragging && this.refreshDraggablePoints) {
				this.refreshDraggablePoints();
			}

			this.updateChart();
		},
		updateChart() {
			this.$refs.chart.setOption(this.chartOptions)
		},
	}
};
