<script setup lang="ts">
</script>

<template>
    <h1>{{ helloworldMessage }}</h1>
</template>

<script>
import { getHelloworld } from '../utils/backendHandler.ts';

export default {
    data() {
        return {
            helloworldMessage: null,
        }
    },
    async mounted() {
        this.helloworldMessage = await getHelloworld();
    }
}
</script>

<style>
</style>