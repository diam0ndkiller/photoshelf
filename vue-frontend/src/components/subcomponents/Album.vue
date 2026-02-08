<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType, JoinedAlbumContentLink } from '@shared/databasetypes';
</script>

<template>
    <div class="page-heading">
        <h1>Album <b>{{ albumInformation.name }}</b></h1>
        <div class="flex-spacer"></div>
        <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-palette" v-bind="props" color="primary">Set Background Color</v-btn>
            </template>
            <v-color-picker/>
        </v-menu>

    </div>
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