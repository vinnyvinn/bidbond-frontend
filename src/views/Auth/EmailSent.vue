<template>
    <div class="verify">
        <guest-header/>
        <div class="container">
            <div class="row">
                <div class="col-md-8 mt-5 mb-5 offset-md-2">
                    <div class="alert alert-success text-danger">
                        <p style="margin: 30px;">An email has been sent to {{ $auth.getVerifyUser() }}. Please
                            click on the link in your email to continue.</p>
                        <div v-if="can_request_resend">
                            <a href="#" class="btn btn-primary" @click.prevent="resend">Resend verification
                                email.</a>
                        </div>
                        <div v-if="! can_request_resend">
                            <p class="text-danger">Wait <span>{{ timerCount }}</span> seconds and retry if no email was received</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/guest";
    import GuestHeader from "@/components/Guest/Header.vue";

    export default {
        components: {
            GuestHeader
        },
        data() {
            return {
                can_request_resend: false,
                timerCount: 60
            }
        },
        methods: {
            resend() {
                let data = {
                    email: this.$auth.getVerifyUser()
                };
                this.can_request_resend = false;
                this.timerCount = 60;
                axios.post('/api/v1/resend-email', data).then(() => {
                    toastr.success("Email sent");
                });
            }
        },
        watch: {
            timerCount: {
                handler(value) {

                    if (value > 0) {
                        setTimeout(() => {
                            this.timerCount--;
                        }, 1000);
                    } else {
                        this.can_request_resend = true;
                    }

                },
                immediate: true // This ensures the watcher is triggered upon creation
            }

        }
    }
</script>

