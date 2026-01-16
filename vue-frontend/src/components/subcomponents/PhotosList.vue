<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';

const photos = (await BackendHandler.listAllPhotos()).photos;
</script>

<template>
    <div>
        <img
            v-for="photo in photos"
            :key="photo.id"
            loading="lazy"
            decoding="async"
            :src="BackendHandler.BASE_URL + '/photos/get-file?filename=' + photo.path"
            style="width: 33%"
        />
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            reload: 0,
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
        async deleteLocation(id: number) {
            var r = await BackendHandler.deletePhotoLocation(id);
            if ('err' in r) this.errorMessage = r.err;
            this.reload++;
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
@import url('../../assets/style/page.css');
</style>