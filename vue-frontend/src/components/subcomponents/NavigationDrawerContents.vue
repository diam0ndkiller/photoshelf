<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';
</script>

<template>
    <v-list
            :items="navigationDrawerItems"
            @update:selected="onNavigationDrawerSelection"
            :selected="[selected]"
            mandatory
    ></v-list>
</template>

<script lang="ts">
export default {
    data() {
        return {
            navigationDrawerItems: [{}],
        }
    },
    computed: {
        
    },
    watch: {
        selected() {
            this.$emit('update:selected', this.selected);
        },
        async refreshKey() {
            await this.loadItems();
        }
    },
    methods: {
        onNavigationDrawerSelection(newVal: Array<string>) {
            this.$emit('update:selected', newVal[0]);
        },
        async loadItems() {
            this.navigationDrawerItems = await navigationUtils.getNavigationDrawerItems();
        }
    },
    props:{
        selected: {
            type: String,
            default: '/home',
        },
        refreshKey: {
            type: Number,
            required: true
        }
    },
    emits: ['update:selected'],
    async mounted() {
        await this.loadItems();
    }
}
</script>

<style>

</style>