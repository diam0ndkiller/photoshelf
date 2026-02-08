<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import Photo from '../subcomponents/Photo.vue';
import { Logger } from '@/utils/logger';
import type { Photo as PhotoType } from '@shared/databasetypes';
</script>

<template>
    <v-main>
        <div class="page-content">
            <div>
                <h1 style="display: inline;">All Photos</h1>
                <div style="display: inline-block; margin: 2%"><v-btn color="primary" prepend-icon='mdi-refresh' text='Scan for new photos' @click="scanNewPhotos()"/></div>
                <div style="display: inline-block; margin: 2%"><v-btn color="error-background" prepend-icon='mdi-refresh' text='Rescan all photos' @click="rescanPhotos()"/></div>
                <span style="color: rgb(var(--v-theme-accent))">{{ statusMessage }}</span>
                <span style="color: rgb(var(--v-theme-error))">{{ errorMessage }}</span>
            </div>

            <v-infinite-scroll>
                <template v-for="photoLocationGroup in photos3D(photos)">
                    <h2>{{ photoLocationGroup.location_path }}:</h2>
                    <template v-for="photoRow in photoLocationGroup.photos">
                        <div>
                            <Photo v-for="photo in photoRow" :photo="photo"
                                divHeight="25vh" divWidth="25%"
                                imgHeight="25vh"
                                :scaleHeight="250"
                                :albums="albums"
                            />
                        </div>
                    </template>   
                </template>             
            </v-infinite-scroll>
        </div>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            errorMessage: '',
            statusMessage: '',
            photos: [{id: 0, path: '', capture_date: '', location_id: 0, location_path: ''}],
            albums: [{id: -1, name: ''}],
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
        photos3D(photos: Array<PhotoType>) {
            var groupedByLocation = [];
            var currentLocationPath = '';
            var currentLocationIndex = -1;

            for (let i = 0; i < photos.length; i++) {
                if (photos[i].location_path == '') continue;

                if (photos[i].location_path != currentLocationPath) {
                    currentLocationIndex++;
                    currentLocationPath = photos[i].location_path;
                    groupedByLocation.push({location_path: currentLocationPath, photos: new Array<PhotoType>()});
                }
                groupedByLocation[currentLocationIndex].photos.push(photos[i]);
            }

            var splicedRes = [];

            for (let i = 0; i < groupedByLocation.length; i++) {
                splicedRes.push({location_path: groupedByLocation[i].location_path, photos: this.photos2D(groupedByLocation[i].photos)});
            }

            Logger.debug(splicedRes);

            return splicedRes;
        },
        photos2D(photos: Array<PhotoType>) {
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
</style>