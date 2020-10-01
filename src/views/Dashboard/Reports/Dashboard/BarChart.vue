<script>
    import { Bar } from 'vue-chartjs'

    export default {
        extends: Bar,
        props:{
            dashboard_summary:{
                type:Array
            }
        },
        data(){
            return {
                dashboard_data:{
                    labels: ['Total Commissions', 'Excise Duty', 'Total Collections','JBB','MPF'],
                    datasets: [{
                        label: '# BidBonds',
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
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
            this.renderChart(this.dashboard_data, this.options)
        },
        activated() {
            if (this.dashboard_summary.length > 0) {
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
                return [this.dashboard_data.datasets[0]['data'],this.dashboard_summary].join();
            }
        },
        methods:{
            displayGraph(){
                this.dashboard_data.datasets[0]['data'] = [
                    this.dashboard_summary.reduce((acc,item) => acc+parseInt(item.commissions),0),
                    this.dashboard_summary.reduce((acc,item) => acc+parseInt(item.excise_duty),0),
                    this.dashboard_summary.reduce((acc,item) => acc+parseInt(item.collections),0),
                    this.dashboard_summary.reduce((acc,item) => acc+parseInt(item.jbb),0),
                    this.dashboard_summary.reduce((acc,item) => acc+parseInt(item.mpf),0)
                ];
                this.renderChart(this.dashboard_data, this.options)
            }
        }
    }
</script>

<style scoped>

</style>