<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType, JoinedAlbumContentLink } from '@shared/databasetypes';
import Photo from './Photo.vue';
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

    <div class="box-wrapper">
        <div class="page-box" :style="`background-color: ${albumInformation.background_color};`">

        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            albumInformation: {} as AlbumType,
            albumContents: [] as JoinedAlbumContentLink[],
            page: 0,
            albumsList: [] as AlbumType[],
        }
    },
    computed: {
        paddedAlbumContents() {
            const result = [...this.albumContents]
            console.log(result);
            while (result.length < 4 || result.length % 4 != 0) {
                result.push({album_id: this.albumInformation.id,
                            type: 'spacer',
                            index: result.length,})
            }
            return result
        },
        albumsListWithoutSelf() {
            const result: Array<AlbumType> = [];
            this.albumsList.forEach(element => {
                if (element.id != this.albumInformation.id) result.push(element);
            });
            return result
        },
    },
    watch: {
        
    },
    methods: {
        async updateData() {
            this.albumInformation = (await BackendHandler.getAlbumInformation(this.id)).album;
            this.albumContents = (await BackendHandler.getAlbumContents(this.id)).contents;
            this.albumsList = (await BackendHandler.listAlbums()).albums;
        },
        getPages(contents: Array<JoinedAlbumContentLink>) {
            var res = [];

            for (let i = 0; i < contents.length; i += 4) {
                res.push(contents.slice(i, i + 4));
            }

            return res;
        },
    },
    props:{
        id: {
            type: Number,
            required: true,
        }
    },
    async mounted() {
        this.updateData();
    },
    emits: []
}
</script>

<style>
.box-wrapper {
  display: flex;
  height: 100%;
  justify-content: center; /* horizontal center */
  align-items: center;     /* vertical center */
}

.page-box {
  width: min(80vw, 80vh*(4/3));
  height: min(80vh, 80vw*(3/4));
}
</style>