<template>
  <top-nav>
    <li>
    <router-link :to="{ name: 'reports.summary'}">Dashboard Summary</router-link>
    </li>
    <li>
    <router-link :to="{name: 'reports.quotes'}">Quotes</router-link>
    </li>
    <li>
    <router-link :to="{name: 'reports.companies'}">Companies</router-link>
    </li>
    <li>
    <router-link :to="{name: 'reports.bidbonds'}">Bidbonds</router-link>
    </li>
  </top-nav>
</template>
<script>
import TopNav from "@/components/TopNav.vue";
export default
{
  components: {
    TopNav
  }
}
</script>
