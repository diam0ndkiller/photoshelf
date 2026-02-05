<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';

const navigationDrawerItems = await navigationUtils.getNavigationDrawerItems();
</script>

<template>
    <v-list
            :items="navigationDrawerItems"
            @update:selected="onNavigationDrawerSelection"
            :selected="[selected]"
    ></v-list>
</template>

<script lang="ts">
export default {
    data() {
        return {
        }
    },
    computed: {
        
    },
    watch: {
        selected() {
            this.$emit('update:selected', this.selected);
        }
    },
    methods: {
        onNavigationDrawerSelection(newVal: Array<string>) {
            this.$emit('update:selected', newVal[0]);
        }
    },
    props:{
        selected: {
            type: String,
            default: '/home',
        }
    },
    emits: ['update:selected']
}
</script>

<style>

</style>