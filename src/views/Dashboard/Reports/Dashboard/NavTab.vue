<template>
    <div>
        <v-app id="inspire">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" v-if="$can.view($store.getters.getAuthUser, 'list-company-revenues-reports')">
                    <a @click="currentTab='dashboard'" :class="['nav-link',{active:currentTab=='dashboard'}]"
                       data-toggle="tab" href="#" role="tab" aria-controls="Dashboard"
                       :aria-selected="currentTab=='dashboard'">Dashboard</a>
                </li>
                <li class="nav-item" style="display: none">
                    <a @click="currentTab='bid-summary'" v-if="$can.view($store.getters.getAuthUser, 'bidbonds-reports')"
                       :class="['nav-link',{active:currentTab=='bid-summary'}]"
                       data-toggle="tab" href="#" role="tab" aria-controls="BidBonds"
                       :aria-selected="currentTab=='bid-summary'">BidBonds</a>
                </li>
                <li class="nav-item">
                    <a @click="currentTab='company-summary'"
                       :class="['nav-link',{active:currentTab=='company-summary'}]"
                       v-if="$can.view($store.getters.getAuthUser, 'companies-reports')"
                       data-toggle="tab" href="#"
                       role="tab" aria-controls="Company" :aria-selected="currentTab=='company-summary'">Company</a>
                </li>
                <li class="nav-item" style="display: none">
                    <a @click="currentTab='work-days'" :class="['nav-link',{active:currentTab=='work-days'}]"
                       data-toggle="tab" href="#" role="tab" aria-controls="Days"
                       :aria-selected="currentTab=='work-days'">Net Work Days</a>
                </li>
                <li class="nav-item" style="display: none">
                    <a @click="currentTab='bid-bond-expiry'"
                       :class="['nav-link',{active:currentTab=='bid-bond-expiry'}]"
                       v-if="$can.view($store.getters.getAuthUser, 'bidbonds-reports')"
                       data-toggle="tab" href="#"
                       role="tab" aria-controls="Expiry" :aria-selected="currentTab=='bid-bond-expiry'">BidBonds
                        Expiry</a>
                </li>
            </ul>
            <keep-alive>
                <component :is="currentTab" class="tab" v-bind="currentProperties"></component>
            </keep-alive>
        </v-app>
    </div>
</template>

<script>
    import bidSummary from "./BidbondSummary/Index";
    import companySummary from './CompaniesSummary/Index';
    import workDays from './NetWorkDays/Index';
    import bidBondExpiry from './BidBondExpiry/Index';
    import dashboard from './Dashboard';
    import topNav from './../../../../components/TopNav'
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                currentTab: "company-summary",
                tab: 1
            }
        },
        created() {
            this.$store.dispatch('dashboardSummary');
        },
        watch: {
            dashboard_summary() {
                return this.dashboard_summary;
            },
            bidbonds_summary() {
                return this.bidbonds_summary;
            },
            company_summary() {
                return this.company_summary;
            },
            work_days() {
                return this.work_days;
            },
            bid_expiry() {
                return this.bid_expiry;
            },
            path_to() {
                console.log(this.path_to)
                return this.path_to;
            }
        },
        computed: {
            ...mapGetters({
                dashboard_summary: 'getDashboardSummary',
                bidbonds_summary: 'getBidbondsSummary',
                company_summary: 'getcompanySummary',
                work_days: 'getWorkDays',
                bid_expiry: 'getBidExpiry',
                path_to: 'getPath'
            }),
            currentProperties() {
                if (this.currentTab == 'bid-summary') {
                    return {bidbonds_summary: this.bidbonds_summary}
                }
                if (this.currentTab == 'dashboard') {
                    return {dashboard_summary: this.dashboard_summary}
                } else if (this.currentTab == 'company-summary') {
                    return {company_summary: this.company_summary}
                } else if (this.currentTab == 'work-days') {
                    return {work_days: this.work_days}
                } else if (this.currentTab == 'bid-bond-expiry') {
                    return {bid_expiry: this.bid_expiry}
                }
            }
        },
        components: {
            bidSummary,
            companySummary,
            workDays,
            bidBondExpiry,
            dashboard,
            topNav
        }
    }
</script>
