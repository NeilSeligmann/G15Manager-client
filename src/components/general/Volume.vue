<template>
	<v-card elevation="4"
		outlined
		width="250px">
		<v-card-title>
			Volume
		</v-card-title>
		<v-card-text>
			<div class="mic-container mt-3">
				<div class="mic-display">
					<v-icon>{{ micIcon }}</v-icon>
					{{ isMicEnabled ? 'Active' : 'Muted' }}
				</div>
				<v-btn color="primary"
					@click="toggleMic">
					Toggle
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
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		toggleMic() {
			this.$client.toggleMic();
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
		}
	}
</style>
