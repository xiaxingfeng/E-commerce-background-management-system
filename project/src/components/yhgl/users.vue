<template>
    <div id="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>


        <div style="margin-top: 15px;" class="table">
            <el-input placeholder="请输入id搜索" v-model="input" class="input-with-select">

                <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
            </el-input>
            <el-button type="primary" @click="$store.state.show = true">添加用户</el-button>
            <!-- 添加用户组件-->
            <Add :fn='fn' :tableData='tableData' :size='size' :currentPage='currentPage' :table='table'></Add>
            <!-- 分配角色 -->
            <el-dialog title="分配角色" :visible.sync="$store.state.midd">
                <div>当前的用户 : {{user}}</div>
                <div class="juese">当前的角色 : {{juese}}</div>
                <div>分配新角色 ：
                    <el-select v-model="value" placeholder="请选择" @change='change(value)'>
                        <el-option v-for="(item,index) in options" :key="index" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="$store.state.midd= false">取 消</el-button>
                    <el-button type="primary" @click="fenpei(index)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 修改 -->
            <el-dialog title="修改用户" :visible.sync="$store.state.xiugai">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="ruleForm.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="tem">
                        <el-input v-model="ruleForm.tem"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="$store.state.xiugai = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm',id)">确 定</el-button>
                </div>
            </el-dialog>
            <el-table :data="table" border style="width: 100%">
                <el-table-column prop="id" label="#" width="50">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change='state(scope.row.id,scope.row.mg_state)'>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='180'>
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size='mini'
                            @click="xiugai(scope.row.id,scope.row.username,scope.row.email,scope.row.mobile)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="open(scope.row.id)">
                        </el-button>
                        <el-button type="warning" icon="el-icon-star-off" size='mini'
                            @click="fpsho(scope.row.username,scope.row.role_name,scope.row.id)">
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
    import Add from './add'
    import Http from './../../http/index'
    export default {
        props: {

        },
        data() {
            return {
                id: '',
                index: '',
                user: '',
                email: '',
                tem: '',
                show: null,
                juese: '',
                dialogFormVisible: false,
                midd: false,
                input: '',
                sizes: [1, 2, 3, 4, 5],
                table: [],
                sh: true,
                size: 3,
                currentPage: 1,
                tableData: [],
                ruleForm: {
                    name: '',
                    email: '',
                    tem: ''
                },
                rules: {
                    email: [{
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur'
                    }],
                    tem: [{
                        pattern: /^1[3-8]\d{9}$/,
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }],
                },
                options: [],
                value: ''
            };
        },
        methods: {
            change(index) {
                this.index = index;
                console.log(index)
            },
            fenpei(index) {
                this.$store.state.midd = false
                Http({
                    url: `/users/${this.id}/role`,
                    data: {
                        rid: index
                    },
                    method: 'put'
                }).then((res) => {
                    console.log(res)
                    this.fn()
                })
            },
            fpsho(user, juese, id) {
                this.$store.state.midd = true;
                this.user = user
                this.juese = juese;
                this.id = id
            },
            submitForm(formName, id) {
                console.log(this.ruleForm.tem)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.xiugai = false
                        Http(`/users/${String(id)}`).then((res) => {
                            console.log(res)
                            if (res.data.meta.status != 200) {
                                return this.$message.error('查询用户信息失败！')
                            } else {
                                Http({
                                    url: `/users/${this.id}`,
                                    data: {
                                        email: this.ruleForm.email,
                                        mobile: Number(this.ruleForm.tem)
                                    },
                                    method: 'put'
                                }).then((res) => {
                                    if (res.data.meta.status == 200) {
                                        this.$message.success('编辑用户信息成功！')
                                        this.fn();
                                    } else {
                                        return this.$message.error('编辑用户信息失败！')
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            xiugai(a, b, c, d) {
                this.$store.state.xiugai = true,
                    this.id = a
                this.ruleForm.name = b
                this.ruleForm.email = c
                this.ruleForm.tem = d
            },
            state(id, state) {
                Http({
                    url: `users/${id}/state/${state}`,
                    method: 'put'
                }).then((res) => {
                    if (res.data.meta.status !== 200)
                        return this.$message.error('修改状态失败！')
                })
            },
            sousuo() {
                Http(`/users/${Number(this.input)}`).then((res) => {
                    if (res.data.meta.status == 200) {
                        let a = [];
                        a[0] = res.data.data
                        this.table = a
                        this.sh = false
                        console.log(res)
                    } else {
                        this.table = []
                    }
                })
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
                    url: '/users',
                    params: {
                        pagenum: this.currentPage,
                        pagesize: this.size
                    }
                }).then((res) => {
                    this.tableData = res.data.data
                    this.table = this.tableData.users;
                })
            },
            open(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http({
                        url: `users/${id}`,
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
        },
        mounted() {
            this.fn()
            Http('/roles').then((res) => {
                console.log(res)

                this.options = res.data.data
            })
        },
        components: {
            Add,
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
</style>