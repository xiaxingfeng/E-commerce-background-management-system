<template>

    <!-- 添加用户弹层-->
    <el-dialog title="添加用户" :visible.sync="$store.state.show">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input v-model="ruleForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="tem">
                <el-input v-model="ruleForm.tem"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="$store.state.show = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import Http from './../../http/index.js'
    // import qs from 'qs'
    export default {
        props: ['fn', 'table', 'tableData', 'currentPage', 'size'],
        data() {
            return {
                ruleForm: {
                    name: '',
                    pass: '',
                    email: '',
                    tem: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, ],
                    pass: [{
                            required: true,
                            message: '请输入用户名密码',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            message: '以字母开头，长度6~18位，只能包含字母、数字和下划线',
                            trigger: 'blur'
                        }
                    ],
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
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.show = false
                        Http({
                            url: '/users',
                            data: {
                                'username': this.ruleForm.name,
                                'password': this.ruleForm.pass,
                                'email': this.ruleForm.email,
                                'mobile': this.ruleForm.tem,
                            },
                            method: 'post'
                        }).then((res) => {
                            console.log(res)
                            if (res.data.meta.status == 201) {
                                this.$message.success('添加用户成功！')
                                this.fn()
                            } else {
                                return this.$message.error('添加用户失败！')
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
        },
        components: {

        },
    };
</script>

<style scoped lang="less">

</style>