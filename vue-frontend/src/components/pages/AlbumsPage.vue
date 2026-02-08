<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import Album from '../subcomponents/Album.vue';
import type { Album as AlbumType } from '@shared/databasetypes';
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
                            {{ album.name }} <v-btn prepend-icon="mdi-delete" color="error" text="Delete album" @click="prepareDeleteAlbum(album)"/>
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
        <v-dialog width="50%" v-model="showDeleteAlbumPopup">
            <v-card>
                <v-card-item title="Delete Album">
                    Are you sure you want to delete the album <code>{{ albumToDelete.name }}</code>?
                </v-card-item>
                <v-card-item>
                    <span style="margin-right: 5px">
                        <v-btn prepend-icon="mdi-delete" text="Delete" color="error" @click="deleteAlbum(albumToDelete.id)"/>
                    </span>
                    <span style="margin-left: 5px">
                        <v-btn prepend-icon="mdi-close-octagon" text="Cancel" color="primary" @click="showDeleteAlbumPopup = !showDeleteAlbumPopup"/>
                    </span>
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
            showDeleteAlbumPopup: false,
            albumToDelete: {id: -1, name: ''},
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
        prepareDeleteAlbum(album: AlbumType) {
            this.showDeleteAlbumPopup = true;
            this.albumToDelete = album;
        },
        async deleteAlbum(id: Number) {
            this.clearMessages();
            var res = await BackendHandler.deleteAlbum(id);
            if ('err' in res) this.errorMessage = res.err.message;
            else {
                this.showDeleteAlbumPopup = false;
                await this.getAlbums();
                this.statusMessage = `Successfully deleted album #${id}`;
                this.albumToDelete = {id: -1, name: ''};
                this.updateNavigationDrawerItems();
            }
        },
        async createAlbum() {
            this.clearMessages();
            var res = this.newAlbumName == '' ? {err: 'No album name given.'} : await BackendHandler.createAlbum(this.newAlbumName);
            if ('err' in res) this.createErrorMessage = res.err.message;
            else {
                this.showAddAlbumPopup = false;
                await this.getAlbums();
                this.statusMessage = `Successfully created album ${this.newAlbumName}`
                this.newAlbumName = '';
                this.updateNavigationDrawerItems();
            }
        },
        async getAlbums() {
            this.albums = (await BackendHandler.listAlbums()).albums;
        },
        updateNavigationDrawerItems() {
            this.$emit('updateNavigationDrawerItems', true);
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
    emits: ['updatePath', 'updateNavigationDrawerItems'],
    async mounted() {
        this.getAlbums();
    }
}
</script>

<style>
@import url('../../assets/style/page.css');
</style>