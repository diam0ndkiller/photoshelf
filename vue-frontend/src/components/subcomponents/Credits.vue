<script setup lang="ts">

</script>

<template>
    <h2>Credits</h2>
    <v-card title="photoshelf" :color="color" class="mt-2">
        <v-card-item prepend-icon="mdi-github">
            <b>GitHub:</b> <a href="https://github.com/diam0ndkiller/photoshelf">https://github.com/diam0ndkiller/photoshelf</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-scale-balance">
            <b>License:</b> <a href="https://opensource.org/license/bsd-2-clause">BSD-2 Clause</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-account-circle">
            <b>Author:</b> <a href="https://github.com/diam0ndkiller">diam0ndkiller</a>
        </v-card-item>
    </v-card>
    <v-card title="Vue" :color="color" class="mt-3">
        <v-card-text>
            photofshelf is developed using the JavaScript framework <a href="https://vuejs.org">VueJS</a>.<br>
        </v-card-text>
        <v-card-item prepend-icon="mdi-github">
            <b>GitHub:</b> <a href="https://github.com/vuejs/core">https://github.com/vuejs/core</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-scale-balance">
            <b>License:</b> <a href="https://opensource.org/license/mit">MIT</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-account-circle">
            <b>Author:</b> <a href="https://github.com/yyx990803">Evan You</a>
        </v-card-item>
    </v-card>
    <v-card title="Vuetify" :color="color" class="mt-3">
        <v-card-text>
            The layout and design of photoshelf are built using <a href="https://vuetifyjs.com/">VuetifyJS</a>.<br>
        </v-card-text>
        <v-card-item prepend-icon="mdi-github">
            <b>GitHub:</b> <a href="https://github.com/vuetifyjs/vuetify">https://github.com/vuetifyjs/vuetify</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-scale-balance">
            <b>License:</b> <a href="https://opensource.org/license/mit">MIT</a>
        </v-card-item>
        <v-card-item prepend-icon="mdi-account-circle">
            <b>Author:</b> <a href="https://github.com/johnleider">John Leider</a>
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
        
    },
    watch: {
        
    },
    methods: {
        
    },
    props:{
        color: {
            type: String,
            default: "surface"
        }
    },
    emits: []
}
</script>

<style>

</style>