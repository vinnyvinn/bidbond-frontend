<template>
    <div class="login">
        <guest-header/>
        <div class="landing">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <div class="auth-card" v-if="is_loaded"></div>
                        <loading v-else/>
                    </div>
                </div>
            </div>
        </div>
        <guest-footer/>
    </div>
</template>

<script>
    import "@/guest";
    import GuestHeader from "@/components/Guest/Header.vue";
    import GuestFooter from "@/components/Guest/Footer.vue";

    export default {
        components: {
            GuestHeader, GuestFooter
        },
        mounted() {
            this.fetch()
        },
        data() {
            return {
                code: {
                    code: this.$route.params.code
                }
            }
        },
        methods: {
            fetch() {
                this.is_valid = true;
                this.is_loaded = true;
                this.verifyCompany();
            },
            verifyCompany() {
                axios.post('/api/verify-company', this.code).then(() => {
                    toastr.success('Company approved', 'Success');
                    if (this.$auth.isAuthenticated()) {
                        window.location.href = '/dashboard/companies';
                    }
                }).catch(() => {
                    toastr.error('Code not valid!', 'Error');
                    if (this.$auth.isAuthenticated()) {
                        window.location.href = '/dashboard';
                    }
                })
            }
        }
    }
</script>

