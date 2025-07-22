<script setup lang="ts">
    import navigationUtils from '@/utils/navigationUtils';
    import HomePage from './HomePage.vue';
    import AlbumsPage from './AlbumsPage.vue';
    import PhotosPage from './PhotosPage.vue';
    const mainNavigationDrawerItems = await navigationUtils.getNavigationDrawerItems();
</script>

<template>
    <v-app-bar
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
            v-model="showNavigationDrawer"
            permanent
    >
        <v-list
                :selected="selectedNavigationDrawerItems"
                :items=mainNavigationDrawerItems
                @update:selected="onNavigationDrawerSelection"
        ></v-list>
    </v-navigation-drawer>

    <HomePage v-if="currentComponent == 'home'"/>
    <AlbumsPage v-if="currentComponent == 'albums'" :current-path="currentPath"/>
    <PhotosPage v-if="currentComponent == 'photos'" :current-path="currentPath"/>
</template>

<script lang="ts">
export default {
    data() {
        return {
            showNavigationDrawer: true,
            selectedNavigationDrawerItems: undefined,
            currentPath: '/home',
            currentComponent: 'home',
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