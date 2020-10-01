<template>
  <div>
    <div class="pdf text-right">
      <a href="#" style="margin-right: 10px" class="btn btn-info btn-sm" @click.prevent="showModal = true"><i
          class="fa fa-pencil"></i></a>
      <a :href="bid_url" target="_blank" class="btn btn-save btn-sm" ><i class="fa fa-download"></i></a>
    </div>
    <modal :showModal="showModal" @close="showModal = false">
      <template v-slot:header>
        <h5>Edit BidBond Period</h5>
      </template>
      <form @submit.prevent="update" class="picker">
        <div class="form-group">
          <label>Start Date</label>
          <date-picker v-model="start_date" format="yyyy-MM-dd" name="bid_bond_start_date"
                       input-class="form-control bg-white" :disabledDates="disabledDates"/>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-sm">Update Date</button>
        </div>
      </form>
    </modal>
    <div class="row">
      <div id="bid-bond-template" v-html="bidbond"></div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker';

export default {
  components: {
    DatePicker
  },

  mounted() {
    console.log(this.$route.params)
    this.fetch();
  },

  data() {
    return {
      bid_url:null,
      bidbond: '',
      showModal: false,
      start_date: '',
      disabledDates: {
        to: new Date(Date.now() - 8640000)
      }
    }
  },

  methods: {
    fetch() {
      this.bid_url = process.env.VUE_APP_API_URL + '/storage/'+this.$route.params.id + '.pdf';
      axios.get('/api/v1/' + this.$route.params.id + '/bid-bonds').then(response => {
        this.bidbond = response.data;
      }).catch(error => {
        if (error.response.status === 422) {
          this.$router.replace({
            name: 'bidbonds.payment',
            params: {id: this.$route.params.id, co: this.$route.params.co}
          })
        }
        this.error = error.response.data.error;
      });
    },

    update() {
      let data = {
        start_date: moment(this.start_date).format('YYYY-MM-DD'),
        secret: this.$route.params.id,
        company_unique_id: this.$route.params.co
      };

      axios.post('/api/v1/update/bid-bond', data).then(() => {
        this.fetch();
        this.showModal = false;
        toastr.success('Bidbond has been updated.');
      });
    },
  }
}
</script>
<style lang="scss">
.btn-save {
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #efefef;
}

.modal-body {
  height: 80vh !important;
}
body{
  margin: 0 !important;
  font-weight: 100 !important;
}
</style>
