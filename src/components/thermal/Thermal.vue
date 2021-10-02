<template>
	<div class="thermal-container">
		<div class="profiles-container">
			<Profile v-for="(profile, i) in availableProfiles"
				:key="i"
				:index="i"
				:profile="profile"
				:is-active="i === currentProfile"
				class="mb-2" />
		</div>
	</div>
</template>

<script>
import Profile from './Profile';

export default {
	name: 'Thermal',

	components: {
		Profile
	},

	props: {
		thermal: {
			type: Object,
			required: true
		}
	},

	data: () => ({
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
	}
}
</script>

<style lang="scss" scoped>
	.thermal-container {
		padding: 0 1rem;
	}
</style>
