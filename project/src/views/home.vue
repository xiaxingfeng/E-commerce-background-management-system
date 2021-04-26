<template>
    <div class="a">
        <el-container>
            <el-header>
                <div class="header">
                    <span>电商后台管理系统</span>
                    <el-button type="info" @click="tuichu">退出</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-row class="tac">
                        <el-col :span="12">
                            <el-menu default-active="2" class="el-menu-vertical-demo" background-color=" #333744"
                                text-color="#fff" active-text-color="#ffd04b" :router='isrouter'>
                                <el-submenu :index="String(item.id)" v-for="item in list" :key='item.id'>
                                    <template slot="title">
                                        <i :class="item.name"></i>
                                        <span>{{item.authName}}</span>
                                    </template>
                                    <el-menu-item :index="String(it.id)" v-for="it in item.children" :key='it.id'
                                        :route='{path:"/home/" + it.path}'>
                                        <i class="el-icon-menu"></i>
                                        {{it.authName}}
                                    </el-menu-item>
                                </el-submenu>
                            </el-menu>
                        </el-col>
                    </el-row>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Http from '../http/index'
    export default {
        props: {

        },
        data() {
            return {
                list: [],
                isrouter: true
            };
        },
        methods: {
            tuichu() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            }

        },
        mounted() {
            Http('/menus').then((res) => {
                this.list = res.data.data
                let arr = ['el-icon-user-solid', 'el-icon-s-help', 'el-icon-s-goods', 'el-icon-s-order',
                    'el-icon-s-platform'
                ]
                for (let i = 0; i < arr.length; i++) {
                    this.list[i].name = arr[i];
                }
                console.log(res)
            })
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .el-header {
        background-color: #333744;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .a,
    .el-container {
        height: 100%;
        overflow: hidden;
    }

    .el-menu {
        border: none;
    }


    .el-col {
        width: 200px;
    }

    .header {
        height: 60px;
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        align-items: center;
        color: white;
    }
</style>