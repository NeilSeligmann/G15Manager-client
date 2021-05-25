// const { createApp, reactive } = Vue
import { reactive } from 'vue';

const CATEGORIES = {
	SYSTEM: 0,
	THERMAL: 1,
	KEYBOARD: 2,
	BATTERY: 3,
	RR: 4,
	VOLUME: 5,
	AIDENOISE: 6
}

const SYSTEM_MESSAGES = {
	info: 0
}

const THERMAL_ACTIONS = {
	SET_PROFILE: 0,
	ADDMODIFY_PROFILE: 1,
	REMOVE_PROFILE: 2,
	RESET_PROFILES: 3,
}

const KEYBOARD_ACTIONS = {
	BRIGHTNESS: 0,
	ROG_KEY: 1,
	TOGGLE_TOUCHPAD: 2,
}

const BATTERY_ACTIONS = {
	LIMIT: 0
}

const RR_ACTIONS = {
	CYCLE: 0
}

const VOLUME_ACTIONS = {
	TOGGLE_MIC: 0
}

const AIDENOISE_ACTIONS = {
	SET_STATE: 0,
	SET_PATH: 1,
	RESET_PATH: 2,
}

class ManagerClient {
	constructor(Vue, options) {
		this.vue = Vue;
		this.options = {
			url: `ws://127.0.0.1:8080/v1/websocket`,
			...options
		};

		this.ws = null;

		this.heartbeat = {
			interval: null,
			skipped: 0,
			maxSkipped: 3,
			delay: 1000
		};

		this.reconnect = {
			interval: null,
			shouldReconnect: true,
			delay: 10000
		}

		this.state = this.vue.observable({
			// -1 -> Closed
			// 0 -> Connecting
			// 1 -> Connected
			// 2 -> Reconnecting
			status: -1,
			configInfo: {}
		})
	}

	// ---------
	// Events
	// ---------

	onWebsocketOpen() {
		console.log('WS: On Open!')
		// this.ws.send('TEST!')

		if (this.reconnect.interval) {
			clearInterval(this.reconnect.interval);
			this.reconnect.interval = null;
		}

		this.clearHeartbeat();
		this.heartbeat.interval = setInterval(this.sendHeartbeat.bind(this), this.heartbeat.delay)
		this.state.status = 1;

		// Request Config Info
		// this.sendMessage({ action: 0 })
	}

	onWebsocketClose() {
		console.log('WS: On Close!')
		this.state.status = -1;

		if (this.reconnect.shouldReconnect) {
			this.setReconnectInterval();
		}
	}

	onWebsocketError(error) {
		console.log('WS: On Error!')
		console.error(error)
		this.clearHeartbeat();
	}

	onWebsocketMessage(message) {
		// Reset skipped hearbeats counter
		this.heartbeat.skipped = 0;

		if (message.data === 'alive') {
			console.log('alive')
			return;
		}

		console.log('WS: On Message!')
		console.log(message)

		const parsed = JSON.parse(message.data);
		console.log(parsed);

		if (!parsed || typeof parsed.action !== 'number') {
			console.error('Invalid response!')
			return;
		}

		switch (parsed.action) {
			case 0:
				this.state.configInfo = parsed.data
				break;

			default:
				console.warn(`Unhandled response of action ${parsed.action}`)
				break;
		}
	}

	// ---------
	// Methods
	// ---------

	connect() {
		this.terminate();
		this.state.status = 0;

		this.ws = new WebSocket(this.options.url);
		this.ws.onopen = this.onWebsocketOpen.bind(this);
		this.ws.onclose = this.onWebsocketClose.bind(this);
		this.ws.onerror = this.onWebsocketError.bind(this);
		this.ws.onmessage = this.onWebsocketMessage.bind(this);
	}

	terminate() {
		console.log('Terminate WS!')

		this.state.status = -1;
		// this.reconnect.shouldReconnect = !clean;

		// if (!clean) {
		this.setReconnectInterval();
		// }

		if (this.ws) this.ws.close();
		this.clearHeartbeat();
	}

	sendHeartbeat() {
		if (this.state.status !== 1) {
			this.clearHeartbeat();
			return;
		}

		if (this.heartbeat.skipped > 3) {
			this.terminate();
			return;
		}

		this.heartbeat.skipped++;
		this.ws.send('hb');
	}

	clearHeartbeat() {
		if (this.heartbeat.interval) clearInterval(this.heartbeat.delay);
		this.heartbeat.interval = null;
		this.heartbeat.skipped = 0;
	}

	setReconnectInterval() {
		if (this.reconnect.interval) {
			return;
		}

		this.reconnect.interval = setInterval(this.connect.bind(this), this.reconnect.delay)
	}

	sendMessage({ category = CATEGORIES.SYSTEM, action, value } = {}) {
		this.ws.send(JSON.stringify({
			category,
			action,
			value: String(value)
		}))
	}

	// Keyboard
	setBrightness(level) {
		if (typeof level !== 'number') throw new Error('"level" must be a number');

		// Parse and limit level
		level = parseInt(level, 10);
		if (level < 0) level = 0;
		else if (level > 3) level = 3;

		return this.sendMessage({
			category: CATEGORIES.KEYBOARD,
			action: KEYBOARD_ACTIONS.BRIGHTNESS,
			value: level
		})
	}

	setRogKey(items) {
		console.log('Set rog key!', items);
		if (Array.isArray(items)) items = items.join(',');
		else items = String(items);

		return this.sendMessage({
			category: CATEGORIES.KEYBOARD,
			action: KEYBOARD_ACTIONS.ROG_KEY,
			value: items
		})
	}

	toggleTouchpad() {
		return this.sendMessage({
			category: CATEGORIES.KEYBOARD,
			action: KEYBOARD_ACTIONS.TOGGLE_TOUCHPAD
		})
	}

	// Thermal
	setCurrentProfile(profileId) {
		return this.sendMessage({
			category: CATEGORIES.THERMAL,
			action: THERMAL_ACTIONS.SET_PROFILE,
			value: String(profileId)
		})
	}

	// Battery
	setBatteryLimit(limit) {
		limit = parseInt(limit, 10);

		if (limit < 20) limit = 20
		else if (limit > 100) limit = 100;

		return this.sendMessage({
			category: CATEGORIES.BATTERY,
			action: BATTERY_ACTIONS.LIMIT,
			value: limit
		})
	}

	// Screen
	cycleRefreshRate() {
		return this.sendMessage({
			category: CATEGORIES.RR,
			action: RR_ACTIONS.CYCLE
		})
	}

	// Volume
	toggleMic() {
		return this.sendMessage({
			category: CATEGORIES.VOLUME,
			action: VOLUME_ACTIONS.TOGGLE_MIC
		})
	}

	// Denoise
	setDenoiseState(state) {
		if (typeof state === 'undefined' || state === null) {
			state = ''
		} else {
			state = state ? '1' : '0'
		}

		return this.sendMessage({
			category: CATEGORIES.AIDENOISE,
			action: AIDENOISE_ACTIONS.SET_STATE,
			value: state
		})
	}

	setDenoisePath(newPath) {
		return this.sendMessage({
			category: CATEGORIES.AIDENOISE,
			action: AIDENOISE_ACTIONS.SET_PATH,
			value: newPath
		})
	}

	resetDenoisePath() {
		return this.sendMessage({
			category: CATEGORIES.AIDENOISE,
			action: AIDENOISE_ACTIONS.RESET_PATH
		})
	}
}

export default {
	install: (Vue, options) => {
		const client = new ManagerClient(Vue, options);
		Vue.prototype.$client = client;

		client.connect();
	}
}
