<script setup lang="ts">
import AboutPhotoshelf from '../subcomponents/AboutPhotoshelf.vue';
</script>

<template>
<v-main>
    <div class="page-content">
        <AboutPhotoshelf/>
    </div>
</v-main>
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
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        }
    },
    props:{
        currentPath: {
            type: String
        }
    },
    emits: ['updatePath']
}
</script>

<style>

</style>