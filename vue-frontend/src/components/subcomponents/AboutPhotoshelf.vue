<script setup lang="ts">
import Credits from './Credits.vue';
</script>

<template>
    <v-card :color="color">
        <v-card-item>
            <h1>About photoshelf</h1>
            <p>
                photoshelf is a tool to create digital photo books from your local photos.
            </p>
        </v-card-item>
        <v-card-item>
            <Credits :color="otherColor"/>
        </v-card-item>
    </v-card>
</template>

<script lang="ts">
export default {
    data() {
        return {
            
        }
    },
    computed: {
        otherColor() {
            return this.color == "background" ? "surface" : "background"
        }
    },
    watch: {
        
    },
    methods: {
        
    },
    props:{
        color: {
            type: String,
            default: 'surface'
        }
    },
    emits: []
}
</script>

<style>

</style>