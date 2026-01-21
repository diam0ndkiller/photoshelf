<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import Album from '../subcomponents/Album.vue';

const albums = (await BackendHandler.listAlbums()).albums;
</script>

<template>
    <v-main>
        <div class="page-content">
            <Album v-if="inAlbum" :id="albumId"/>
            <div v-else>
                <h1 style="display: inline;">All Albums</h1>
                <div style="display: inline-block; margin: 2%"><v-btn color="accent" prepend-icon='mdi-plus-circle-outline' text='New Album' @click="toggleAddAlbum()"/></div>
                <span style="color: rgb(var(--v-theme-accent))">{{ statusMessage }}</span>
                <span style="color: rgb(var(--v-theme-error))">{{ errorMessage }}</span>
                <ul>
                    <li v-for="album in albums">{{ album.name }}</li>
                </ul>
            </div>
        </div>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            statusMessage: "",
            errorMessage: "",
            showAddAlbumPopup: false,
        }
    },
    computed: {
        inAlbum(): boolean {
            if (this.currentPath.includes("/", 2)) return true;
            else return false;
        },
        albumId(): Number {
            if (this.inAlbum) {
                var pathElements = this.currentPath.split("/");
                return Number(pathElements[pathElements.length - 1]);
            } else return -1;
        }
    },
    watch: {
        
    },
    methods: {
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        },
        toggleAddAlbum() {
            this.showAddAlbumPopup = !this.showAddAlbumPopup;
        }
    },
    props: {
        currentPath: {
            type: String,
            required: true,
        }
    },
    emits: ['updatePath']
}
</script>

<style>
@import url('../../assets/style/page.css');
</style>