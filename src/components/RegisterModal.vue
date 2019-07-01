<template>
    <Modal v-model="registerModalVisiable" title="注册" footer-hide>
        <Form ref="formRegister" :model="formRegister" :rules="ruleRegister" :label-width="80">
            <formItem label="用户名" prop="username">
                <Input v-model="formRegister.username" placeholder="用户名" clearable />
            </formItem>
            <formItem label="密码" prop="password">
                <Input type="password" v-model="formRegister.password" placeholder="密码" />
            </formItem>
            <formItem label="确认密码" prop="password2">
                <Input type="password" v-model="formRegister.password2" placeholder="再次输入密码" @on-enter="register"/>
            </formItem>
            <formItem>
                <Button type="primary" :loading="loading" @click="register" long>注册</Button>
            </formItem>
        </Form>
    </Modal>
</template>

<script>
import { mapActions } from 'vuex';
import { PATTERN, RESPONSE } from '../util/constants'
import util from 'utility'

export default {
    name: 'RegisterModal',
    data() {
        const usernameCheck = (rule, value, callback) => {
            if(!PATTERN.USERNAME.test(value)) {
                callback(new Error('用户名只能包含大小写字母,数字以及下划线'))
            }
            callback()
        }
        const passwordCheck = (rule, value, callback) => {
            if(this.formRegister.password2 !== '') {
                this.$refs.formRegister.validateField('password2')
            }
            callback()
        }
        const password2Check = (rule, value, callback) => {
            if(value !== this.formRegister.password) {
                callback(new Error('两次密码不匹配'))
            }
            callback()
        }
        return {
            loading: false,
            formRegister: {
                username: '',
                password: '',
                password2: ''
            },
            ruleRegister: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'change'},
                    {validator: usernameCheck, trigger: 'change'}
                ],
                password: [
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
    computed: {
        registerModalVisiable: {
            get() {
                return this.$store.state.registerModalVisiable;
            },
            set(value) {
                this.changeRegisterModalVisiable({visiable: value});
            }
        }
    },
    methods: {
        ...mapActions(['changeRegisterModalVisiable']),
        register() {
            this.$refs.formRegister.validate(valid => {
                if(valid) {
                    this.loading = true
                    new Promise((resolve, reject) => {
                        this.axios.post('/user/register', {
                            username: this.formRegister.username,
                            password: util.md5(this.formRegister.password)
                        }).then(response => resolve(response))
                        .catch(() => reject())
                    }).then(response => {
                        this.loading = false
                        if(response.data) {
                            var code = response.data.code;
                            if(code === RESPONSE.SUCCESS) {
                                this.changeRegisterModalVisiable(false)
                                this.$success('注册成功')
                                this.formRegister.username = ''
                                this.formRegister.password = ''
                                this.formRegister.password2 = ''
                            } else if(code === RESPONSE.FAIL) {
                                this.$error(response.data.message)
                            }
                        }
                    }).catch(() => {
                        this.$error('嘤嘤嘤注册失败,请检查网络连接')
                        this.loading = false
                    })
                }
            })
            
        },
    }

}
</script>
