<template>
	<v-card elevation="4">
		<v-card-title class="pb-0">
			<v-switch :input-value="isActive"
				:readonly="isActive"
				class="profile-switch"
				@click="setProfile" />

			<span class="profile-name">
				{{ profile.name }}
			</span>

			<!-- Top Right -->
			<v-btn
				v-if="isEditing"
				class="profile-save-btn"
				color="green"
				:loading="isSaving"
				@click.stop="saveProfile">
				<v-icon left>mdi-content-save</v-icon>
				Save
			</v-btn>

			<v-btn
				class="profile-edit-btn"
				:class="{ 'is-editing': isEditing }"
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
					<ProfileChart v-model="pendingChanges.cpuFanCurve" :current="temperatures.cpu" />
				</v-col>
				<v-col>
					<!-- GPU Fan Curve -->
					<v-text-field label="GPU Fan Curve" v-model="pendingChanges.gpuFanCurve" />
					<ProfileChart v-model="pendingChanges.gpuFanCurve" :current="temperatures.gpu" />
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

			<v-row>
				<v-col>
					<div>
						<b>Windows Power Plan:</b>
						{{ profile.windowsPowerPlan }}
					</div>
					<div>
						<b>Throttle Plan:</b>
						{{ profile.throttlePlan }}
					</div>
					<div v-if="!showFanCurves">
						<b>CPU Fan Curve:</b>
						{{ profile.cpuFanCurve }}
					</div>
					<div v-if="!showFanCurves">
						<b>GPU Fan Curve:</b>
						{{ profile.gpuFanCurve }}
					</div>
				</v-col>
			</v-row>
			<v-row v-if="showFanCurves">
				<!-- Preview Charts -->
				<v-col>
					<ProfileChartPreview :value="profile.cpuFanCurve" :current="temperatures.cpu" />
				</v-col>
				<v-col>
					<ProfileChartPreview :value="profile.gpuFanCurve" :current="temperatures.gpu" />
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import ProfileChart from './ProfileChart.vue';
import ProfileChartPreview from './ProfileChartPreview.vue';

export default {
	name: 'Profiles',

	components: {
		ProfileChart,
		ProfileChartPreview
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
		},
		showFanCurves: {
			type: Boolean,
			default: true
		}
	},

	data: function () {
		return {
			isEditing: false,
			isSaving: false,
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
		temperatures() {
			return this.$client.state.temperatures;
		}
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
			this.loadEditorFromProfile();
			this.$emit('editProfile', this.index);
			this.isEditing = true;
		},
		async saveProfile() {
			this.isSaving = true;
			await this.$client.addModifyProfile(this.index, this.pendingChanges);
			this.isSaving = false;
			this.isEditing = false;
		}
	}
}
</script>

<style lang="scss" scoped>
	.profile-switch {
		padding-top: 0;
		margin-top: 0;
		height: 23px;

		&::v-deep {
			.v-input__control {
				height: inherit;
			}
		}
	}

	.profile-name {
		min-width: 100px
	}

	.profile-save-btn {
		margin-left: auto;
		margin-right: 1rem;
	}

	.profile-edit-btn {
		margin-left: auto;

		&.is-editing {
			margin-left: 0;
		}
	}
</style>
