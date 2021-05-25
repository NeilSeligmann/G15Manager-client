<template>
	<v-card class="denoise-container">
		<v-card-title>
			Denoise AI
		</v-card-title>
		<v-card-text>
			<div>
				<v-switch v-model="enabled"
					label="Enable Denoising AI"
					@change="setDenoiseState"/>
			</div>

			<div>
				Status: {{ isRunning ? `Running (PID: ${processPid})` : 'Not Running' }}
			</div>

			<div class="denoise-input-container mt-4">
				<v-text-field
					v-model="path"
					append-icon="mdi-refresh"
					label="AI Denoise Executable Path"
					@click:append="resetPath" />

				<v-btn color="primary"
					class="ml-4"
					@click="savePath">
					<v-icon left>
						mdi-floppy
					</v-icon>
					Save
				</v-btn>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'DenoiseAI',

	components: {
	},

	props: {
		configInfo: {
			type: Object,
			required: true
		}
	},

	data: () => ({
		path: null,
		enabled: false
	}),

	computed: {
		isEnabled() {
			return this.configInfo.denoise.isEnabled;
		},
		isRunning() {
			return this.configInfo.denoise.isRunning;
		},
		executablePath() {
			return this.configInfo.denoise.executablePath;
		},
		processPid() {
			return this.configInfo.denoise.pid;
		}
	},

	watch: {
		executablePath() {
			this.refreshConfig();
		},
		isEnabled() {
			this.refreshConfig();
		}
	},

	mounted() {
		this.refreshConfig();
	},

	methods: {
		refreshConfig() {
			this.enabled = this.isEnabled;
			this.path = this.executablePath;
		},
		savePath() {
			this.$client.setDenoisePath(this.path)
		},
		resetPath() {
			this.$client.resetDenoisePath()
		},
		setDenoiseState() {
			this.$client.setDenoiseState(this.enabled);
		}
	}
}
</script>

<style lang="scss" scoped>
	.denoise-input-container {
		display: flex;
	}
</style>
