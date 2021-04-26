<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
            <el-table :data="tableData" stripe style="width: 100%" border>
                <el-table-column prop="id" label="#" width="50">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="address" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag size="small" v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" size="small" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" size="small" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
    import Http from './../../http/index.js'
    export default {

        props: {

        },
        data() {
            return {
                tableData: []
            };
        },
        methods: {

        },
        components: {

        },
        mounted() {
            Http('/rights/list').then((res) => {
                this.tableData = res.data.data
                if (res.data.meta.status != 200) {
                    return this.$message.error('获取权限列表失败！')
                }
            })
        }
    };
</script>

<style scoped lang="less">
    .el-breadcrumb {
        margin-bottom: 20px;
    }
</style>