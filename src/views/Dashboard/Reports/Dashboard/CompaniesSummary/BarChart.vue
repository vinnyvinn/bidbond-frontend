<script>
    import { Bar } from 'vue-chartjs'

    export default {
        extends: Bar,
        props:{
            company_summary:{
                type:Array
            }
        },
        data(){
            return {
            company_data:{
                labels: ['Bid Bond Value','Commission'],
                    datasets: [{
                    label: '# Bid Bond',
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
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
            this.renderChart(this.company_data, this.options)
        },
        activated() {
            if (this.company_summary.length > 0) {
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
          return [this.company_data.datasets[0]['data'],this.company_summary].join();
          }
        },
        methods:{
            displayGraph(){
                this.company_data.datasets[0]['data'] = [
                    this.company_summary.reduce((acc,item) => acc+parseInt(item.bidbond_value),0),
                    this.company_summary.reduce((acc,item) => acc+parseInt(item.commissions_value),0)
                ];
                this.renderChart(this.company_data, this.options)
            }
        }
    }
</script>

