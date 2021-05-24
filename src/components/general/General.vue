<template>
	<div class="general-container">
		<!-- Battery -->
		<Battery v-if="configInfo.battery"
			:config-info="configInfo"
			class="ml-3 mr-3" />

		<!-- Refresh Rate -->
		<RR v-if="configInfo.rr"
			:config-info="configInfo"
			class="ml-3 mr-3" />

		<!-- Refresh Rate -->
		<Volume v-if="configInfo.volume"
			:config-info="configInfo"
			class="ml-3 mr-3" />
	</div>
</template>

<script>
import Battery from './Battery';
import RR from './RR';
import Volume from './Volume';

export default {
	name: 'General',

	components: {
		Battery,
		RR,
		Volume
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
	}
}
</script>

<style lang="scss" scoped>
	.general-container {
		display: flex;
		padding: 1rem;
		justify-content: center;
	}
</style>
