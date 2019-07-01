<template>
    <Card dis-hover>
        <Upload action="" :before-upload="upload" name="avatar" :show-upload-list="false"
                :format="['jpg','jpeg','png']" :max-size="1024*5" >
                <!-- :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"> -->
            <div class="avatar-editor">
                <div class="avatar-container">
                    <img class="avatar" :src="avatar"/>
                    <div class="avatar-mask">
                        <!-- <a @click.stop="upload"> -->
                            <div class="mask-content">
                                <Icon type="ios-camera" size="36"></Icon>
                                <p class="text">上传头像</p>
                            </div>
                        <!-- </a> -->
                    </div>
                </div>
            </div>
        </Upload>
        <!-- <div class="avatar-container">
            <img class="avatar" src="https://file.iviewui.com/dist/e1cf12c07bf6458992569e67927d767e.png"/>
        </div> -->
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
import { RESPONSE, PATTERN, SERVER} from '../util/constants';

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
            avatar: "",
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
        ...mapGetters(['user']),
    },
    mounted() {
        this.init()
        document.querySelector(".ivu-upload-select").style.borderRadius="50%";
    },
    methods: {
        ...mapActions(['changeUser']),
        init() {
            this.formProfile.nickname = this.user.nickname
            this.formProfile.mail = this.user.mail
            this.formProfile.phone = this.user.phone
            if(this.user.avatar) this.avatar = SERVER + '/static/user/avatar/' + this.user.avatar
            else this.avatar = SERVER + '/static/user/avatar/avatar.png'
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
                            if(code === RESPONSE.SUCCESS) {
                                this.$success('修改成功')
                                this.changeUser({user: res.data.data.user || {}})
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
        upload(avatar) {
            var formData = new FormData()
            formData.append('avatar', avatar)
            new Promise((resolve, reject) => {
                this.axios.post('/user/avatar/update', formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(res => resolve(res))
                .catch(() => reject())
            }).then(res => {
                if(res.data) {
                    var code = res.data.code
                    if(code === RESPONSE.SUCCESS) {
                        this.$success('修改成功')
                        this.avatar = avatar
                        this.changeUser({user: res.data.data.user || {}})
                                    .then(()=>this.init())
                    } else if(code === RESPONSE.FAIL) {
                        this.$error(res.data.message)
                    }
                }
            }).catch(() => {
                this.$error('嘤嘤嘤请检查网络连接')
            })
            return false
        }
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
.ivu-upload {
    width: 196px;
    height: 196px;
    margin: 20px 44%;
    border-radius: 50%;
}

.avatar-editor {
    width: 196px;
    height: 196px;
    border-radius: 50%;
    // margin: 20px 44%;
    .avatar-container {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        &:hover {
            cursor: pointer;
            .avatar-mask {
                opacity: .5;
            }
        }
        position: relative;
        .avatar {
            width: 100%;
            height: 100%;
            max-width: 100%;
            display: block;
            border-radius: 50%;
            box-shadow: 0px 0px 1px 0px;
        }
        .avatar-mask {
            transition: opacity .2s ease-in;
            z-index: 1;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: black;
            opacity: 0;
            .mask-content {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 3;
                color: #fff;
                font-size: 20px;
                text-align: center;
                transform: translate(-50%, -50%);
                .text {
                    white-space: nowrap;
                }
            }
        }
    }
}
.ivu-btn {
    margin: 10px 0;
}
</style>
