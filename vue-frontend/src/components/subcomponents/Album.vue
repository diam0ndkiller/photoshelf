<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';


</script>

<template>
Viewing Album {{ albumInformation.name }} with id {{ albumInformation.id }}
</template>

<script lang="ts">
export default {
    data() {
        return {
            albumInformation: {id: -1, name: "loading..."},
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