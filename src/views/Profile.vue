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
                <Button @click="reset" :disabled="loading" long>重置</Button>
            </formItem>
        </Form>
    </Card>
</template>


<script>
import {mapGetters, mapActions} from 'vuex'

export default {
    name: 'Profile',
    data() {
        return {
            loading: false,
            formProfile: {
                nickname: '',
                mail: '',
                phone: ''
            },
            ruleProfile: {
                username: [
                    {max: 20, message: '最长20字符哦', trigger: 'blur'}
                ],
                mail: [
                    {max: 20, message: '最长20字符哦', trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        ...mapActions(['changeUser']),
        save() {
            new Promise(resolve => {
                
            })
        },
        reset() {
            this.formProfile.nickname = this.user.nickname
            this.formProfile.mail = this.user.mail
            this.formProfile.phone = this.user.phone
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
