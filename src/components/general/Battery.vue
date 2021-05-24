<template>
	<v-card elevation="4"
		outlined
		width="250px">
		<v-card-title>
			Battery Limit
		</v-card-title>
		<v-card-text>
			<div>
				<v-icon>{{ batteryIcon }}</v-icon>
				{{ configInfo.battery.currentLimit }}%
			</div>
			<div>
				<v-slider
					v-model="desiredLimit"
					:min="20"
					:max="100"
					thumb-label
					@end="setLimit"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'Battery',

	components: {
	},

	props: {
		configInfo: {
			type: Object,
			required: true
		}
	},

	data: () => ({
		desiredLimit: 0
	}),

	computed: {
		currentLimit() {
			if (!this.configInfo.battery) return 0;
			return this.configInfo.battery.currentLimit;
		},
		batteryIcon() {
			const battery = this.configInfo.battery.currentLimit;

			if (battery < 26) {
				return 'mdi-battery-20';
			} else if (battery < 36) {
				return 'mdi-battery-30';
			} else if (battery < 46) {
				return 'mdi-battery-40';
			} else if (battery < 56) {
				return 'mdi-battery-50';
			} else if (battery < 66) {
				return 'mdi-battery-60';
			} else if (battery < 76) {
				return 'mdi-battery-70';
			} else if (battery < 86) {
				return 'mdi-battery-80';
			} else if (battery < 96) {
				return 'mdi-battery-90';
			}

			return 'mdi-battery';
		}
	},

	watch: {
		currentLimit() {
			this.reloadLimit();
		}
	},

	mounted() {
		this.reloadLimit();
	},

	methods: {
		reloadLimit() {
			this.desiredLimit = this.currentLimit;
		},
		setLimit() {
			this.$client.setBatteryLimit(this.desiredLimit)
		},
	}
}
</script>

<style lang="scss" scoped>

</style>
