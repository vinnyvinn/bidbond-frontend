<template>
    <auth>
        <div class="col-md-12">
            <quote/>
        </div>
    </auth>
</template>

<script>
    import Quote from "@/components/Guest/Quote.vue";
    import Auth from "@/components/Auth.vue";

    export default {
        components: {
            Auth, Quote
        },
    }
</script>
