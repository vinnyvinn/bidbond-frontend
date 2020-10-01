<template>
    <div>
        <guest-header/>
        <header id="header" class="header">
            <div class="header-content">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-xl-5">
                            <div class="text-container">
                                <h1>JBID</h1>
                                <p class="p-large">Get your bidbonds from Jamii Bank in minutes</p>
                                <a class="btn-solid-lg page-scroll" href="/login">APPLY NOW</a>
                            </div> <!-- end of text-container -->
                        </div> <!-- end of col -->
                        <div class="col-lg-6 col-xl-7">
                            <div class="image-container">
                                <div>
                                    <img class="img-fluid" src="@/theme/images/jbid-logo.png" alt="JBid Logo">
                                </div> <!-- end of img-wrapper -->
                            </div> <!-- end of image-container -->
                        </div> <!-- end of col -->
                    </div> <!-- end of row -->
                </div> <!-- end of container -->
            </div> <!-- end of header-content -->
        </header>
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
    }
</script>
