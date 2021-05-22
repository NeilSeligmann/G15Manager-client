<template>
	<v-card elevation="4" @click="setProfile">
		<v-card-title class="pb-0">
			<span class="">{{ profile.name }}</span>
		</v-card-title>
		<v-card-text>
			<!-- Chips -->
			<div class="mb-4">
				<v-chip v-if="isActive" class="mr-2">
					<v-icon color="green">mdi-check</v-icon>
					Active
				</v-chip>
				<v-chip v-if="profile.fastSwitch">
					<v-icon color="green">mdi-keyboard-f5</v-icon>
					<span>Fast Switch</span>
				</v-chip>
			</div>
			<div>
				<b>Windows Power Plan:</b>
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
		index: {
			type: Number,
			required: true
		},
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
		setProfile() {
			return this.$client.setCurrentProfile(this.index)
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
