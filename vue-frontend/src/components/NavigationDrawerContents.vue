<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';

const navigationDrawerItems = await navigationUtils.getNavigationDrawerItems()
</script>

<template>
    <v-list
            :items="navigationDrawerItems"
            @update:selected="onNavigationDrawerSelection"
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
        
    },
    methods: {
        onNavigationDrawerSelection(newVal: Array<string>) {
            this.$emit('navigation-drawer-selection', newVal);
        }
    },
    props:{
        
    },
    emits: ['navigation-drawer-selection']
}
</script>

<style>

</style>