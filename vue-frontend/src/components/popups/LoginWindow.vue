<script setup lang="ts">
import BackendHandler from '@/utils/backendHandler';


</script>

<template>
    <v-dialog
            v-model=showDialog
            width="60%"
            persistent>
        <v-card
                title="Login to use photoshelf"
                text="Enter username and password to login or create first user."
                prepend-icon="mdi-lock">
            <v-form @submit.prevent="">
                <v-card-item>
                    <v-text-field v-model="username" color="secondary" label="Username" type="text" />
                    <v-text-field v-model="password" color="secondary" label="Password" type="password" />
                    <span style="margin-right: 5px">
                        <v-btn type="submit" prepend-icon="mdi-login" color="primary" @click="login">Login</v-btn>
                    </span>
                    <span style="margin-left: 5px">
                        <v-btn prepend-icon="mdi-login-variant" color="primary" @click="createFirstUser">Create First User</v-btn>
                    </span>
                    <span style="margin-left: 5px">{{ result }}</span>
                </v-card-item>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
export default {
    data() {
        return {
            showDialog: true,
            username: '',
            password: '',
            result: '',
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        hideLoginWindow() {
            this.$emit('update:modelValue', false);
        },
        async login() {
            let r = await BackendHandler.login(this.username, this.password);
            if ('err' in r) {
                this.result = "Error logging in: " + r.err;
            } else {
                this.showDialog = false;
                this.hideLoginWindow();
            }
        },
        async createFirstUser() {
            let r = await BackendHandler.addUser(this.username, this.password);
            if ('err' in r) {
                if (r.err == 'No token provided.') this.result = "Not the first user, please log in and add users in settings."
                else this.result = "Error creating user: " + r.err;
            } else {
                this.result = "User created sucessfully, login now.";
            }
        }
    },
    props:{
        modelValue: {
            type: Boolean,
            required: true,
        }
    },
    emits: ['update:modelValue']
}
</script>

<style>

</style>