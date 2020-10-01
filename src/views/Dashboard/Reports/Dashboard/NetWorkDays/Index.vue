<template>
    <div>
        <h4 class="sub-heading">Net Work Days To-date</h4>
        <bar-chart :work_days="work_days"></bar-chart>
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
                        :data ="work_days"
                        :title = "'Net Work Days To-date'"
                        v-if="work_days.length"
                        name="netWorkDaysToDate.xlsx"
                        class="btn btn-primary pull-right export-btn"
                >
                    <i class="fa fa-file-excel-o"></i> Export Excel
                </download-excel>
            </div>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="work_days"
                :sort-desc.sync="sortDesc"
                :search="search"
                item-key="id"
                class="elevation-1">
        </v-data-table>
    </div>
</template>

<script>
    import FieldDefs from "./FieldDefs";
    import DatePicker from 'vuejs-datepicker';
    import barChart from "./BarChart";
    export default {
        props:{
            work_days:{
                type:Array
            }
        },
        data() {
            return {
                start_date:'',
                to_date:'',
                search: '',
                sortBy: 'rm',
                sortDesc: false,
                headers:FieldDefs
            }
        },
        watch:{
            period(){
                if (this.start_date && this.to_date){
                    this.$store.dispatch('setWorkDays',{from:this.start_date,to:this.to_date});
                }
            },
        },

        computed:{
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
