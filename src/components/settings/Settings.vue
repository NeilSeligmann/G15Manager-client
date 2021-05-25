<template>
	<div class="settings-container">
		<DenoiseAI v-if="configInfo.denoise" :config-info="configInfo" />
	</div>
</template>

<script>
import DenoiseAI from './DenoiseAI';

export default {
	name: 'Settings',

	components: {
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
