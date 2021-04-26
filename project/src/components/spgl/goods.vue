<template>
    <div>
        <div id="goods" v-if="liebiao">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="header">
                <el-input placeholder="请输入id搜索" class="input-with-select" v-model='input'>
                    <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
                </el-input>
                <el-button type="primary" @click="tianjia">添加商品</el-button>


                <el-table :data="table" border style="width: 100%">
                    <el-table-column prop="goods_id" label="#" width="50">
                    </el-table-column>
                    <el-table-column prop="goods_name" label="商品名称" width='600'>
                    </el-table-column>
                    <el-table-column prop="goods_price" label="商品价格(元)">
                    </el-table-column>
                    <el-table-column prop="goods_weight" label="商品重量">
                    </el-table-column>
                    <el-table-column prop="add_time" label="创建时间" width='160'>
                    </el-table-column>

                    <el-table-column label="操作" width='120'>
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size='mini'
                                @click="xiugai(scope.row.goods_id,scope.row.goods_name,scope.row.goods_price,scope.row.goods_number,scope.row.goods_weight)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size='mini'
                                @click="open(scope.row.goods_id)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 编辑提交商品 -->
                <el-dialog title="编辑提交商品" :visible.sync="$store.state.xiugai">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="ruleForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="价格" prop="goods_price">
                            <el-input v-model="ruleForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="数量" prop="goods_number">
                            <el-input v-model="ruleForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="重量" prop="goods_weight">
                            <el-input v-model="ruleForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="介绍" prop="goods_introduce">
                            <el-input v-model="ruleForm.goods_introduce"></el-input>
                        </el-form-item>
                        <el-form-item label="上传的图片临时路径（对象）" prop="pics">
                            <el-input v-model="ruleForm.pics"></el-input>
                        </el-form-item>
                        <el-form-item label="商品的参数（数组）" prop="attrs">
                            <el-input v-model="ruleForm.attrs"></el-input>
                        </el-form-item>


                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="$store.state.xiugai = false">取 消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                    </div>
                </el-dialog>
                <div class="block" v-show='this.sh'>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pagenum" :page-sizes="sizes" :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-else class="tianj">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="label">
                <div class="tit">
                    <span><i class="el-icon-info"></i>添加商品信息</span>
                </div>
                <el-steps :active="Number(active)" finish-status="success" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <el-tabs tab-position="left" v-model='active'>
                    <el-tab-pane label="基本信息" name="0">
                        <!-- 基本信息面板 -->
                        <el-form :model="jbxx" :rules="jbxxs" ref="jbxx" label-width="" class="demo-ruleForm">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="jbxx.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="jbxx.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="jbxx.goods_number" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="jbxx.goods_weight"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <div class="jilian">
                                    <el-cascader :options="options" :props="config" v-model='value' @change='change'>
                                    </el-cascader>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 商品参数面板 -->

                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 商品静态属性面板 -->
                        <el-form :model="spsx" ref="spsx" label-width="" class="demo-ruleForm">
                            <el-form-item label="主体参数-商品名称" prop="goods_name">
                                <el-input v-model="spsx.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="特性参数-DD电机" prop="goods_price">
                                <el-input v-model="spsx.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="功能参数-洗衣程序" prop="goods_number">
                                <el-input v-model="spsx.goods_number"></el-input>
                            </el-form-item>
                            <el-form-item label="规格参数-洗净比" prop="goods_weight">
                                <el-input v-model="spsx.goods_weight"></el-input>
                            </el-form-item>

                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 图片上传面板 -->
                        <el-upload :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
                            :headers="uploadHeaders" list-type="picture"
                            action='http://192.168.1.22:8888/api/private/v1/upload'>
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>

                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 商品描述面板 -->
                        <quill-editor ref="myTextEditor" v-model="content" :options="editorOption">
                        </quill-editor>
                        <el-button type="primary" @click="wancheng" style="marginTop:30px">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import Http from './../../http/index.js'

    export default {

        data() {
            return {
                addForm: {
                    pics: []
                },
                header: '',
                uploadHeaders: {
                    Authorization: sessionStorage.getItem('token')
                },
                content: "",
                editorOption: {},
                value: '',
                active: null,
                options: [],
                config: {
                    checkStrictly: true,
                    label: 'cat_name',
                    value: 'cat_id'
                },
                liebiao: true,
                jbxx: {
                    goods_name: '',
                    goods_price: '',
                    goods_number: '',
                    goods_weight: '',
                    goods_cat: ''
                },

                jbxxs: {
                    goods_name: {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    },
                    goods_price: {
                        required: true,
                        message: '请输入价格',
                        trigger: 'blur'
                    },
                    goods_number: {
                        required: true,
                        message: '请输入数量',
                        trigger: 'blur'
                    },
                    goods_weight: {
                        required: true,
                        message: '请输入重量',
                        trigger: 'blur'
                    },
                    goods_cat: {
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur'
                    },
                },
                ruleForm: {
                    goods_name: '',
                    goods_price: '',
                    goods_number: '',
                    goods_weight: '',
                    goods_introduce: '',
                    pics: '',
                    attrs: '',
                },
                rules: {
                    goods_name: {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    },
                    goods_price: {
                        required: true,
                        message: '请输入价格',
                        trigger: 'blur'
                    },
                    goods_number: {
                        required: true,
                        message: '请输入数量',
                        trigger: 'blur'
                    },
                    goods_weight: {
                        required: true,
                        message: '请输入重量',
                        trigger: 'blur'
                    },
                },
                spsx: {
                    goods_name: '',
                    goods_price: '',
                    goods_number: '',
                    goods_weight: '',
                },
                a: null,
                b: null,
                input: null,
                sh: true,
                tableData: {},
                previewImgSrc: '',
                table: [],
                pagenum: 1,
                pagesize: 10,
                sizes: [5, 10, 15, 20, 25, 30]
            };
        },
        methods: {
            wancheng() {
                Http({
                    url: '/goods',
                    data: {
                        goods_name: this.jbxx.goods_name,
                        goods_cat: this.value,
                        goods_price: this.jbxx.goods_price,
                        goods_number: this.jbxx.goods_number,
                        goods_weight: this.jbxx.goods_weight
                    },
                    method: 'post'
                }).then((res) => {
                    console.log(res)
                })
            },
            /* handleClick(tab, event) {
                console.log(tab, event);
            }, */
            handleSuccess(result) {
                console.log(result)
                if (result.meta.status === 200) {
                    this.addForm.pics.push({
                        pic: result.data.tmp_path
                    })
                }
            },
            // 预览图片时候，触发的方法
            handlePreview(result) {
                this.previewImgSrc = result.response.data.url;
                this.previewVisible = true
            },
            // 当移除图片，会触发这个方法
            handleRemove(result) {
                // 根据 result.response.data.temp_path 从 addForm.pics 数组中，找到要删除那个对象的索引值
                const index = this.addForm.pics.findIndex(item => item.pic ===
                    result.response.data.tmp_path)
                // 根据索引删除对应的图片信息对象
                this.addForm.pics.splice(index, 1)
            },
            canshu() {
                console.log(111)
            },
            change(index) {
                this.value = index.toString()
            },
            tianjia() {
                this.liebiao = false
                Http({
                    url: "/categories",
                }).then((res) => {
                    console.log(res)
                    this.options = res.data.data
                })

            },
            beforeTabLeave() {
                /* this.$refs[this.jbxx].validate((valid) => {
                    if (valid) {} else {
                        return this.$message.error('请先选择商品分类')
                    }
                }) */
            },
            xiugai(a, b, c, d, e) {
                this.$store.state.xiugai = true;
                this.id = a
                this.ruleForm.goods_name = b
                this.ruleForm.goods_price = c
                this.ruleForm.goods_number = d
                this.ruleForm.goods_weight = e
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.xiugai = false
                        Http({
                            url: `goods/${this.id}`,
                            data: {
                                goods_name: this.ruleForm.goods_name,
                                goods_price: this.ruleForm.goods_price,
                                goods_number: this.ruleForm.goods_number,
                                goods_weight: this.ruleForm.goods_weight,
                                goods_introduce: this.ruleForm.goods_introduce,
                                pics: this.ruleForm.pics,
                                attrs: this.ruleForm.attrs,
                            },
                            method: 'put'
                        }).then((res) => {
                            this.fn()
                            console.log(res)
                        })
                    } else {
                        return false;
                    }
                });
            },
            open(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http({
                        url: `goods/${id}`,
                        method: 'delete'
                    }).then((res) => {
                        if (res.data.meta.status == 200) {
                            this.fn()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            return this.$message.error('删除失败！')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            sousuo() {
                Http(`/goods/${this.input}`).then((res) => {
                    console.log(res)
                    let a = []
                    a[0] = res.data.data
                    this.table = a
                    this.sh = false
                })
            },
            handleSizeChange(a) {
                this.pagesize = a;
                this.fn()
            },
            handleCurrentChange(a) {
                this.pagenum = a;
                this.fn()
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
            fn() {
                this.sh = true
                Http({
                    url: '/goods',
                    params: {
                        pagenum: this.pagenum,
                        pagesize: this.pagesize
                    }
                }).then((res) => {
                    console.log(res)
                    this.tableData = res.data.data
                    this.table = res.data.data.goods
                    for (let i = 0; i < this.table.length; i++) {
                        this.table[i].add_time = this.date(this.table[i].add_time)
                    }
                })
            }

        },
        components: {

        },
        mounted() {
            /* this.header = sessionStorage.getItem('token'),
                console.log(this.header) */
            this.fn()
        }

    };
</script>

<style scoped lang="less">
    .el-tabs {
        margin-top: 20px;
    }

    .tit {
        background-color: rgb(235, 235, 235);
        text-align: center;
        color: rgb(160, 160, 160);
        padding: 10px;
        font-size: 14px;
        margin-bottom: 15px;
    }

    .header {
        background-color: white;
        padding: 20px;
        margin-top: 20px;
    }

    .input-with-select {
        width: 30%;
        margin-right: 20px;
    }

    .el-table {
        margin-top: 20px;
    }

    .quill-editor {
        height: 500px;
        margin-bottom: 60px;
    }

    .block {
        margin-top: 20px;
    }

    .label {
        margin-top: 20px;
        padding: 20px;
        background-color: white;
    }

    .jilian {
        height: 100px;
        z-index: 10;
        position: relative;
        top: 40px;
        left: -65px;
    }
</style>