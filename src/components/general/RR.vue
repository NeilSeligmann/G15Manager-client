<template>
	<v-card elevation="4"
		outlined
		width="250px">
		<v-card-title>
			Refresh Rate
		</v-card-title>
		<v-card-text>
			<div class="rr-container mt-3 d-flex flex-column justify-center">
				<div class="rr-display">
					<v-icon>mdi-monitor</v-icon>
					{{ configInfo.rr.currentRefreshRate }}Hz
				</div>
				<v-btn color="primary"
					@click="cycleRefreshRate">
					<v-icon>mdi-refresh</v-icon>
					Switch
				</v-btn>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'RR',

	components: {
	},

	props: {
		configInfo: {
			type: Object,
			required: true
		}
	},

	data: () => ({
	}),

	computed: {
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		cycleRefreshRate() {
			this.$client.cycleRefreshRate();
		}
	}
}
</script>

<style lang="scss" scoped>
	.rr-container {
		display: flex;
		// flex-direction: row-reverse;

		.rr-display {
			display: flex;
			justify-content: center;
			align-items: center;

			i {
				margin-right: 0.5rem;
			}
		}

		button {
			margin-top: 0.5rem;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
