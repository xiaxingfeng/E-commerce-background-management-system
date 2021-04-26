<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
        </div>
    </div>

</template>

<script>
    import Http from './../../http/index.js'
    export default {
        props: {

        },
        data() {
            return {
                list: {}
            };
        },
        methods: {
            fn() {
                var chartDom = document.getElementById('main');
                var myChart = this.$echarts.init(chartDom);
                var option;

                option = {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },

                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },


                };
                option.legend = this.list.legend
                option.series = this.list.series
                option.xAxis = this.list.xAxis
                option.yAxis = this.list.yAxis
                option && myChart.setOption(option);

            }
        },
        components: {

        },
        mounted() {

            Http('reports/type/1').then((res) => {
                this.list = res.data.data
                console.log(this.list)
                this.fn()
            })
        }
    };
</script>

<style scoped lang="less">
    #main {
        margin-top: 20px;
        padding: 20px;
        background-color: white;
        width: 1000px;
        height: 500px;
    }
</style>