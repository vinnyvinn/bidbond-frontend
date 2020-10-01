<template>
  <div>
    <v-app id="inspire">
    <h4 class="sub-heading">Quotes</h4>
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
            :data ="getQuotessFormatted"
            :title = "'Quotes'"
            v-if="getQuotessFormatted.length"
            name="quotes.xls"
            class="btn btn-primary pull-right export-btn"
        >
          <i class="fa fa-file-excel-o"></i> Export Excel
        </download-excel>
      </div>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="getQuotess"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :search="search"
        item-key="id"
        class="elevation-1">
    </v-data-table>
    </v-app>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker';
import FieldDefs from "./FieldDefs";
import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      start_date:'',
      to_date:'',
      search: '',
      sortBy: 'id',
      sortDesc: false,
      headers:FieldDefs
    }
  },
  created() {
    this.$store.dispatch('allQuotes');
  },

  watch:{
    period(){
      if (this.start_date && this.to_date){
        this.$store.dispatch('setQuotes',{from:this.start_date,to:this.to_date});
      }
    },
  },

  computed:{
    ...mapGetters(['getQuotess','getQuotessFormatted']),
    period(){
      return [this.start_date,this.to_date].join();
    }
  },
  components:{
    DatePicker
  }
}
</script>
