<template>
    <div>
        <guest-header/>
        <header id="header" class="ex-2-header header">
            <div class="container" id="main-content">
                <div class="row">
                    <slot></slot>
                </div>
            </div>
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
            GuestHeader,
          GuestFooter
        },
    }
</script>
