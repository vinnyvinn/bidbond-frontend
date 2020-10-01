<template>
    <div>
        <guest-header/>
        <terms class="container mt-5 pt-5"/>
        <guest-footer/>
    </div>
</template>

<script>
    import "@/guest";
    import GuestHeader from "@/components/Guest/Header.vue";
    import GuestFooter from "@/components/Guest/Footer.vue";
    import Terms from "@/components/Guest/Terms.vue";
    export default {
        components: {
            GuestHeader, GuestFooter,Terms
        },
    }
</script>

