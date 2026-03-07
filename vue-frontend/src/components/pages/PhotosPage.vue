<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import Photo from '../subcomponents/Photo.vue';
import { Logger } from '@/utils/logger';
import type { Album as AlbumType, JoinedPhotoLocationLink } from '@shared/databasetypes';
</script>

<template>
    <v-main>
        <div class="page-content">
            <div class="page-heading">
                <h1>All Photos</h1>
                <div class="flex-spacer"></div>
                <span style="color: rgb(var(--v-theme-accent))">{{ statusMessage }}</span>
                <span style="color: rgb(var(--v-theme-error))">{{ errorMessage }}</span>
                <div style="display: inline-block"><v-btn color="primary" prepend-icon='mdi-refresh' text='Scan for new photos' @click="scanNewPhotos()"/></div>
                <div style="display: inline-block"><v-btn color="error-background" prepend-icon='mdi-refresh' text='Rescan all photos' @click="rescanPhotos()"/></div>
            </div>
            <template v-for="photoLocationGroup in photos3D(photos)">
                <button class="link-btn" @click="locationsExpanded[photoLocationGroup.location_path] = !locationsExpanded[photoLocationGroup.location_path]">
                    <h2>
                        <v-icon v-if="locationsExpanded[photoLocationGroup.location_path]">mdi-chevron-down</v-icon>
                        <v-icon v-else>mdi-chevron-right</v-icon>
                        {{ photoLocationGroup.location_path }}:
                    </h2>
                </button>
                <template v-if="locationsExpanded[photoLocationGroup.location_path]" v-for="photoRow in photoLocationGroup.photos" :key="photoRow[0]?.id">
                    <div>
                        <Photo v-for="photo in photoRow" :photo="photo"
                            divHeight="25vh" divWidth="25%"
                            imgHeight="25vh"
                            :scaleHeight="250"
                            padding="5px"
                            :albums="albums"
                        />
                    </div>
                </template>   
            </template>
        </div>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            errorMessage: '',
            statusMessage: '',
            photos: [{}] as JoinedPhotoLocationLink[],
            albums: [{}] as AlbumType[],
            locationsExpanded: {} as {[key: string]: boolean}
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
        photos3D(photos: Array<JoinedPhotoLocationLink>) {
            var groupedByLocation = [];
            var currentLocationPath = '';
            var currentLocationIndex = -1;

            for (let i = 0; i < photos.length; i++) {
                if (photos[i].location_path == '') continue;

                if (photos[i].location_path != currentLocationPath) {
                    currentLocationIndex++;
                    currentLocationPath = photos[i].location_path;
                    groupedByLocation.push({location_path: currentLocationPath, photos: new Array<JoinedPhotoLocationLink>()});
                }
                groupedByLocation[currentLocationIndex].photos.push(photos[i]);
                if (!(photos[i].location_path in this.locationsExpanded)) this.locationsExpanded[photos[i].location_path] = false;
            }

            var splicedRes = [];

            for (let i = 0; i < groupedByLocation.length; i++) {
                splicedRes.push({location_path: groupedByLocation[i].location_path, photos: this.photos2D(groupedByLocation[i].photos)});
            }

            return splicedRes;
        },
        photos2D(photos: Array<JoinedPhotoLocationLink>) {
            var res = [];

            for (let i = 0; i < photos.length; i += 4) {
                res.push(photos.slice(i, i + 4));
            }

            return res;
        },
        async getPhotos() {
            this.photos = (await BackendHandler.listAllPhotos()).photos;
        },
        async getAlbums() {
            this.albums = (await BackendHandler.listAlbums()).albums;
        },
        async rescanPhotos() {
            this.statusMessage = "Rescanning files in all locations (this may take some time)...";
            this.errorMessage = "";
            var r = await BackendHandler.rescanAllPhotos();
            this.statusMessage = "";
            if ('err' in r) this.errorMessage = r.err.message;
            else this.statusMessage = r.message;
            this.getPhotos();
        },
        async scanNewPhotos() {
            this.statusMessage = "Scanning for new files in all locations (this may take some time)...";
            this.errorMessage = "";
            var r = await BackendHandler.scanNewPhotos();
            this.statusMessage = "";
            if ('err' in r) this.errorMessage = r.err;
            else this.statusMessage = r.message;
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
        await this.getPhotos();
        await this.getAlbums();
    }
}
</script>

<style>
@import url('../../assets/style/page.css');

.link-btn {
  all: unset;
  cursor: pointer;
  display: inline-block;
}
</style>