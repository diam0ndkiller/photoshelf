<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType } from '@shared/databasetypes';
</script>

<template>
Viewing Album {{ albumInformation.name }} with id {{ albumInformation.id }}
</template>

<script lang="ts">
export default {
    data() {
        return {
            albumInformation: {} as AlbumType
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
    },
    emits: []
}
</script>

<style>

</style>