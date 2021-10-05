<template>
	<div class="thermal-container">
		<div>
			<v-switch v-model="showFanCurves" label="Preview Fan Curves" />
		</div>
		<div class="profiles-container">
			<draggable :value="availableProfiles"
				@change="onMove"
				group="people">
				<Profile v-for="(profile, i) in availableProfiles"
					:key="i"
					:index="i"
					:profile="profile"
					:is-active="i === currentProfile"
					:show-fan-curves="showFanCurves"
					class="mb-2" />
			</draggable>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'

import Profile from './Profile';

export default {
	name: 'Thermal',

	components: {
		draggable,
		Profile
	},

	props: {
		thermal: {
			type: Object,
			required: true
		}
	},

	data: () => ({
		showFanCurves: true
	}),

	computed: {
		availableProfiles() {
			return this.thermal.profiles.available;
		},
		currentProfile() {
			return this.thermal.profiles.current;
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		async onMove(args) {
			if (!args || !args.moved) return;

			await this.$client.moveProfile(args.moved.oldIndex, args.moved.newIndex);
		}
	}
}
</script>

<style lang="scss" scoped>
	.thermal-container {
		padding: 0 1rem;
	}
</style>
