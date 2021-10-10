<template>
	<v-list-item>
		<v-list-item-content>
			<v-list-item-title class="version-item">
				<v-row>
					<v-col style="max-width: 140px">
						<div class="version-title">{{name}} Version</div>
						<div class="version-display">
							<span>{{ data.currentVersion }}</span>
							<v-icon v-if="isUpdateAvailable"
								class="ml-1 mr-1"
								small
								color="green">
								mdi-arrow-right
							</v-icon>
							<span v-if="isUpdateAvailable" class="green--text">{{ data.latestVersion }}</span>
						</div>
					</v-col>
					<v-col>
						<div class="version-action">
							<v-btn v-if="isUpdateAvailable || btnText"
								color="primary"
								:href="isManual ? data.manualUrl : null"
								target="_blank"
								:loading="loading"
								@click="onClick">
								{{ btnText || 'Update!' }}
							</v-btn>
						</div>
					</v-col>
				</v-row>


			</v-list-item-title>
		</v-list-item-content>
	</v-list-item>
</template>

<script>
export default {
	name: 'VersionDisplay',

	components: {
	},

	props: {
		name: {
			type: String,
			required: true
		},
		data: {
			type: Object,
			required: true
		},
		loading: {
			type: Boolean,
			default: false
		},
		isManual: {
			type: Boolean,
			default: false
		},
		btnText: {
			type: String,
			default: null
		}
	},

	data: () => ({
	}),

	computed: {
		isUpdateAvailable() {
			return this.data.isUpdateAvailable
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onClick() {
			this.$emit('click')
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
