<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';
import Photo from '../subcomponents/Photo.vue';

</script>

<template>
    <v-main>
        <div class="page-content">
            <div>
                <h1 style="display: inline;">All Photos</h1>
                <div style="display: inline-block; margin: 2%"><v-btn color="accent" prepend-icon='mdi-refresh' text='Rescan all locations' @click="rescanPhotos()"/></div>
                <span style="color: red">{{ errorMessage }}</span>
            </div>

            <v-infinite-scroll>
                <template v-for="photoRow in photos2D">
                    <div>
                        <Photo v-for="photo in photoRow" :photo="photo"
                            divHeight="25vh" divWidth="25%"
                            imgHeight="25vh"
                            :scaleHeight="250"
                        />
                    </div>
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
            photos: [{id: 0, path: '', capture_date: ''}]
        }
    },
    computed: {
        currentSubComponent() {
            return this.currentPath?.split("/")[2];
        },
        photos2D() {
            var res = [];

            for (let i = 0; i < this.photos.length; i += 4) {
                res.push(this.photos.slice(i, i + 4));
            }

            return res;
        }
    },
    watch: {
        
    },
    methods: {
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        },
        async getPhotos() {
            this.photos = (await BackendHandler.listAllPhotos()).photos;
        },
        async rescanPhotos() {
            this.errorMessage = "Started rescan";
            var r = await BackendHandler.rescanAllPhotos();
            this.errorMessage = r.message;
            if ('err' in r) this.errorMessage = r.err;
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
        await this.getPhotos()
    }
}
</script>

<style>
@import url('../../assets/style/page.css');
</style>