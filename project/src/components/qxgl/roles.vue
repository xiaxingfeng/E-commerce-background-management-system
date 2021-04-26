<template>
    <div id="roles">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tab">
            <el-input placeholder="请输入id搜索" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
            </el-input>
            <el-button type="primary" @click="show = true">添加角色</el-button>
            <!-- 添加角色 -->
            <el-dialog title="添加角色" :visible.sync="show">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="ruleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="ruleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="show = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑角色 -->
            <el-dialog title="编辑角色" :visible.sync="tj">
                <el-form :rules="tians" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="角色id" prop="tianId">
                        <el-input v-model="tians.tianId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="tianName">
                        <el-input v-model="tians.tianName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="tianDesc">
                        <el-input v-model="tians.tianDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="tj = false">取 消</el-button>
                    <el-button type="primary" @click="bian">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 分配权限 -->
            <el-dialog title="分配权限" :visible.sync="fenpei">
                <el-tree ref="tree" :data="rightTree" show-checkbox node-key="id" default-expand-all
                    :default-checked-keys="defaultCheckedKeys" :props='defaultProps'></el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="fenpei= false">取 消</el-button>
                    <el-button type="primary" @click="fpqx">确 定</el-button>
                </div>
            </el-dialog>


            <el-table :data="tableData" style="width: 100%" border stripe height='550'>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="item1 in scope.row.children" :key="item1.id" class="centerRow">
                            <!-- 这一列，专门渲染 一级权限 -->
                            <el-col :span="5">
                                <el-row class="haha">
                                    <el-tag closable @close="close(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-row>
                            </el-col>

                            <el-col :span="19">
                                <el-row v-for="item2 in item1.children" :key="item2.id" class="cent">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="close(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id"
                                            @close="close(scope.row,item1.id)">
                                            {{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>

                </el-table-column>
                <el-table-column label="#" prop="id" width='50'>
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" prop="desc" width='290'>
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size='mini'
                            @click="bianji(scope.row.id,scope.row.roleName,scope.row.roleDesc)">编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="open(scope.row.id)">删除
                        </el-button>
                        <el-button type="warning" icon="el-icon-star-off" size='mini'
                            @click="fen(scope.row,scope.row.id)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                fenpei: false,
                id: null,
                input: '',
                tj: false,
                show: false,
                tableData: [],
                rightTree: [],
                defaultCheckedKeys: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                ruleForm: {
                    roleName: '',
                    roleDesc: '',
                },
                tians: {
                    tianId: '',
                    tianName: '',
                    tianDesc: ""
                },
                rules: {
                    roleName: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                },
            };
        },
        methods: {
            fpqx() {
                this.fenpei = false
                const arr1 = this.$refs.tree.getCheckedKeys()
                const arr2 = this.$refs.tree.getHalfCheckedKeys()
                const rids = [...arr1, ...arr2].join(',')
                Http({
                    url: `roles/${this.id}/rights`,
                    data: {
                        rids: rids
                    },
                    method: 'post'
                }).then((res) => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('分配权限失败！')
                    }
                    this.$message.success('分配权限成功！')
                    this.fn()
                })
            },
            getLeafIds(node, keys) {
                if (!node.children) {
                    keys.push(node.id)
                } else {
                    node.children.forEach(item => this.getLeafIds(item, keys))
                }
            },
            mrxz(role) {
                const keys = []
                this.getLeafIds(role, keys)
                this.defaultCheckedKeys = keys
            },
            fen(role, id) {
                this.fenpei = true
                this.id = id,
                    Http('/rights/tree').then((res) => {
                        this.rightTree = res.data.data
                        console.log(res)
                        this.mrxz(role);
                    })
            },
            open(id) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http({
                        url: `roles/${id}`,
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
            bianji(id, name, desc) {
                this.tj = true
                this.tians.tianId = id
                this.tians.tianName = name
                this.tians.tianDesc = desc
            },
            bian() {
                this.tj = false
                Http({
                    url: `/roles/${this.tians.tianId}`,
                    data: {
                        roleName: this.tians.tianName,
                        roleDesc: this.tians.tianDesc
                    },
                    method: 'put'
                }).then((res) => {
                    console.log(res)
                    if (res.data.meta.status == 200) {
                        this.$message.success('编辑成功！')
                        this.fn()
                    } else {
                        return this.$message.error('编辑失败！')
                    }
                })
            },
            close(rowe, id) {
                console.log(rowe.id, id)
                Http({
                    url: `/roles/${rowe.id}/rights/${id}`,
                    method: 'delete'
                }).then((res) => {
                    console.log(res)
                    if (res.data.meta.status == 200) {
                        this.$message.success('删除权限成功！')
                        this.fn()
                    } else {
                        return this.$message.error('删除权限失败！')
                    }
                })
            },
            sousuo() {
                Http(`/roles/${this.input}`).then((res) => {
                    let a = []
                    a[0] = res.data.data
                    this.tableData = a;
                    console.log(res)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.show = false
                        Http({
                            url: '/roles',
                            data: {
                                roleName: `${this.ruleForm.roleName}`,
                                roleDesc: `${this.ruleForm.roleDesc}`
                            },
                            method: 'post'
                        }).then((res) => {
                            console.log(res)
                            if (res.data.meta.status != 201) {
                                return this.$message.error('添加角色失败')
                            } else {
                                this.$message.success('添加角色成功！')
                                this.fn()
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            fn() {
                Http('/roles').then((res) => {
                    if (res.data.meta.status != 200) {
                        return this.$message.error('获取角色列表失败！')
                    }
                    this.tableData = res.data.data
                })
            }
        },
        mounted() {
            this.fn()

        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
    }

    .el-table {
        margin-top: 20px;
    }

    .tab {
        padding: 20px;
        background: white;
    }

    .el-tag {
        margin: 10px 5px;
    }

    .el-row {
        display: flex;
        align-items: center;
        line-height: 100%;
        text-align: center;
    }

    .cent,
    .centerRow {
        border-top: 1px solid #ccc;
    }

    .cent:first-child {
        border-top: none;
    }

    .centerRow:last-child {
        border-bottom: 1px solid #ccc;
    }

    .input-with-select {
        width: 30%;
        margin-right: 20px;
    }
</style>