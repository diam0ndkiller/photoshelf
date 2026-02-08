<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType, JoinedAlbumContentLink } from '@shared/databasetypes';
</script>

<template>
Viewing Album {{ albumInformation.name }} with id {{ albumInformation.id }}
</template>

<script lang="ts">
export default {
    data() {
        return {
            albumInformation: {} as AlbumType,
            albumContents: [] as JoinedAlbumContentLink[],
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        
    },
    props:{
        id: {
            type: Number,
            required: true,
        }
    },
    async mounted() {
        this.albumInformation = (await BackendHandler.getAlbumInformation(this.id)).album;
        this.albumContents = (await BackendHandler.getAlbumContents(this.id)).contents;
    },
    emits: []
}
</script>

<style>

</style>