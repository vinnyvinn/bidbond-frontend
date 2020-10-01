<template>
    <div>
        <h5>System Settings</h5>
        <top-nav>
            <li>
                <router-link :to="{ name: 'settings.index'}">BidBond Limits
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'settings.pricing'}">BidBond Pricing Settings
                </router-link>
            </li>
            <li v-if="$can.view($store.getters.getAuthUser, 'create-companies')">
                <router-link :to="{name: 'settings.kyc'}">Disable KYC</router-link>
            </li>
        </top-nav>
    </div>
</template>
<script>
    import TopNav from "@/components/TopNav.vue";

    export default {
        components: {
            TopNav
        }
    }
</script>

