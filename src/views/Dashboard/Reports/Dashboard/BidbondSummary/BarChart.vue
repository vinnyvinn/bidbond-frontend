<script>
    import {Bar} from 'vue-chartjs'

    export default {
        extends: Bar,
        props: {
            bidbonds_summary: {
                type: Array
            }
        },
        data() {
            return {
                bidbonds_data: {
                    labels: ['Companies On-boarded', 'Bid Bond Generated', 'Tenders Closing'],
                    datasets: [{
                        label: '# BidBonds',
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
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
        mounted() {
            this.renderChart(this.bidbonds_data, this.options)
        },
        activated() {
            if (this.bidbonds_summary.length > 0) {
                this.displayGraph();
            }
        },
        watch: {
            all_data() {
                this.displayGraph();
            }
        },
        computed: {
            all_data() {
                return [this.bidbonds_data.datasets[0]['data'], this.bidbonds_summary].join();
            }
        },
        methods: {
            displayGraph() {
                this.bidbonds_data.datasets[0]['data'] = [
                    this.bidbonds_summary.reduce((acc, item) => acc + parseInt(item.companies), 0),
                    this.bidbonds_summary.reduce((acc, item) => acc + parseInt(item.bidbonds), 0),
                    this.bidbonds_summary.reduce((acc, item) => acc + parseInt(item.tenders), 0)
                ];
                this.renderChart(this.bidbonds_data, this.options)
            }
        },
    }
</script>
