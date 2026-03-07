<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
import type { Album as AlbumType, JoinedAlbumContentLink } from '@shared/databasetypes';
import Photo from './Photo.vue';
import vuetify from '@/plugins/vuetify';
</script>

<template>
    <div class="page-heading">
        <h1>Album <b>{{ albumInformation.name }}</b></h1>

        <div class="flex-spacer"></div>

        <v-btn :disabled="page <= 0" icon="mdi-chevron-double-left" @click="page = 0"/>
        <v-btn :disabled="page <= 0" icon="mdi-chevron-left" @click="page--"/>
        {{ page + 1 }} / {{ totalPageNumber }}
        <v-btn :disabled="page+1 >= totalPageNumber" icon="mdi-chevron-right" @click="page++"/>
        <v-btn :disabled="page+1 >= totalPageNumber" icon="mdi-chevron-double-right" @click="page = totalPageNumber-1"/>

        <div class="flex-spacer"></div>

        <v-menu v-if="editMode" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-palette" v-bind="props" color="primary">Set Background Color</v-btn>
            </template>
            <v-color-picker mode="hex" v-model="albumInformation.background_color"/>
        </v-menu>

        <v-btn :icon="editMode ? 'mdi-content-save-edit' : 'mdi-pencil'" :title="editMode ? 'Save & Exit Edit Mode' : 'Enter Edit Mode'" @click="clickToggleEditModeButton"/>
        <v-btn icon="mdi-fullscreen" title="Toggle Fullscreen" @click="toggleFullscreen"/>
    </div>

    <div class="box-wrapper">
        <div class="page-box" :style="`background-color: ${albumInformation.background_color};`">
            <div class="double-page-grid">
                <div class="cell" v-for="contentItem in albumContentPages[page]">

                    <!-- DISPLAYING PHOTO -->
                    
                    <template v-if="contentItem.type == 'photo'">
                        <Photo divHeight="100%" divWidth="100%" :scaleHeight="500" :imgHeight="editMode ? 'min(30vh, 30vw*(3/4))' : 'min(34vh, 34vw*(3/4))'"
                                :photo="{id: contentItem.photo_id, path: contentItem.photo_path, capture_date: contentItem.photo_capture_date}"
                        />
                        <p v-if="!editMode" :style="styleOnSheet">{{ contentItem.title }}</p>
                    </template>



                    <!-- DISPLAYING HEADING -->

                    <template v-if="contentItem.type == 'heading'">
                        <h1 style="text-align: center" v-if="!editMode" :style="styleOnSheet">{{ contentItem.title }}</h1>
                    </template>



                    <!-- DISPLAYING EDIT OPTIONS -->
                    
                    <template v-if="editMode">
                        <v-card style="padding: 3px; display: flex; align-items: center; width: 100%; gap: 5px;">
                            
                            <!-- PHOTO EDIT OPTIONS -->
                            <template v-if="contentItem.type == 'photo'">
                                <v-text-field hide-details v-model="contentItem.title" density="compact" label="Add Comment" single-line/>
                            </template>
                            
                            <!-- HEADING EDIT OPTIONS -->
                            <template v-if="contentItem.type == 'heading'">
                                <v-text-field hide-details v-model="contentItem.title" label="Heading" single-line/>
                            </template>

                            <!-- SPACER EDIT OPTIONS -->
                            <template v-if="contentItem.type == 'spacer' || contentItem.type == 'last-item'">
                                <div class="flex-spacer"></div>
                                {{ contentItem.type == 'spacer' ? "(Spacer)" : "(End of Album)" }}
                                <div class="flex-spacer"></div>
                            </template>

                            <!-- GENERAL EDIT OPTIONS -->
                            <v-btn icon="mdi-arrow-expand-vertical" title="Insert Spacer" density="comfortable" color="accent-background" @click="insertSpacer(contentItem.index)"/>
                            <v-btn icon="mdi-format-header-pound" title="Insert Heading" density="comfortable" color="accent-background" @click="insertHeading(contentItem.index)"/>
                            <v-btn v-if="contentItem.type != 'last-item'" icon="mdi-delete" title="Delete Item" density="comfortable" color="error-background" @click="deleteContentItem(contentItem.index)"/>
                        
                        </v-card>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <v-dialog width="50%" v-model="showSaveConfirmation">
        <v-card>
            <v-card-item title="Do you want to save all changes?"/>
            <v-card-item>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <v-btn prepend-icon="mdi-content-save" text="Save" color="accent-background" @click="saveChanges"/>
                    <v-btn prepend-icon="mdi-delete" text="Discard" color="error-background" @click="discardChanges"/>
                    <v-btn prepend-icon="mdi-close-octagon" text="Cancel" color="primary" @click="showSaveConfirmation = !showSaveConfirmation"/>
                    <span style="color: rgb(var(--v-theme-error))">
                        {{ errorMessage }}
                    </span>
                </div>
            </v-card-item>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
export default {
    data() {
        return {
            albumInformation: {} as AlbumType,
            albumContents: [] as JoinedAlbumContentLink[],
            editMode: false,
            showSaveConfirmation: false,
            page: 0,
            albumsList: [] as AlbumType[],
            errorMessage: "",
        }
    },
    computed: {
        themeOnSheet() {
            return this.isLight(this.albumInformation.background_color) ? vuetify.theme.themes.value['light'] : vuetify.theme.themes.value['dark'];
        },
        styleOnSheet() {
            return `color: ${this.themeOnSheet.colors['on-background']};`
        },
        albumsListWithoutSelf() {
            const result: Array<AlbumType> = [];
            this.albumsList.forEach(element => {
                if (element.id != this.albumInformation.id) result.push(element);
            });
            return result
        },
        totalPageNumber() {
            if (this.slideshowMode) return this.albumContentsNoSpacers.length
            else return this.albumContentPages.length
        },
        albumContentPages() {
            return this.getPages(this.albumContents);
        }
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

            var newContents = contents.slice();

            newContents.push({
                album_id: this.albumInformation.id,
                type: 'last-item',
                index: contents.length,
            })

            for (let i = 0; i < newContents.length; i += 4) {
                res.push(newContents.slice(i, i + 4));
            }

            return res;
        },
        toggleFullscreen() {
            this.$emit("toggleFullscreen", true);
        },
        clickToggleEditModeButton() {
            if (this.editMode) {
                this.showSaveConfirmation = true;
            }
            else this.toggleEditMode();
        },
        toggleEditMode() {
            this.editMode = !this.editMode;
        },
        async saveChanges() {
            var saveInformationResult = await BackendHandler.saveAlbumInformation(this.albumInformation);
            if ('err' in saveInformationResult) {
                this.errorMessage = saveInformationResult.err.message;
                return
            }
            var saveContentsResult = await BackendHandler.saveAlbumContents(this.albumInformation.id, this.albumContents);
            if ('err' in saveContentsResult) {
                this.errorMessage = saveContentsResult.err.message;
                return
            }
            
            this.updateData();
            this.toggleEditMode();
            this.showSaveConfirmation = false;
        },
        discardChanges() {
            this.updateData();
            this.toggleEditMode();
            this.showSaveConfirmation = false;
        },
        isLight(hex: String) {
            hex = hex.replace('#', '')

            // Support short form (#fff)
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('')
            }

            const r = parseInt(hex.substr(0,2), 16)
            const g = parseInt(hex.substr(2,2), 16)
            const b = parseInt(hex.substr(4,2), 16)

            // Perceived brightness formula
            const brightness = 0.299*r + 0.587*g + 0.114*b

            return brightness > 130 // threshold for "light" vs "dark"
        },

        insertContentItem(index: number, item: JoinedAlbumContentLink) {
            this.albumContents.splice(index, 0, item);
            this.updateContentItemIndexes();
        },
        updateContentItemIndexes() {
            this.albumContents.forEach((el, i) => {
                el.index = i;
            });
        },
        insertHeading(index: number) {
            this.insertContentItem(index, {album_id: this.albumInformation.id, type: "heading", index, title: "New Heading"});
        },
        insertSpacer(index: number) {
            this.insertContentItem(index, {album_id: this.albumInformation.id, type: "spacer", index});
        },
        deleteContentItem(index: number) {
            this.albumContents.splice(index, 1);
            this.updateContentItemIndexes();
        },
        handleKey(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') { if (this.page > 0) this.page-- }
            else if (e.key === 'ArrowRight') { if (this.page + 1 < this.totalPageNumber) this.page++ }
            else if (e.key === 'Home') { this.page = 0 }
            else if (e.key === 'End') { this.page = this.totalPageNumber }
        }
    },
    props:{
        id: {
            type: Number,
            required: true,
        }
    },
    async mounted() {
        window.addEventListener('keydown', this.handleKey);
        this.updateData();
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKey);
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
  gap: 0;
  height: 100%;
  justify-items: center;
  align-items: center;
}

.cell {
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 16px;
}
</style>