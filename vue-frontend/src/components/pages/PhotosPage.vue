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
            errorMessage: '',
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
        },
        async getPhotos() {
            this.photos = (await BackendHandler.listAllPhotos()).photos;
        },
        async rescanPhotos() {
            this.errorMessage = "Started rescan";
            var r = await BackendHandler.rescanAllPhotos();
            this.errorMessage = r.message;
            if ('err' in r) this.errorMessage = r.err;
            this.getPhotos();
        }
    },
    props:{
        currentPath: {
            type: String
        }
    },
    emits: ['updatePath'],
    async mounted() {
        await this.getPhotos()
    }
}
</script>

<style>
@import url('../../assets/style/page.css');
</style>