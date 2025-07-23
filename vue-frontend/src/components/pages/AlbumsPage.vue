<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';

const albums = (await BackendHandler.listAlbums()).albums;
</script>

<template>
    <v-main>
        <div class="page-content">
            <h1>{{ currentPath }}</h1>
            <ul>
                <li v-for="album in albums">{{ album.name }}</li>
            </ul>
        </div>
    </v-main>
</template>

<script lang="ts">
export default {
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        updatePath(newPath: string) {
            this.$emit('updatePath', newPath);
        }
    },
    props: {
        currentPath: {
            type: String,
        }
    },
    emits: ['updatePath']
}
</script>

<style>
@import url('../../assets/style/page.css');
</style>