<script>
    import { Bar } from 'vue-chartjs'

    export default {
        extends: Bar,
        props:{
            bid_expiry:{
                type:Array
            }
        },
        data(){
            return {
                bid_expiry_data:{
                labels: ['Expired Amount'],
                    datasets: [{
                    label: '# BidBonds Expiry',
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }

            }
        },
        mounted () {
          this.renderChart(this.bid_expiry_data, this.options)
        },
        activated() {
            if (this.bid_expiry.length > 0) {
                this.displayGraph();
            }
        },
        watch:{
            all_data(){
              this.displayGraph();
            }
        },
        computed:{
          all_data(){
          return [this.bid_expiry_data.datasets[0]['data'],this.bid_expiry].join();
          }
        },
        methods:{
            displayGraph(){
                this.bid_expiry_data.datasets[0]['data'] = [
                    this.bid_expiry.reduce((acc,item) => acc+parseInt(item.amount),0)
                ];
                this.renderChart(this.bid_expiry_data, this.options)
            }
        },
    }
</script>

<style scoped>

</style>
