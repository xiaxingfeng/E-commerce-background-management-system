<template>
    <div class="box">
        <div class="logo"></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" prefix-icon="el-icon-user" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="ruleForm.password" prefix-icon="el-icon-lock" clearable show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Http from './../http/index.js'
    export default {
        props: {

        },
        data() {
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 16,
                            message: '长度在 6 到 16 个字符',
                            trigger: 'blur'
                        }
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http({
                            url: "/login",
                            data: {
                                username: this.ruleForm.username,
                                password: this.ruleForm.password,
                            },
                            method: 'post'
                        }).then((res) => {
                            console.log(res)
                            if (res.data.meta.status == 200) {
                                this.$message({
                                    showClose: true,
                                    message: '登录成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                        let {
                                            token
                                        } = res.data.data;
                                        sessionStorage.setItem('token', token)
                                        this.$router.push('/home')
                                        console.log(res.data)
                                    }
                                });
                            } else {
                                return this.$message.error('登录失败！')
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
            }
        },
        mounted() {

        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .box {
        width: 100%;
        height: 100%;
        background-color: #2B4B6B;
    }

    .el-form {
        width: 400px;
        height: 200px;
        background-color: white;
        border-radius: 8px;
        position: absolute;
        padding: 50px;
        padding-top: 120px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .el-button {
        width: 300px;
        height: 50px;
        margin-left: 50px;
    }

    .logo {
        position: absolute;
        border: 10px solid white;
        box-shadow: 0 0 2px #ccc;
        border-radius: 50%;
        background: url(./../assets/logo.png) no-repeat;
        background-size: 150px 150px;
        top: 26%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        z-index: 3;
        background-color: #EEEEEE;
    }
</style>