<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="content">
            <div class="jilian">
                <div class="tishi"><i class="el-icon-warning"></i> 注意：只允许为第三级分类设置相关参数!</div>
                <span>选择商品分类 ：</span>
                <el-cascader :options="options" :props="config" v-model='value' @change="change">
                </el-cascader>
            </div>

            <el-tabs v-model="activeName">
                <el-tab-pane label="动态参数" name="1">
                    <el-button type="primary" size='small' :disabled='jiny' @click="add(a)">添加参数</el-button>
                    <el-table :data="tableData" style="width: 100%" border stripe>
                        <el-table-column type="expand">
                            <template>
                                <span v-for="(item,index) in tableData" :key="index" class="centerRow">
                                    <el-tag closable v-for="(item1,index) in item.attr_vals.split(',')" :key="index"
                                        @close='close(row.cat_id,row.attr_id,row.attr_vals,index)'>
                                        {{item1}}
                                    </el-tag>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" prop="attr_id" width='60'>
                        </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作" prop="desc">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='mini'
                                    @click="beaj(c,scope.row.attr_id,scope.$index,1)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size='mini'
                                    @click="open(scope.row.cat_id,scope.row.attr_id,scope.$index,1)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="2">
                    <el-button type="primary" size='small' :disabled='jiny' @click="add(b)">添加属性</el-button>
                    <el-table :data="table" style="width: 100%" border stripe>
                        <el-table-column type="expand">
                            <template>
                                <span v-for="(item,index) in table" :key="index" class="centerRow">
                                    <el-tag closable v-for="(item1,index) in item.attr_vals.split(',')" :key="index">
                                        {{item1}}
                                    </el-tag>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" prop="attr_id" width='60'>
                        </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作" prop="desc">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='mini'
                                    @click="beaj(d,scope.row.attr_id,scope.$index,2)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size='mini'
                                    @click="open(scope.row.cat_id,scope.row.attr_id,scope.$index,2)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>




            <el-dialog :title="obj.tittle" :visible.sync="canshu">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="obj.label" prop="goods_name">
                        <el-input v-model="ruleForm.goods_name"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="canshu = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="obj.tittle" :visible.sync="bj">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="obj.label" prop="goods_name">
                        <el-input v-model="ruleForm.goods_name"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="bj = false">取 消</el-button>
                    <el-button type="primary" @click="xiugaiForm('ruleForm')">确 定</el-button>
                </div>
            </el-dialog>


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
                suib: '',
                index: null,
                aid: null,
                bj: false,
                canshu: false,
                id: null,
                jiny: true,
                tableData: [],
                table: [],
                activeName: '1',
                options: [],
                value: '',
                config: {
                    label: 'cat_name',
                    value: 'cat_id'
                },
                ruleForm: {
                    goods_name: '',

                },
                rules: {
                    goods_name: {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    },

                },
                obj: {},
                a: {
                    tittle: '添加动态参数',
                    label: '动态参数',
                    attr_sel: 'many',
                    method: 'post'
                },
                b: {
                    tittle: '添加静态属性',
                    label: '静态属性',
                    attr_sel: 'only',
                    method: 'post'
                },
                c: {
                    tittle: '修改动态参数',
                    label: '动态参数',
                    attr_sel: 'many',
                    method: 'put'
                },
                d: {
                    tittle: '修改静态属性',
                    label: '静态属性',
                    attr_sel: 'only',
                    method: 'put'
                }
            };
        },
        methods: {
            /*  close(a, b, c,index) {
                 c.split.splice(index,1).join(',')
             }, */
            add(dx) {
                this.canshu = true;
                this.obj = dx
            },
            beaj(dx, aid, c, e) {
                this.index = c
                this.bj = true
                this.obj = dx
                this.aid = aid
                this.suib = e
                console.log(this.index, this.suib)
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.canshu = false
                        Http({
                            url: `categories/${this.id}/attributes`,
                            data: {
                                attr_name: this.ruleForm.goods_name,
                                attr_sel: `${this.obj.attr_sel}`
                            },
                            method: this.obj.method
                        }).then((res) => {
                            console.log(res)
                            this.tableData.push(res.data.data)
                        })
                    } else {
                        return false;
                    }
                });
            },
            xiugaiForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.bj = false
                        Http({
                            url: `categories/${this.id}/attributes/${this.aid}`,
                            data: {
                                attr_name: this.ruleForm.goods_name,
                                attr_sel: `${this.obj.attr_sel}`
                            },
                            method: this.obj.method
                        }).then((res) => {
                            console.log(res)
                            if (this.suib == 1) {

                                this.tableData[this.index] = res.data.data
                                console.log(this.tableData, res.data.data)
                            } else {
                                this.table[this.index] = res.data.data

                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            change(a) {
                if (a.length == 3) {
                    this.jiny = false
                    this.id = a[a.length - 1]
                    Http({
                        url: `categories/${this.id}/attributes`,
                        params: {
                            sel: `many`
                        }
                    }).then((res) => {
                        console.log(res)
                        this.tableData = res.data.data
                    })
                    Http({
                        url: `categories/${this.id}/attributes`,
                        params: {
                            sel: `only`
                        }
                    }).then((res) => {

                        this.table = res.data.data
                    })
                }
            },
            open(a, b, c, d) {
                this.suib = d
                this.index = c
                this.$confirm('此操作将永久删除，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http({
                        url: `categories/${a}/attributes/${b}`,
                        method: 'delete'
                    }).then((res) => {
                        if (res.data.meta.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            if (this.suib == 1) {
                                this.tableData.splice(this.index, 1)
                            } else {
                                this.table.splice(this.index, 1)
                            }
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

        },
        components: {

        },
        mounted() {
            Http({
                url: "/categories",
            }).then((res) => {
                console.log(res)
                this.options = res.data.data
            })
        }
    };
</script>

<style scoped lang="less">
    #content {
        background: white;
        padding: 20px;
        margin-top: 20px;
    }

    .tishi {
        padding: 8px;
        padding-left: 15px;
        color: #E6A23C;
        background-color: #FDF6EC;
        font-size: 12px;
        margin-bottom: 20px;
        border-radius: 3px;
    }

    .el-tag {
        margin: 10px;
    }

    .el-table {
        margin-top: 20px;
    }
</style>