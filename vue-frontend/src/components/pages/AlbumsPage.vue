<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import Album from '../subcomponents/Album.vue';
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
                    <template v-for="album in albums">
                        <li v-if="album.id != -1">
                            {{ album.name }} <v-btn prepend-icon="mdi-delete" color="error" text="Delete album" @click="deleteAlbum(album.id)"/>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <v-dialog width="50%" v-model="showAddAlbumPopup">
            <v-card>
                <v-card-item title="Create Album">
                    Create a new album to organize your photos.
                </v-card-item>
                <v-card-item>
                    <v-text-field autofocus label="Album Name" v-model="newAlbumName"/>
                    <v-btn @click="createAlbum()" prepend-icon="mdi-content-save-plus-outline" text="Create" color="accent"/>
                    <span style="color: rgb(var(--v-theme-error))">{{ createErrorMessage }}</span>
                </v-card-item>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            statusMessage: "",
            errorMessage: "",
            showAddAlbumPopup: false,
            newAlbumName: "",
            createErrorMessage: "",
            albums: [{id: -1, name: "Loading..."}],
        }
    },
    methods: {
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        },
        toggleAddAlbum() {
            this.showAddAlbumPopup = !this.showAddAlbumPopup;
        },
        clearMessages() {
            this.createErrorMessage = this.errorMessage = this.statusMessage = "";
        },
        async deleteAlbum(id: Number) {
            this.clearMessages();
            var res = await BackendHandler.deleteAlbum(id);
            if ('err' in res) this.errorMessage = res.err;
            else {
                await this.getAlbums();
                this.statusMessage = `Successfully deleted album #${id}`;
            }
        },
        async createAlbum() {
            this.clearMessages();
            var res = this.newAlbumName == '' ? {err: 'No album name given.'} : await BackendHandler.createAlbum(this.newAlbumName);
            if ('err' in res) this.createErrorMessage = res.err;
            else {
                this.showAddAlbumPopup = false;
                this.statusMessage = `Successfully created album ${this.newAlbumName}`
                this.getAlbums();
            }
        },
        async getAlbums() {
            this.albums = (await BackendHandler.listAlbums()).albums;
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