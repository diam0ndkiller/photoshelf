<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';


</script>

<template>
<v-main>
    <div class="page-content">
        <v-card>
            <v-card-item>
                <h1>Database Settings</h1>
                <p>Edit contents of the configuration database.</p>
            </v-card-item>
            <v-card-item>
                <h2>Database Location</h2>
                <p>You should save the configuration database in a location you back up with your photos.</p>
                <v-form>
                    <v-text-field v-model="databaseLocation" disabled />
                    <v-btn prepend-icon="mdi-delete" text="Delete DB" color="red" @onclick="deleteDB()"/>
                </v-form>
            </v-card-item>
            <v-card-item>
                <h2>Photo locations</h2>
                <p>These directories will be scanned for photos to import into the database.</p>
                <v-list>
                    <v-list-item v-for="loc in photoLocations">
                        {{ loc.path }}
                        <v-btn icon="mdi-delete" color="red" @click="deleteLocation(loc.id)"/>
                    </v-list-item>
                </v-list>
                <nobr>
                    <v-text-field v-model="locationToAdd" label="Add a photo location path"/>
                    <v-btn prepend-icon="mdi-folder-multiple-plus" color="accent" @click="addPhotoLocation">Add</v-btn>
                </nobr>
            </v-card-item>
        </v-card>
    </div>
</v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            databaseLocation: "",
            errorMessage: "",
            photoLocations: [{id: 0, path: ""}],
            locationToAdd: "",
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        },
        async getDatabaseLocation() {
            var r = await BackendHandler.getDatabaseLocation();
            if ('err' in r) this.errorMessage = r.err;
            else this.databaseLocation = r.databaseLocation;
        },
        async deleteDB() {

        },
        async getPhotoLocations() {
            var r = await BackendHandler.getPhotoLocations();
            if ('err' in r) this.errorMessage = r.err;
            else this.photoLocations = r.photoLocations;
        },
        async addPhotoLocation() {
            var r = await BackendHandler.addPhotoLocation(this.locationToAdd);
            if ('err' in r) this.errorMessage = r.err;
            this.getPhotoLocations();
            this.locationToAdd = "";
        },
        async deleteLocation(id: number) {
            var r = await BackendHandler.deletePhotoLocation(id);
            if ('err' in r) this.errorMessage = r.err;
            this.getPhotoLocations();
        }
    },
    async mounted() {
        await this.getDatabaseLocation();
        await this.getPhotoLocations();
    },
    props:{
        currentPath: {
            type: String
        }
    },
    emits: ['updatePath']
}
</script>

<style>

</style>