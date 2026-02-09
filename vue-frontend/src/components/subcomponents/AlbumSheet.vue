<script setup lang="ts">
import type { JoinedAlbumContentLink } from '@shared/databasetypes';
import type { PropType } from 'vue';

</script>

<template>
    <div class="box-wrapper">
        <div class="page-box" :style="`background-color: ${backgroundColor};`">
            Content goes here
        </div>
    </div>
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
        contents: {
            type: Object as PropType<Array<JoinedAlbumContentLink>>,
            required: true
        },
        backgroundColor: {
            type: String,
            default: "#99ccff",
        }
    },
    emits: []
}
</script>

<style>
.box-wrapper {
  display: flex;
  height: 100%;
  justify-content: center; /* horizontal center */
  align-items: center;     /* vertical center */
}

.page-box {
  width: min(70vw, 70vh*(16/9));
  height: min(70vh, 70vw*(9/16));
}
</style>