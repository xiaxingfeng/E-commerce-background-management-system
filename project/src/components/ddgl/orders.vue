<template>
    <div id="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>


        <div style="margin-top: 15px;" class="table">
            <el-input v-model="input" class="input-with-select" :disabled="true">

                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- 分配角色 -->
            <el-dialog title="订单详情" :visible.sync="$store.state.midd">
                <ul>
                    <li>订单ID ：{{xinxi.order_id}}</li>
                    <li>用户ID ：{{xinxi.user_id}}</li>
                    <li>订单数量 ：{{xinxi.order_number}}</li>
                    <li>订单价格 ：{{xinxi.order_price}}</li>
                    <li>是否发货 ：{{xinxi.is_send}}</li>
                </ul>

            </el-dialog>
            <!-- 修改地址 -->
            <el-dialog title="修改地址" :visible.sync="haha">
                <span>省市区/县</span>
                <el-form label-width="80px" class="demo-ruleForm">
                    <!-- <el-form-item label="省市区/县" prop="order_id"> -->
                    <el-cascader :options="cityOptions" @change="changeProvince" style="width:95%">
                    </el-cascader>
                    <!-- </el-form-item> -->
                    <el-form-item label="详细地址" prop="order_price">
                        <el-input></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="haha = false">取 消</el-button>
                    <el-button type="primary" @click="haha=false">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 修改 -->
            <el-dialog title="修改订单状态" :visible.sync="$store.state.xiugai">
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="订单ID" prop="order_id">
                        <el-input v-model="id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="订单是否发货" prop="is_send">
                        <el-input v-model="ruleForm.is_send" placeholder='1:已经发货，0:未发货'></el-input>
                    </el-form-item>
                    <el-form-item label="订单支付" prop="order_pay">
                        <el-input v-model="ruleForm.order_pay" placeholder='支付方式 0 未支付 1 支付宝 2 微信 3 银行卡'></el-input>
                    </el-form-item>
                    <el-form-item label="订单价格" prop="order_price">
                        <el-input v-model="ruleForm.order_price"></el-input>
                    </el-form-item>
                    <el-form-item label="订单数量" prop="order_number">
                        <el-input v-model="ruleForm.order_number"></el-input>
                    </el-form-item>
                    <el-form-item label="支付状态" prop="pay_status">
                        <el-input v-model="ruleForm.pay_status" placeholder='订单状态： 0 未付款、1 已付款'></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="$store.state.xiugai = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 查看物流信息 -->
            <el-dialog title="物流进度" :visible.sync="buzhou">
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in list" :key="index" :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
            <el-table :data="table" border style="width: 100%">
                <el-table-column prop="order_id" label="#" width="50">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号" width='200'>
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="danger" size="small" v-if="scope.row.order_pay == 0">未付款</el-tag>
                        <el-tag size="small" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width='155'>
                </el-table-column>

                <el-table-column label="操作" width='240'>
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size='mini'
                            @click="xiugai(scope.row.order_id,scope.row.order_price,scope.row.order_number)">
                        </el-button>
                        <el-button type="success" icon="el-icon-location" size='mini' @click="wuliu">
                        </el-button>

                        <el-button type="warning" icon="el-icon-star-off" size='mini'
                            @click="fpsho(scope.row.order_id)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-edit" size='mini' @click="dizhi">
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="block" v-show='this.sh'>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="sizes" :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Http from './../../http/index'
    import cityOptions from './city_data2017_element.js'
    export default {
        props: {

        },
        data() {
            return {
                cityOptions: cityOptions,
                haha: false,
                buzhou: false,
                id: null,
                index: '',
                user: '',
                email: '',
                tem: '',
                xinxi: {},
                show: null,
                juese: '',
                dialogFormVisible: false,
                midd: false,
                input: '',
                sizes: [5, 6, 7, 8, 10],
                table: [],
                list: [],
                sh: true,
                size: 5,
                currentPage: 1,
                tableData: [],
                ruleForm: {
                    id: '',
                    is_send: '',
                    order_pay: '',
                    order_price: '',
                    order_number: '',
                    pay_status: ''
                },

                options: [],
                value: ''
            };
        },
        methods: {
            changeProvince() {

            },
            dizhi() {
                this.haha = true
            },
            wuliu() {
                this.buzhou = true
                Http(`/kuaidi/1106975712662`).then((res) => {
                    console.log(res.data.data.data)
                    this.list = res.data.data.data
                })
            },
            date(a) {
                let tim = new Date(a)
                let year = tim.getFullYear();
                let month = tim.getMonth();
                let day = tim.getDate();
                let hour = tim.getHours();
                let minute = tim.getMinutes();
                let second = tim.getSeconds();
                return `${year}-${month+1}-${day} ${hour < 10 ?('0' + hour) : hour}:${minute < 10 ? ("0" + minute) : minute}:${second < 10 ? ('0' + second) : second}`
            },


            fpsho(id) {
                this.$store.state.midd = true;
                Http(`orders/${id}`).then((res) => {
                    this.xinxi = res.data.data
                })

            },
            submitForm() {
                this.$store.state.xiugai = false
                Http({
                    url: `/orders/${this.id}`,
                    data: {
                        is_send: this.ruleForm.is_send,
                        order_pay: this.ruleForm.order_pay,
                        order_price: this.ruleForm.order_price,
                        order_number: this.ruleForm.order_number,
                        pay_status: this.ruleForm.pay_status,
                    },
                    method: 'put'
                }).then((res) => {
                    if (res.data.meta.status == 201) {
                        this.$message.success('更新订单成功！')
                        this.fn()
                    } else {
                        return this.$message.error('更新订单失败！')
                    }
                })

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            xiugai(a, d, e) {
                this.$store.state.xiugai = true
                this.id = a
                // this.ruleForm.is_send = b
                // this.ruleForm.order_pay = c
                this.ruleForm.order_price = d
                this.ruleForm.order_number = e
                // this.ruleForm.pay_status = f
            },


            handleSizeChange(val) {
                this.size = val
                this.fn()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fn()
            },
            fn() {
                Http({
                    url: '/orders',
                    params: {
                        pagenum: this.currentPage,
                        pagesize: this.size
                    }
                }).then((res) => {
                    this.tableData = res.data.data
                    this.table = this.tableData.goods;
                    for (let i = 0; i < this.table.length; i++) {
                        this.table[i].create_time = this.date(this.table[i].create_time)
                    }
                })
            },

        },
        mounted() {
            this.fn()
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .input-with-select {
        width: 30%;
        margin-right: 20px;
    }

    .table {
        background-color: white;
        padding: 20px;
    }

    .block {
        margin-top: 20px;
    }

    .el-table {
        margin-top: 20px;
    }

    .juese {
        margin: 15px 0;
    }

    .leb {
        margin-left: 30px;
        margin-top: -15px;
    }

    ul {
        margin-left: 20px;
        margin-top: -20px;
    }

    li {
        list-style: none;
        margin: 10px;
    }

    .el-cascader {
        margin-left: 20px;
        margin-bottom: 120px;
    }
</style>