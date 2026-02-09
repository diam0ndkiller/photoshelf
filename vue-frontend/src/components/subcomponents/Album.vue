<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType, JoinedAlbumContentLink } from '@shared/databasetypes';
import Photo from './Photo.vue';
</script>

<template>
    <div class="page-heading">
        <h1>Album <b>{{ albumInformation.name }}</b></h1>
        <div class="flex-spacer"></div>
        <v-btn :disabled="page <= 0" icon="mdi-chevron-left" @click="page--"/>
        {{ page + 1 }} / {{ totalPageNumber }}
        <v-btn :disabled="page+1 >= totalPageNumber" icon="mdi-chevron-right" @click="page++"/>
        <div class="flex-spacer"></div>
        <v-menu v-if="editMode" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-palette" v-bind="props" color="primary">Set Background Color</v-btn>
            </template>
            <v-color-picker mode="hex" v-model="albumInformation.background_color"/>
        </v-menu>
        <v-btn icon="mdi-fullscreen" title="Toggle Fullscreen" @click="toggleFullscreen"/>
    </div>

    <div class="box-wrapper">
        <div class="page-box" :style="`background-color: ${albumInformation.background_color};`">
            <v-container class="double-page-grid">
                <div class="cell" v-for="contentItem in getPages(paddedAlbumContents)[page]">
                    <Photo v-if="contentItem.type == 'photo'" divHeight="100%" divWidth="100%" imgHeight="min(36vh, 36vw*(3/4))"
                            :photo="{id: contentItem.photo_id, path: contentItem.photo_path, capture_date: contentItem.photo_capture_date}"
                    />
                </div>
            </v-container>
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
        totalPageNumber() {
            return this.paddedAlbumContents.length / 4
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
        toggleFullscreen() {
            this.$emit("toggleFullscreen", true);
        }
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
    emits: ["toggleFullscreen"]
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

.double-page-grid {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  gap: 10px;
  height: 100%;
  justify-items: center;
  align-items: center;
}

.cell {
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  max-width: 100%;
}
</style>