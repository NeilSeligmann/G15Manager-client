<template>
	<v-card elevation="4">
		<v-card-title class="pb-0">
			<span class="profile-name">{{ profile.name }}</span>
			<v-btn
				class="profile-edit-btn"
				:color="isEditing ? 'red' : 'primary'"
				@click.stop="isEditing = !isEditing">
				<v-icon left>{{ isEditing ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
				{{ isEditing ? 'Cancel' : 'Edit' }}
			</v-btn>
		</v-card-title>
		<!-- Editing -->
		<v-card-text v-if="isEditing">
			<v-row>
				<v-col>
					<!-- CPU Fan Curve -->
					<v-text-field label="CPU Fan Curve" v-model="pendingChanges.cpuFanCurve" />
					<ProfileChart v-model="pendingChanges.cpuFanCurve" />
				</v-col>
				<v-col>
					<!-- GPU Fan Curve -->
					<v-text-field label="GPU Fan Curve" v-model="pendingChanges.gpuFanCurve" />
					<ProfileChart v-model="pendingChanges.gpuFanCurve" />
				</v-col>
			</v-row>
		</v-card-text>
		<!-- Non-editing -->
		<v-card-text v-else>
			<!-- Chips -->
			<div class="mb-4">
				<v-chip>
					<v-icon :color="profile.fastSwitch ? `green` : `red`">mdi-keyboard-f5</v-icon>
					<span>{{ profile.fastSwitch ? `Fast Switch` : `Manual` }}</span>
				</v-chip>
				<v-chip v-if="isActive" class="ml-2">
					<v-icon color="green">mdi-check</v-icon>
					Active
				</v-chip>
			</div>
			<div>
				<b>Windows Power Plan:</b>
				{{ profile.windowsPowerPlan }}
			</div>
			<div>
				<b>Throttle Plan:</b>
				{{ profile.throttlePlan }}
			</div>
			<div>
				<b>CPU Fan Curve:</b>
				{{ profile.cpuFanCurve }}
			</div>
			<div>
				<b>GPU Fan Curve:</b>
				{{ profile.gpuFanCurve }}
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import ProfileChart from './ProfileChart.vue';

export default {
	name: 'Profiles',

	components: {
		ProfileChart
	},

	props: {
		index: {
			type: Number,
			required: true
		},
		profile: {
			type: Object,
			required: true
		},
		isActive: {
			type: Boolean,
			required: true
		}
	},

	data: function () {
		return {
			isEditing: false,
			pendingChanges: {
				name: 'NAME',
				fastSwitch: true,
				throttlePlans: 0,
				windowsPowerPlan: 0,
				cpuFanCurve: '',
				gpuFanCurve: '',
			}
		}
	},

	computed: {
	},

	watch: {
	},

	mounted() {
		this.loadEditorFromProfile();
	},

	methods: {
		loadEditorFromProfile() {
			this.pendingChanges = JSON.parse(JSON.stringify(this.profile));
		},
		setProfile(forced = false) {
			if (typeof forced !== 'boolean') forced = false;

			if (!forced && this.isEditing) return null;
			return this.$client.setCurrentProfile(this.index)
		},
		editProfile() {
			this.$emit('editProfile', this.index);
			this.isEditing = true;
		},
	}
}
</script>

<style lang="scss" scoped>
	.profile-edit-btn {
		margin-left: auto;
	}
</style>
