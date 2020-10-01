<template>
    <auth>
        <div v-if="is_loaded"></div>
       <loading v-else/>
    </auth>
</template>

<script>
    import Auth from "@/components/Auth.vue";
    import toastr from 'toastr';
    import 'toastr/build/toastr.min.css';

    export default {
        components: {
            Auth
        },

        mounted() {
            this.fetch()
        },

        data() {
            return {
                code: {
                    code: this.$route.params.code,
                    id: this.$route.params.id,
                },
                is_valid: false,
                is_loaded: false,
            }
        },

        methods: {
            fetch() {
                this.is_valid = true;
                this.is_loaded = true;
                this.verifyDirectorSms();
            },

            verifyDirectorSms() {
                axios.post('/api/v1/verify-director-sms', this.code).then(() => {
                    toastr.success('You have successfully authorized the onboarding process of company', '');
                    setTimeout(function () {
                        window.location.href = '/dashboard/companies';
                    }, 1000);
                }).catch((err) => {
                    console.log(err)
                    toastr.error('Code not valid!', '');
                    window.location.href = '/';
                })
            }
        }
    }
</script>

