<template>
    <Card dis-hover>
        <div class="avatar-container">
            <img class="avatar" src="https://file.iviewui.com/dist/e1cf12c07bf6458992569e67927d767e.png"/>
        </div>
        <Divider/>
        <Form ref="formProfile" :model="formProfile" :rules="ruleProfile" :label-width="80">
            <FormItem label="昵称" prop="nickname">
                <Input v-model="formProfile.nickname" placeholder="昵称" />
            </FormItem>
            <FormItem label="邮箱" prop="mail">
                <Input v-model="formProfile.mail" placeholder="邮箱" />
            </FormItem>
            <FormItem label="手机号" prop="phone">
                <Input v-model="formProfile.phone" placeholder="手机号" />
            </FormItem>
            <formItem>
                <Button type="primary" :loading="loading" @click="save" long>保存</Button>
                <Button @click="init" :disabled="loading" long>重置</Button>
            </formItem>
        </Form>
    </Card>
</template>


<script>
import {mapGetters, mapActions} from 'vuex'
import { RESPONSE, PATTERN } from '../util/constants';

export default {
    name: 'Profile',
    data() {
        const mailCheck = (rule, value, callback) => {
            if(value && !PATTERN.EMAIL.test(value)) callback(new Error('邮箱格式不合法'))
            callback()
        }
        const phoneCheck = (rule, value, callback) => {
            if(value && !PATTERN.PHONE.test(value)) callback(new Error('电话格式不对哦'))
            callback()
        }
        return {
            loading: false,
            formProfile: {
                nickname: '',
                mail: '',
                phone: ''
            },
            ruleProfile: {
                nickname: [
                    {max: 20, message: '最长20字符哦', trigger: 'blur'}
                ],
                mail: [
                    {max: 30, message: '最长30字符哦', trigger: 'blur'},
                    {validator: mailCheck, trigger: 'blur'}
                ],
                phone: [
                    {max: 15, message: '最长15字符哦', trigger: 'blur'},
                    {validator: phoneCheck, trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    mounted() {
        this.init()
    },
    methods: {
        ...mapActions(['changeUser']),
        init() {
            this.formProfile.nickname = this.user.nickname
            this.formProfile.mail = this.user.mail
            this.formProfile.phone = this.user.phone
        },
        save() {
            this.$refs.formProfile.validate(valid => {
                if(valid) {
                    this.loading = true
                    new Promise((resolve, reject) => {
                        this.axios.post('/user/profile/update', {
                            nickname: this.formProfile.nickname,
                            mail: this.formProfile.mail,
                            phone: this.formProfile.phone
                        }).then(res => resolve(res))
                        .catch(() => reject())
                    }).then(res => {
                        this.loading = false
                        if(res.data) {
                            var code = res.data.code
                            if(code === RESPONSE.SUCCEES) {
                                this.$success('修改成功')
                                this.changeUser({user: res.data.data.user || {}})
                                    .then(()=>this.init())
                            } else if(code === RESPONSE.FAIL) {
                                this.$error(res.data.message)
                            }
                        }
                    }).catch(() => {
                        this.$error('嘤嘤嘤请检查网络连接')
                        this.loading = false
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
.avatar-container {
    position: relative;
    left: 50%;
    transform: translate(-50%);
    z-index: 10;
    .avatar {
        width: 196px;
        height: 196px;
        border-radius: 50%;
        z-index: 10;
        border: 1px solid #ddd;
    }
}
.ivu-btn {
    margin: 10px 0;
}
</style>
