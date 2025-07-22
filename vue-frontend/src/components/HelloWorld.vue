<script setup lang="ts">
</script>

<template>
    <h1>{{ helloworldMessage }}</h1>
</template>

<script>
import BackendHandler from '../utils/backendHandler.ts';

export default {
    data() {
        return {
            helloworldMessage: null,
        }
    },
    async mounted() {
        this.helloworldMessage = await BackendHandler.getHelloworld();
    }
}
</script>

<style>
</style>