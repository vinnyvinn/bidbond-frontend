<template>
    <div>
        <guest-header/>

        <div class="landing">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 offset-3">
                        <div class="auth-card">
                            <div class="card">
                                <h1 align="center">404</h1>
                                <p align="center">Not Found</p>
                            </div>
                        </div>
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
        }

    }
</script>