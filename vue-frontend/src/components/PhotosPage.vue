<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';

const photos = (await BackendHandler.listAllPhotos()).photos;
</script>

<template>
    <v-main>
        <div class="page-content">
            <h1>{{ currentPath }}</h1>
            <img v-for="photo in photos" :src="BackendHandler.BASE_URL + '/photos/get-file?filename=' + photo.path" style="width: 50%"/>
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
        currentSubComponent() {
            return this.currentPath?.split("/")[2];
        }
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