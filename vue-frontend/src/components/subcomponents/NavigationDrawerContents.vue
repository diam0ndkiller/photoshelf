<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';

const navigationDrawerItems = await navigationUtils.getNavigationDrawerItems();
</script>

<template>
    <v-list
            :items="navigationDrawerItems"
            @update:selected="onNavigationDrawerSelection"
            :selected="selected"
    ></v-list>
</template>

<script lang="ts">
export default {
    data() {
        return {
            selected: ['/home'],
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        onNavigationDrawerSelection(newVal: Array<string>) {
            this.$emit('navigation-drawer-selection', newVal);
            if (newVal[0]) this.selected = newVal;
        }
    },
    props:{
        
    },
    emits: ['navigation-drawer-selection']
}
</script>

<style>

</style>