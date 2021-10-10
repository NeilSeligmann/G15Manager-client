<template>
	<div class="settings-container">
		<Versions v-if="configInfo.versions" :config-info="configInfo" />
		<DenoiseAI v-if="configInfo.denoise" :config-info="configInfo" />
	</div>
</template>

<script>
import Versions from './Versions';
import DenoiseAI from './DenoiseAI';

export default {
	name: 'Settings',

	components: {
		Versions,
		DenoiseAI
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

</style>
