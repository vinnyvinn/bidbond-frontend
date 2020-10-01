<template>
    <auth>
        <div class="col-md-6 offset-md-3" v-if="error.length">
            <div class="alert alert-danger">
                {{ error }}
            </div>
        </div>

    </auth>
</template>

<script>
    import Auth from "@/components/Auth.vue";

    export default {
        components: {
            Auth
        },

        mounted() {

            if (this.$store.getters.getAuthUser.verified_email) {
                this.$router.push({name: 'login', query: {a: 1}});
            } else {
                this.verify();
            }
        },

        data() {
            return {
                error: ''
            }
        },

        methods: {
            verify() {
                let data = {
                    code: this.$route.params.code
                };

                axios.post('/api/v1/email/activate', data).then(res => {
                    this.$router.push({name: 'login', query: {a: 1}});
                }).catch(error => {
                    this.error = error.response.data;
                });
            }
        }
    }
</script>

<style lang="scss">
    .verify {
        .loading {
            width: 40%;
            margin: auto;
            margin-top: 20px;

            img {
                width: 100%;
            }
        }

        .alert {
            margin-top: 40px;
        }
    }
</style>
