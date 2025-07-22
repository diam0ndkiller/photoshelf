<script setup lang="ts">
import MainFrame from './components/MainFrame.vue';

import { useTheme } from 'vuetify'

const theme = useTheme()

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme.change('dark');
} else {
  theme.change('light');
}

</script>

<template>
    <Suspense>
        <v-app>
            <MainFrame/>
        </v-app>
    </Suspense>
</template>

<style>
</style>
