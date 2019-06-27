<template>
    <Modal v-model="loginModalVisiable" title="登录" footer-hide>
        <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" :label-width="80">
            <formItem label="用户名" prop="username">
                <Input v-model="formLogin.username" placeholder="用户名" learable />
            </formItem>
            <formItem label="密码" prop="password">
                <Input type="password" v-model="formLogin.password" placeholder="密码" @on-enter="login"/>
            </formItem>
            <formItem>
                <Button type="primary" :loading="loading" @click="login" long>登录</Button>
            </formItem>
        </Form>
    </Modal>
</template>


<script>
import {mapActions} from 'vuex'
import util from 'utility'
import {RESPONSE} from '../util/constants'

export default {
    name: 'LoginModal',
    data() {
        return {
            loading: false,
            formLogin: {
                username: '',
                password: '',
            },
            ruleLogin: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {max: 20, message: '最长20字符哦', trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        loginModalVisiable: {
            get() {
                return this.$store.state.loginModalVisiable;
            },
            set(visiable) {
                this.changeLoginModalVisiable({visiable: visiable});
            }
        }
    },
    methods: {
        ...mapActions(['changeUser', 'changeLoginModalVisiable']),
        login() {
            this.$refs.formLogin.validate(valid => {
                if(valid) {
                    this.loading = true
                    new Promise((resolve, reject) => {
                        this.axios.post('/user/login', {
                            username: this.formLogin.username,
                            password: util.md5(this.formLogin.password)
                        }).then(response => resolve(response))
                        .catch(() => reject())
                    }).then(response => {
                        this.loading = false
                        if(response.data) {
                            var code = response.data.code
                            if(code === RESPONSE.SUCCEES) {
                                this.changeLoginModalVisiable({visiable: false})
                                this.$success('登录成功')
                                this.changeUser({user: response.data.data.user || {}})
                            } else if(code === RESPONSE.FAIL) {
                                this.$error(response.data.message)
                            }
                        }
                    }).catch(() => {
                        this.$error('嘤嘤嘤登录失败,请检查网络连接')
                        this.loading = false
                    })
                }
            })
        },
        cancel() {
            if(this.$route.meta.requiredAuth) {
                this.$router.replace('/')
            }
        }
    }
}
</script>
