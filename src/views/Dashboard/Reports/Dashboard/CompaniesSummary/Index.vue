<template>
    <div>
        <h4 class="sub-heading">Companies Summary</h4>
        <div class="row">
            <div class="col-md-6">
                <company-bar-chart  :company_summary="company_summary"></company-bar-chart>
            </div>
            <div class="col-md-6">
                <bar-chart :company_summary="company_summary"></bar-chart>
            </div>
        </div>
        <v-spacer></v-spacer>
        <v-card-title>
            <v-spacer></v-spacer>
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
                        :data ="getcompanySummaryFormatted"
                        :title = "'Companies Summary'"
                        v-if="getcompanySummaryFormatted.length"
                        name="companies_summary.xls"
                        class="btn btn-primary pull-right export-btn"
                >
                    <i class="fa fa-file-excel-o"></i> Export Excel
                </download-excel>
            </div>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="company_summary"
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
import companyBarChart from "./CompanyBarChart";
import FielDefs from './FielDefs'
import {mapGetters} from 'vuex';
    export default {
      props:{
          company_summary:{
              type:Array
          }
      },
        data() {
            return {
                start_date:'',
                to_date:'',
                search: '',
                sortBy: 'date_created',
                sortDesc: false,
                headers:FielDefs
            }
        },
      created() {

        },
      watch:{
          getcompanySummaryFormatted(){
            return this.getcompanySummaryFormatted;
          },
            period(){
                if (this.start_date && this.to_date){
                    this.$store.dispatch('setCompanySummary',{from:this.start_date,to:this.to_date});
                }
            },
        },
        computed:{
        ...mapGetters(['getcompanySummaryFormatted']),
            period(){
                return [this.start_date,this.to_date].join();
            }
        },
        components:{
            DatePicker,
            barChart,
            companyBarChart
        }
         }
</script>
