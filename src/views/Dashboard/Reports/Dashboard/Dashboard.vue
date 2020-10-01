<template>
    <div>
            <h4 class="sub-heading">Dashboard Summary</h4>
            <bar-chart :dashboard_summary="dashboard_summary"></bar-chart>
            <v-card-title>
                <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <div class="form-group" style="margin-right: 10px">
                    <label class="fs">Start Date</label>
                    <date-picker v-model="start_date" required format="yyyy-MM-dd"  input-class="form-control bg-white"/>
                </div>
                <div class="form-group">
                    <label class="fs">End Date</label>
                    <date-picker v-model="to_date" required format="yyyy-MM-dd"  input-class="form-control bg-white"/>
                </div>
              <div class="form-group">
                  <download-excel
                          :data ="getDashboardSummaryFormatted"
                          :title = "'Dashboard Summary'"
                          v-if="getDashboardSummaryFormatted.length"
                          name="dashboard_summary.xlsx"
                          class="btn btn-primary pull-right export-btn"
                  >
                      <i class="fa fa-file-excel-o"></i> Export Excel
                  </download-excel>
              </div>
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="dashboard_summary"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :search="search"
                    item-key="id"
                    class="elevation-1">
            </v-data-table>
    </div>
</template>

<script>
    import DatePicker from 'vuejs-datepicker';
    import barChart from "./BarChart";
    import FieldDefs from "./FieldDefs";
    import {mapGetters} from 'vuex';

    export default {
        props:{
            dashboard_summary:{
                type:Array
            }
        },
        data() {
            return {
                start_date:'',
                to_date:'',
                search: '',
                sortBy: 'month',
                sortDesc: false,
                headers:FieldDefs
            }
        },
        watch:{
          getDashboardSummaryFormatted(){
            return this.getDashboardSummaryFormatted;
          },
            period(){
                if (this.start_date && this.to_date){
                  this.$store.dispatch('setDashboardSummary',{from:this.start_date,to:this.to_date});
                }
            },
        },
        computed:{
          ...mapGetters(['getDashboardSummaryFormatted']),
         period(){
              return [this.start_date,this.to_date].join();
         }
        },
           components:{
             DatePicker,
             barChart
        }
    }
</script>
