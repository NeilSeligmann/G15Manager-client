export default {
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
	}),
	computed: {
		chartSymbolSize() {
			return 20;
		},
		chartSeries() {
			return {
				id: 'a',
				smooth: false,
				type: 'line',
				symbolSize: this.chartSymbolSize,
				data: this.chartData
			};
		},
	},
	watch: {
		value() {
			this.updateDataFromModel();
		},
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
