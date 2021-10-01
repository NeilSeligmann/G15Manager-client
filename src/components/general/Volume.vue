<template>
	<v-card elevation="4"
		outlined
		width="250px">
		<v-card-title>
			Microphone
		</v-card-title>
		<v-card-text>
			<div class="mic-container mt-3">
				<div class="mic-display" :class="[ `${micColor}--text` ]">
					<v-icon :color="micColor">{{ micIcon }}</v-icon>
					{{ isMicEnabled ? 'Active' : 'Muted' }}
				</div>
				<v-btn color="red"
					:outlined="!isMicEnabled"
					width="100px"
					@click="toggleMic">
					{{ isMicEnabled ? 'Mute' : 'Unmute' }}
				</v-btn>
			</div>
			<div style="justify-content: center;display: flex;">
				<v-btn class="mt-2"
					small
					text
					@click="goToTab('settings')">
					Denoise AI
					<v-icon x-small>mdi-arrow-right</v-icon>
				</v-btn>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'Volume',

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
		isMicEnabled() {
			return this.configInfo.volume.isMuted;
		},
		micIcon() {
			return `mdi-microphone${this.isMicEnabled ? '' : '-off'}`
		},
		micColor() {
			if (this.isMicEnabled) return 'primary';
			return 'red';
		},
		isDenoiseEnabled() {
			return this.configInfo.denoise.isEnabled;
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		toggleMic() {
			this.$client.toggleMic();
		},
		// toggleDenoise() {
		// 	this.$client.setDenoiseState();
		// },
		goToTab(value) {
			this.$emit('goToTab', value)
		}
	}
}
</script>

<style lang="scss" scoped>
	.mic-container {
		display: flex;
		// flex-direction: row-reverse;

		.mic-display {
			display: flex;
			justify-content: center;
			align-items: center;

			i {
				margin-right: 0.5rem;
			}
		}

		button {
			margin-left: auto;
			// margin-right: auto;
		}
	}
</style>
