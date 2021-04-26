<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="con">
            <el-input placeholder="请输入id搜索" class="input-with-select" v-model='input'>
                <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
            </el-input>
            <el-button type="primary" @click='tian'>添加分类</el-button>
            <!-- 添加分类弹层-->
            <el-dialog title="添加分类" :visible.sync="show">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="ruleForm.cat_name"></el-input>
                    </el-form-item>
                    <span class="fuji">父级分类：</span>
                    <el-cascader props.expandTrigger="hover" :options="parentCateList" :props="cascaderConfig"
                        v-model="selectedCateList" @change="handleChange" props.checkStrictly clearable>
                    </el-cascader>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="show = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑分类 -->
            <el-dialog title="编辑分类" :visible.sync="issh">

                <span>分类名称</span>
                <el-input v-model="cat_name" class="fl"></el-input>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="issh = false">取 消</el-button>
                    <el-button type="primary" @click="bianji(id)">确 定</el-button>
                </div>
            </el-dialog>
            <tree-table :data="cateList" :columns="columns" border :selection-type="false" :expand-type="false"
                show-index index-text="#" class="tree-table">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color:#20B2AA;" v-if="scope.row.cat_deleted== false"></i>
                    <i class="el-icon-error" style="color:#F92672;" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" size="small" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" size="small" v-else>三级</el-tag>
                </template>
                <template slot-scope="scope" slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size='mini'
                        @click="bian(scope.row.cat_id,scope.row.cat_name)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="open(scope.row.cat_id)">删除
                    </el-button>
                </template>
            </tree-table>
            <div class="block" v-show='this.sh'>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="sizes" :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
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
                selectedCateList: [],
                cascaderConfig: {
                    label: 'cat_name',
                    value: 'cat_id',
                    checkStrictly: true
                },
                parentCateList: [],
                id: null,
                total: null,
                options: [],
                cat_name: '',
                issh: false,
                peizhi: {
                    label: 'cat_name',
                    value: 'cat_id',
                    checkStrictly: true
                },

                show: false,
                input: '',
                sh: true,
                sizes: [1, 2, 3, 4, 5],
                size: 3,
                currentPage: 1,
                cateList: [],
                ruleForm: {
                    cat_name: null,
                    cat_pid: null,
                    cat_level: null
                },
                rules: {

                    cat_name: [{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }, ],

                },
                columns: [{
                        label: "分类名称",
                        prop: "cat_name"
                    },

                    {
                        label: "是否有效",
                        prop: "",
                        type: "template",
                        template: "isok"
                    },
                    {
                        label: "排序",
                        prop: "",
                        type: "template",
                        template: "order"
                    },
                    {
                        label: "操作",
                        prop: "",
                        type: "template",
                        template: "opt",
                        width: '200'
                    },
                ],
            };
        },
        methods: {
            handleChange() {
                if (this.selectedCateList.length === 0) {
                    // 证明没有选中任何父级分类
                    this.ruleForm.cat_pid = 0
                    this.ruleForm.cat_level = 0
                } else {
                    // 选中父级分类
                    this.ruleForm.cat_pid = this.selectedCateList[this.selectedCateList.length - 1]
                    // 设置分类等级
                    this.ruleForm.cat_level = this.selectedCateList.length
                }
            },
            tian() {
                this.show = true;
                Http({
                    url: "/categories",
                    params: {
                        type: 2
                    }
                }).then((res) => {
                    console.log(res)
                    this.parentCateList = res.data.data
                })
            },
            bianji(a) {
                this.issh = false
                Http({
                    url: `/categories/${a}`,
                    data: {
                        cat_name: this.cat_name
                    },
                    method: 'put'
                }).then((res) => {
                    if (res.data.meta.status == 200) {
                        this.$message.success('编辑成功！')
                        this.fn()
                    } else {
                        return this.$message.error('编辑失败！')
                    }
                })
            },
            bian(a, b) {
                this.issh = true
                this.id = a
                this.cat_name = b
            },
            open(id) {
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http({
                        url: `categories/${id}`,
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
                Http(`/categories/${Number(this.input)}`).then((res) => {
                    let a = []
                    if (res.data.meta.status == 200) {
                        a[0] = res.data.data
                    }
                    this.cateList = a
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.show = false
                        Http({
                            url: '/categories',
                            data: {
                                'cat_pid': this.ruleForm.cat_pid,
                                'cat_name': this.ruleForm.cat_name,
                                'cat_level': this.ruleForm.cat_level,
                            },
                            method: 'post'
                        }).then((res) => {
                            console.log(res)
                            if (res.data.meta.status == 201) {
                                this.$message.success('添加分类成功！')
                                this.fn()
                            } else {
                                return this.$message.error('添加分类失败！')
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                this.size = val
                console.log(val)
                this.fn()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                console.log(val)
                this.fn()
            },
            fn() {
                Http({
                    url: "/categories",
                    params: {
                        pagenum: this.currentPage,
                        pagesize: this.size,
                    }
                }).then((res) => {
                    console.log(res)
                    this.cateList = res.data.data.result
                    this.total = res.data.data.total
                })
            }
        },
        components: {

        },
        mounted() {
            this.fn()
        }
    };
</script>

<style scoped lang="less">
    .input-with-select {
        width: 30%;
        margin-right: 20px;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
    }

    .con {
        padding: 20px;
        background: white;
    }

    .fuji {
        margin-left: 30px;
    }

    .tree-table {
        margin-top: 20px;
    }

    .block {
        margin-top: 20px;
    }

    .fl {
        width: 80%;
        margin-left: 20px;
    }
</style>