<template>
	<v-app>
		<v-main v-if="isConnected">
			<v-tabs v-model="tab" centered>
				<v-tabs-slider></v-tabs-slider>

				<v-tab href="#general">
					Home
					<v-icon>mdi-home</v-icon>
				</v-tab>

				<v-tab href="#thermal">
					Thermal
					<v-icon>mdi-fan</v-icon>
				</v-tab>

				<v-tab href="#keyboard">
					Keyboard
					<v-icon>mdi-keyboard</v-icon>
				</v-tab>

				<v-tab href="#settings">
					Settings
					<v-icon>mdi-cog</v-icon>
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="tab">
				<v-tab-item value="general">
					<General v-if="configInfo"
						:config-info="configInfo"
						@goToTab="goToTab" />
				</v-tab-item>
				<v-tab-item value="thermal">
					<Thermal v-if="configInfo.thermal" :thermal="configInfo.thermal" />
				</v-tab-item>
				<v-tab-item value="keyboard">
					<Keyboard v-if="configInfo.keyboard" :keyboard="configInfo.keyboard" />
				</v-tab-item>
				<v-tab-item value="settings">
					<Settings v-if="configInfo" :config-info="configInfo" />
				</v-tab-item>
			</v-tabs-items>
		</v-main>
		<v-main v-else>
			Disconnected! <br />
			status: {{ this.connectorState.status }}
		</v-main>
	</v-app>
</template>

<script>
import '@mdi/font/scss/materialdesignicons.scss'

import General from './components/general/General';
import Thermal from './components/thermal/Thermal';
import Keyboard from './components/keyboard/Keyboard';
import Settings from './components/settings/Settings';

export default {
	name: 'App',

	components: {
		General,
		Thermal,
		Keyboard,
		Settings,
	},

	data: () => ({
		tab: 0
	}),

	watch: {
		tab() {
			window.location.hash = this.tab
		}
	},

	computed: {
		connectorState() {
			return this.$client.state;
		},
		configInfo() {
			if (!this.connectorState) return null;
			return this.connectorState.configInfo;
		},
		isConnected() {
			if (!this.connectorState) return false;
			return this.connectorState.status === 1;
		}
	},

	created() {
		this.goToCurrentHash();
	},

	methods: {
		goToCurrentHash() {
			const currentHash = window.location.hash.substr(1);
			if (!currentHash) return;

			this.tab = currentHash;
		},
		goToTab(value) {
			this.tab = value;
		}
	}
};
</script>
