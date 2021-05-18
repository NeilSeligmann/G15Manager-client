<template>
	<v-app>
		<v-main>
			<v-tabs v-model="tab" centered>
				<v-tabs-slider></v-tabs-slider>

				<v-tab href="#thermal">
					Thermal
					<v-icon>mdi-fan</v-icon>
				</v-tab>

				<v-tab href="#keyboard">
					Keyboard
					<v-icon>mdi-keyboard</v-icon>
				</v-tab>

				<!-- <v-tab href="#tab-3">
					Nearby
					<v-icon>mdi-account-box</v-icon>
				</v-tab> -->
			</v-tabs>

			<v-tabs-items v-model="tab">
				<v-tab-item value="thermal">
					<Thermal v-if="configInfo.thermal" :thermal="configInfo.thermal" />
				</v-tab-item>
				<v-tab-item value="keyboard">
					Keyboard Tab
				</v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-app>
</template>

<script>
import Thermal from './components/thermal/Thermal';

export default {
	name: 'App',

	components: {
		Thermal,
	},

	data: () => ({
		tab: 0
	}),

	computed: {
		connectorState() {
			return this.$client.state;
		},
		configInfo() {
			if (!this.connectorState) return null;
			return this.connectorState.configInfo;
		}
	}
};
</script>
