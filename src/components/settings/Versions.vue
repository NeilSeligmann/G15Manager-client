<template>
	<v-card class="denoise-container">
		<v-card-title>
			Versions
		</v-card-title>
		<v-card-text>
			<!-- Client Version -->
			<VersionDisplay name="Client"
				:data="versionData.client"
				:loading="isLoadingClient"
				@click="updateClient" />

			<!-- Manager/Server Version -->
			<VersionDisplay name="Server" :data="versionData.server" />

		</v-card-text>
	</v-card>
</template>

<script>
import VersionDisplay from './VersionDisplay'

export default {
	name: 'Versions',

	components: {
		VersionDisplay
	},

	props: {
		configInfo: {
			type: Object,
			required: true
		}
	},

	data: () => ({
		isLoadingClient: false
	}),

	computed: {
		versionData() {
			return this.configInfo.versions;
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		async updateClient() {
			if (this.isLoadingClient) {
				return;
			}

			this.isLoadingClient = true;
			await this.$client.updateClient();
			this.isLoadingClient = false;
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
