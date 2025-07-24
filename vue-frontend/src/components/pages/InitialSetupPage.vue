<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';
import AboutPhotoshelf from '../subcomponents/AboutPhotoshelf.vue';


</script>

<template>
    <v-main>
        <div class="page-content large-margin">
            <v-card>
                <v-form @submit.prevent="">
                    <v-card-item>
                        <h1>Welcome to photoshelf!</h1>
                        <p>
                            {{ message }}
                        </p>
                    </v-card-item>
                    <v-card-item>
                        <p>
                            Please enter the directory to store the main database file in.<br>
                            By default this is the working directory of the backend.<br>
                            If you want to back this up with your photos, use the folder your photos are located in.
                        </p>
                    </v-card-item>
                    <v-card-item>
                        <v-text-field v-model="databaseLocation" color="secondary" label="Directory on Server" type="text" />
                    </v-card-item>
                    <v-card-item>
                        <v-btn prepend-icon="mdi-floppy" color="primary" @click="saveDatabaseLocation">Save</v-btn>
                        <span style="margin-left: 5px;">{{ errorMessage }}</span>
                    </v-card-item>
                </v-form>
            </v-card>
            <div class="card-spacer"></div>
            <AboutPhotoshelf/>
        </div>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            databaseLocation: '',
            errorMessage: '',
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        updateModelValue(newVal: boolean) {
            this.$emit('update:modelValue', newVal);
        },
        async saveDatabaseLocation() {
            var r = await BackendHandler.saveDatabaseLocation(this.databaseLocation);
            if ('err' in r) this.errorMessage = r.err;
            else this.updateModelValue(false);
        },
        async getDefaultDatabaseLocation() {
            var r = await BackendHandler.getDefaultDatabaseLocation();
            if ('err' in r) this.errorMessage = r.err;
            else this.databaseLocation = r.databaseLocation;
        }
    },
    async mounted() {
        await this.getDefaultDatabaseLocation();
    },
    props:{
        modelValue: {
            type: Boolean,
            required: true,
        },
        message: {
            type: String,
            default: '',
        }
    },
    emits: ['update:modelValue']
}
</script>

<style>

</style>