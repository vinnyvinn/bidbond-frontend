<script>
    import { Bar } from 'vue-chartjs'
    export default {
        extends: Bar,
        props:{
            work_days:{
                type:Array
            }
        },
        data(){
            return {
                work_days_data:{
                labels: ['No. of Bid Bond', 'Avg. No. of Bid Bonds'],
                    datasets: [{
                    label: '# Work days',
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
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
         this.renderChart(this.work_days_data, this.options)
        },
        activated() {
            if (this.work_days.length > 0) {
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
          return [this.work_days_data.datasets[0]['data'],this.work_days].join();
          }
        },
        methods:{
            displayGraph(){
                this.work_days_data.datasets[0]['data']=[
                    this.work_days.reduce((acc,item) => acc+parseInt(item.bidbonds_no),0),
                    this.work_days.reduce((acc,item) => acc+parseInt(item.bidbonds_no_avg),0)
                ];
                this.renderChart(this.work_days_data, this.options)
            }
        }
    }
</script>

<style scoped>

</style>