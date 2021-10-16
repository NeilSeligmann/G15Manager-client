// const { createApp, reactive } = Vue
// import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';

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
	INFO: 0,
	UPDATE_CLIENT: 1
}

const THERMAL_ACTIONS = {
	SET_PROFILE: 0,
	ADDMODIFY_PROFILE: 1,
	MOVE_PROFILE: 2,
	REMOVE_PROFILE: 3,
	RESET_PROFILES: 4,
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
		const host = process.env.NODE_ENV === 'development' ? `127.0.0.1:34453` : location.host

		this.vue = Vue;
		this.options = {
			url: `ws://${host}/v1/websocket`,
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

		this.pendingAcks = new Map();

		this.state = this.vue.observable({
			// -1 -> Closed
			// 0 -> Connecting
			// 1 -> Connected
			// 2 -> Reconnecting
			status: -1,
			configInfo: {},
			temperatues: {
				gpu: null,
				cpu: null,
			}
		})
	}

	// ---------
	// Events
	// ---------

	onWebsocketOpen() {
		console.log('WS: On Open!')

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

		// console.log('onWebsocketMessage', message)

		if (message.data === 'alive') {
			// console.log('alive')
			return;
		}

		if (typeof message.data === 'string' && message.data.includes('ack ')) {
			const id = message.data.replace('ack ', '');
			const pendingAck = this.pendingAcks.get(id);
			if (!pendingAck) return;

			// Clear timeout
			clearTimeout(pendingAck.promise.timeout);
			// Resolve promise
			pendingAck.promise.resolve(true);

			return;
		}

		// console.log('WS: On Message!')
		// console.log(message)

		const parsed = JSON.parse(message.data);
		// console.log(parsed);

		if (!parsed || typeof parsed.action !== 'number') {
			console.error('Invalid response!')
			return;
		}

		switch (parsed.action) {
			case 0:
				this.state.configInfo = parsed.data
				break;

			case 1:
				this.state.temperatues = parsed.data
				break;

			default:
				console.warn(`Unhandled response of action ${parsed.action}`)
				break;
		}
	}

	onWebsocketAckTimeout(id) {
		const ack = this.pendingAcks.get(id);
		if (!ack) return;

		ack.promise.reject(new Error(`ACK response timed out! (ID: ${id})`));
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
		return new Promise((resolve, reject) => {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}

			const id = uuidv4();

			this.pendingAcks.set(id, {
				promise: { resolve, reject },
				timeout: setTimeout(() => { this.onWebsocketAckTimeout(id) }, 3000)
			})

			this.ws.send(JSON.stringify({
				id,
				category,
				action,
				value: String(value)
			}))
		})
	}

	// System
	updateClient() {
		return this.sendMessage({
			category: CATEGORIES.SYSTEM,
			action: SYSTEM_MESSAGES.UPDATE_CLIENT
		})
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

	async moveProfile(fromId, targetId) {
		// TODO: Move profile locally for a better user experience

		// Request server to move the profile
		await this.sendMessage({
			category: CATEGORIES.THERMAL,
			action: THERMAL_ACTIONS.MOVE_PROFILE,
			value: {
				fromId,
				targetId
			}
		})
	}

	async addModifyProfile(profileId, config) {
		await this.sendMessage({
			category: CATEGORIES.THERMAL,
			action: THERMAL_ACTIONS.ADDMODIFY_PROFILE,
			value: {
				profileId,
				...config
			}
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
