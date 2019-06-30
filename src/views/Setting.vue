<template>
    <Card dis-hover>
        <Form ref="formChangePassword" :model="formChangePassword" :rules="ruleChangePassword" :label-width="80">
            <formItem label="原密码" prop="password">
                <Input type="password" v-model="formChangePassword.password" placeholder="原密码" />
            </formItem>
            <formItem label="密码" prop="password1">
                <Input type="password" v-model="formChangePassword.password1" placeholder="密码" />
            </formItem>
            <formItem label="确认密码" prop="password2">
                <Input type="password" v-model="formChangePassword.password2" placeholder="再次输入密码" @on-enter="submit"/>
            </formItem>
            <formItem>
                <Button type="primary" :loading="loading" @click="submit" long>修改密码</Button>
            </formItem>
        </Form>
    </Card>
</template>

<script>
import { RESPONSE } from '../util/constants'
import util from 'utility'

export default {
    name: 'Setting',
    data() {
        const passwordCheck = (rule, value, callback) => {
            if(this.formChangePassword.password2 !== '') {
                this.$refs.formChangePassword.validateField('password2')
            }
            callback()
        }
        const password2Check = (rule, value, callback) => {
            if(value !== this.formChangePassword.password1) {
                callback(new Error('两次密码不匹配'))
            }
            callback()
        }
        return {
            loading: false,
            formChangePassword: {
                password: '',
                password1: '',
                password2: ''
            },
            ruleChangePassword: {
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'change'},
                ],
                password1: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'change'},
                    {validator: passwordCheck, trigger: 'blur'}
                ],
                password2: [
                    {required: true, message: '请确认密码', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'change'},
                    {validator: password2Check, trigger: 'blur'}
                ]
            },
        }
    },
    methods: {
        submit() {
            this.$refs.formChangePassword.validate(valid => {
                if(valid) {
                    this.loading = true
                    new Promise((resolve, reject) => {
                        this.axios.post('/user/update/password', {
                            password: util.md5(this.formChangePassword.password),
                            newPassword: util.md5(this.formChangePassword.password1)
                        }).then(response => resolve(response))
                        .catch(() => reject());
                    }).then(response => {
                        this.loading = false;
                        if(response.data) {
                            var code = response.data.code;
                            if(code === RESPONSE.SUCCESS) {
                                this.$success('修改成功');
                                this.formChangePassword.password = ''
                                this.formChangePassword.password1 = ''
                                this.formChangePassword.password2 = ''
                            } else if(code === RESPONSE.FAIL) {
                                this.$error(response.data.message);
                            }
                        }
                    }).catch(() => {
                        this.$error('嘤嘤嘤注册失败,请检查网络连接');
                        this.loading = false;
                    })
                }
            })
            
        },
    }

}
</script>


<style lang="less" scoped>
.ivu-card {
    margin: 0 5%;
    padding: 20px 5%;
    text-align: center;
    .ivu-form-item {
        margin: 20px 25%;
        width: 50%;
    }
}
</style>
