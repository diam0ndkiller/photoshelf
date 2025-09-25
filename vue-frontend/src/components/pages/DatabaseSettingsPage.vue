<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';


</script>

<template>
<v-main>
    <div class="page-content">
        <v-card>
        </v-card>
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