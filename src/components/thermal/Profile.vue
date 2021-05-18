<template>
	<v-card elevation="2">
		<v-card-title>
			<span class="mr-2">{{ profile.name }}</span>
			<v-icon v-if="isActive" color="green">mdi-check</v-icon>
		</v-card-title>
		<v-card-text>
			<div>
				<b>Power Plan:</b>
				{{ profile.windowsPowerPlan }}
			</div>
			<div>
				<b>Throttle Plan:</b>
				{{ profile.throttlePlan }}
			</div>
			<div>
				<b>CPU Fan Curve:</b>
				{{ profile.cpuFanCurve }}
			</div>
			<div>
				<b>GPU Fan Curve:</b>
				{{ profile.gpuFanCurve }}
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'Profiles',

	components: {
	},

	props: {
		profile: {
			type: Object,
			required: true
		},
		isActive: {
			type: Boolean,
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
	}
}
</script>

<style lang="scss" scoped>

</style>
