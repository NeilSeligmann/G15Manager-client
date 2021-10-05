<template>
	<div class="pl-4 pr-4">
		<h3>Keyboard Brightness</h3>
		<v-slider
			:value="keyboard.currentBrightness"
			:tick-labels="['Off', 'Low', 'Medium', 'High']"
			:max="3"
			:min="0"
			step="1"
			ticks="always"
			tick-size="4"
			@change="setLevel"
			@end="setLevel"
			@input="setLevel" />

		<v-divider class="mt-4 mb-4" />
		<h3>ROG Key</h3>
		<div class="subtitle-2">Pressing multiple times the ROG key will open the application in that slot.</div>
		<v-list>
			<draggable v-model="rogItems"
				group="people">
				<!-- ROG Items -->
				<v-list-item v-for="(item, i) in rogItems"
					:key="rogItems[i]"
					class="rog-item-container">
					<v-list-item-content>
						<v-list-item-title class="rog-item">
							<span class="rog-item-handle">
								<v-icon>mdi-drag-vertical</v-icon>
							</span>

							<span class="rog-item-counter">
								{{ i + 1 }}.
							</span>

							<v-text-field v-model="rogItems[i]" class="ml-2" />

							<v-btn
								icon
								color="red"
								@click="removeRogItem(i)">
								<v-icon>mdi-delete</v-icon>
							</v-btn>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</draggable>

			<!-- Add item -->
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="rog-item">
						<v-text-field v-model="newRogItem"
							class="mr-4"
							@keydown.enter="addRogItem"/>
						<v-btn color="primary" @click="addRogItem">
							<v-icon left>mdi-plus</v-icon>
							Add
						</v-btn>
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<!-- Save items -->
		<div class="rog-actions mb-4">
			<v-btn
				:disabled="!isRogDirty"
				color="primary"
				@click="saveRogItems">
				<v-icon left>mdi-content-save</v-icon>
				Save Bindings
			</v-btn>
		</div>

		<v-divider />
	</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
	name: 'Keyboard',

	components: {
		draggable,
	},

	props: {
		keyboard: {
			type: Object,
			required: true
		}
	},

	data: () => ({
		rogItems: [],
		newRogItem: null
	}),

	computed: {
		savedRogItems() {
			return this.keyboard.rogKey
		},
		isRogDirty() {
			return JSON.stringify(this.savedRogItems) !== JSON.stringify(this.rogItems)
		}
	},

	watch: {
		savedRogItems() {
			this.loadRogItems()
		}
	},

	mounted() {
		this.loadRogItems();
	},

	methods: {
		loadRogItems() {
			this.rogItems = JSON.parse(JSON.stringify(this.savedRogItems))
		},
		setLevel(newValue) {
			this.$client.setBrightness(newValue);
		},
		addRogItem() {
			this.rogItems.push(this.newRogItem);
			this.newRogItem = null;
		},
		removeRogItem(index) {
			this.rogItems.splice(index, 1);
		},
		saveRogItems() {
			this.$client.setRogKey(this.rogItems);
		}
	}
}
</script>

<style lang="scss" scoped>
	.rog-item {
		display: flex;
	}

	.rog-item-handle {
		justify-content: center;
		display: flex;
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;

		&:active {
			cursor: grabbing;
			cursor: -moz-grabbing;
			cursor: -webkit-grabbing;
		}
	}

	.rog-item-counter {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.rog-actions {
		display: flex;
		justify-content: center;
	}
</style>
