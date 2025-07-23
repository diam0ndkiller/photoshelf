<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';
import HomePage from './pages/HomePage.vue';
import AlbumsPage from './pages/AlbumsPage.vue';
import PhotosPage from './pages/PhotosPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import LoginWindow from './popups/LoginWindow.vue';
import NavigationDrawerContents from './NavigationDrawerContents.vue';

</script>

<template>
    <v-app-bar
            v-if="!showLogin"
            :elevation="2"
            color="primary"
    >
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="showNavigationDrawer = !showNavigationDrawer">
                <v-icon>mdi-hamburger</v-icon>
            </v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>
            <v-chip class="navbar-path-segment" @click="onAppBarPathSelection('/home')">photoshelf</v-chip>
            <span v-for="segment in pathSegments">
                > <v-chip class="navbar-path-segment" @click="onAppBarPathSelection(segment.pathLink)">
                    {{ segment.title }}
                </v-chip>
            </span>
        </v-app-bar-title>
    </v-app-bar>

    
    <v-navigation-drawer
            v-if="!showLogin"
            v-model="showNavigationDrawer"
            permanent
    >
        <NavigationDrawerContents @navigation-drawer-selection="onNavigationDrawerSelection"/>
    </v-navigation-drawer>

    <LoginWindow v-model="showLogin"/>

    <HomePage v-if="!showLogin && currentComponent == 'home'"/>
    <AlbumsPage v-if="!showLogin && currentComponent == 'albums'" :current-path="currentPath"/>
    <PhotosPage v-if="!showLogin && currentComponent == 'photos'" :current-path="currentPath"/>
    <SettingsPage v-if="!showLogin && currentComponent == 'settings'" :current-path="currentPath"/>


</template>

<script lang="ts">
export default {
    data() {
        return {
            showNavigationDrawer: true,
            selectedNavigationDrawerItems: [''],
            currentPath: '/home',
            currentComponent: 'home',
            showLogin: false,
        }
    },
    computed: {
        pathSegments() {
            return navigationUtils.decodePathSegments(this.currentPath);
        }
    },
    watch: {
        
    },
    methods: {
        onNavigationDrawerSelection(newValue: Array<string>) {
            this.updatePath(newValue[0])
        },
        onAppBarPathSelection(newPath: string) {
            this.updatePath(newPath);
        },
        updatePath(newPath: string) {
            this.currentPath = newPath;
            this.currentComponent = newPath.split("/")[1],
            console.log(newPath);
        }
    },
    props: {

    },
}
</script>

<style>
@import url("../assets/style/app.css");
</style>