<script setup lang="ts">
import { BackendHandler } from '@/utils/backendHandler';
</script>

<template>
    <div :style="getDivStyle()">
        <v-menu location="center center" origin="top start">
            <template v-slot:activator="{ props }">
                <button class="image-link" :title="tooltip" v-bind="props">
                    <img
                        decoding="async"
                        loading="lazy"
                        :style="getStyle()"
                        :src="srcPath"
                    />
                </button>
            </template>
            <v-list>
                <template v-for="item in menuItems">
                    <v-list-item
                        :prepend-icon="item.icon"
                        :title="item.title"
                        :value="item.value"
                        @click="item.action"
                    >
                        
                    </v-list-item>
                </template>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            menuItems: [
                { title: 'View full-size', icon: 'mdi-open-in-new', value: 'add', action: this.openFullSizeView},
                { title: 'Add to album...', icon: 'mdi-image-album', value: 'edit', action: this.addToAlbum}
            ]
        }
    },
    methods: {
        getStyle() {
            var res = "max-height: 100%; max-width: 100%; object-fit: contain; ";

            if (this.imgHeight) res += "height: " + this.imgHeight + ";"
            if (this.imgWidth) res += "width: " + this.imgWidth + ";"

            return res;
        },
        getDivStyle() {
            var res = "display: inline-block; text-align: center; vertical-align: center; padding: 10px;";

            if (this.divHeight) res += "height: " + this.divHeight + ";";
            if (this.divWidth) res += "width: " + this.divWidth + ";";

            return res;
        },
        openFullSizeView() {
            window.open(this.imageUrl, "blank");
        },
        addToAlbum() {

        }
    },
    computed: {
        imageUrl() {
            return BackendHandler.BASE_URL + '/photos/get-file?filename=' + encodeURIComponent(this.photo.path);
        },
        srcPath() {
            var res = this.imageUrl;

            if (this.scaleWidth) res += "&width=" + String(this.scaleWidth);
            if (this.scaleHeight) res += "&height=" + String(this.scaleHeight);

            return res;
        },
        filename() {
            var s = this.photo.path.split("/");
            return s[s.length - 1];
        },
        date() {
            if (this.photo.capture_date == "undefined") return undefined;
            else return new Date(this.photo.capture_date);
        },
        tooltip() {
            var res = this.filename + ' (Click to open full-size version)';

            if (this.date) res += '\n' + this.date;

            return res;
        }
    },
    watch: {
        
    },
    props:{
        photo: {
            type: Object,
            required: true
        },

        imgWidth: {
            type: String,
            default: undefined
        },
        imgHeight: {
            type: String,
            default: undefined
        },

        divWidth: {
            type: String,
            default: undefined
        },
        divHeight: {
            type: String,
            default: undefined
        },

        scaleWidth: {
            type: Number,
            default: undefined
        },
        scaleHeight: {
            type: Number,
            default: undefined
        },
        albums: {
            type: Array<BackendHandler.AlbumType>,
            default: []
        }
    },
    async mounted() {
    }
}
</script>

<style lang="css">
.image-link {
  all: unset;
  cursor: pointer;
  display: inline-block;
}
</style>