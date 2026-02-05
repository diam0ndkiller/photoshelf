<script setup lang="ts">
import navigationUtils from '@/utils/navigationUtils';
import HomePage from './pages/HomePage.vue';
import AlbumsPage from './pages/AlbumsPage.vue';
import PhotosPage from './pages/PhotosPage.vue';
import AppSettingsPage from './pages/AppSettingsPage.vue';
import LoginWindow from './popups/LoginWindow.vue';
import NavigationDrawerContents from './subcomponents/NavigationDrawerContents.vue';
import InitialSetupPage from './pages/InitialSetupPage.vue';
import { BackendHandler } from '@/utils/backendHandler';
import DatabaseSettingsPage from './pages/DatabaseSettingsPage.vue';
import { Logger } from '@/utils/logger';

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
            v-if="showDefaultPageContent"
            v-model="showNavigationDrawer"
            permanent
    >
        <NavigationDrawerContents v-model:selected="selectedNavigationDrawerItem"/>
    </v-navigation-drawer>

    <LoginWindow v-if="showLogin" v-model="showLogin"/>

    <InitialSetupPage v-if="!showLogin && showInitialSetup" v-model="showInitialSetup"/>

    <HomePage v-if="showDefaultPageContent && currentComponent == 'home'"/>
    <AlbumsPage v-if="showDefaultPageContent && currentComponent == 'albums'" :current-path="currentPath"/>
    <PhotosPage v-if="showDefaultPageContent && currentComponent == 'photos'" :current-path="currentPath"/>
    <AppSettingsPage v-if="showDefaultPageContent && currentComponent == 'settings'" :current-path="currentPath"/>
    <DatabaseSettingsPage v-if="showDefaultPageContent && currentComponent == 'database'" :current-path="currentPath"/>

</template>

<script lang="ts">
export default {
    data() {
        return {
            showNavigationDrawer: true,
            selectedNavigationDrawerItem: '/home',
            currentPath: '/home',
            currentComponent: 'home',
            showLogin: false,
            showInitialSetup: true,
            initialSetupMessage: '',
        }
    },
    computed: {
        pathSegments() {
            return navigationUtils.decodePathSegments(this.currentPath);
        },
        showDefaultPageContent() {
            return !this.showLogin && !this.showInitialSetup;
        }
    },
    watch: {
        showLogin(newVal, oldVal) {
            if (newVal == false) {
                this.checkInitialSetup();
            }
        },
        showInitialSetup(newVal, oldVal) {
            if (newVal == false) {
                this.currentPath = "/home";
            }
        },
        currentPath() {
            this.currentComponent = this.currentPath.split("/")[1];
            this.selectedNavigationDrawerItem = this.currentPath;
        },
        selectedNavigationDrawerItem() {
            this.updatePath(this.selectedNavigationDrawerItem)
        }
    },
    mounted() {
        this.checkInitialSetup();
    },
    methods: {
        onAppBarPathSelection(newPath: string) {
            this.updatePath(newPath);
        },
        updatePath(newPath: string) {
            Logger.info(`Navigating to ${newPath}`)
            
            if (!this.showDefaultPageContent) return;
            this.currentPath = newPath;
        },
        async checkInitialSetup() {
            var r = await BackendHandler.getDatabaseLocation();
            if ('err' in r || r.databaseLocation == '' || r.databaseLocation == undefined) {
                if ('err' in r) this.initialSetupMessage = "You were sent here because of an error: " + r.err;
                this.showInitialSetup = true;
                this.currentPath = '/initial-setup';
            } else {
                this.showInitialSetup = false;
            }
        }
    },
    props: {

    },
}
</script>

<style>
@import url("../assets/style/app.css");
</style>