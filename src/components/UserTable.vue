<template>
    <div>
        <Table :columns="columns" :data="datas" :loading="loading" border stripe></Table>
        <Modal v-model="delModalVisiable" @on-cancel="delModalVisiable=false">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div v-if="delUser.row" style="text-align:center">
                <p>你将要删除用户</p>
                <p>{{ delUser.row.username }}</p>
                <p v-if="delUser.row.type>=userType[1].value" style="color: red">该用户具有管理权限</p>
                <p>删除操作不可撤销,确认删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="deleteUser(delUser)">删除</Button>
                <Button size="large" @click="delModalVisiable=false">取消</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import {RESPONSE} from '../util/constants'
import { mapGetters } from 'vuex';

export default {
    name: 'UserTable',
    data() {
        return {
            delModalVisiable: false,
            delUser: {},
            loading: false,
            columns: [{title: '用户名', key: 'username', render: (h, params) => h('strong', params.row.username)},
                {title: '昵称', key: 'nickname'},
                {title: '邮箱', key: 'mail'},
                {title: '电话', key: 'phone'},
                {title: '权限', key: 'type', width: 200, render: (h, params) => {
                    return h('div', [
                        h('Select', {
                            props: {
                                value: params.row.type,
                                disabled: params.row.type > this.user.type || params.row.id === this.user.id,
                            },
                            on: {
                                'on-change': (value) => this.changeType(params.row.id, value)
                            }
                        }, this.userType.map((e) => {
                            return h('Option', {
                                props: {
                                    value: e.value,
                                    key: e.value,
                                    disabled:  e.value > this.user.type
                                }
                            }, e.lable)
                        }))
                    ]);
                }},
                {title: '操作', key: 'action', width: 100, align: 'center', render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                disabled: params.row.type > this.user.type || params.row.id === this.user.id
                            },
                            on: {
                                click: () => this.showModal(params)
                            }
                        }, '删除')
                    ]);
                }}
            ],
            datas: [],
            userType: [{value: 0, lable: '用户'},
                {value: 1, lable: '管理员'},
                {value: 2, lable: '超级管理员'}
            ]
        }
    
    },
    activated() {
        this.loadUser()
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        loadUser() {
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.get('/user/all', {
                    params: {
                        
                    }
                }).then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                this.loading = false
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCESS) {
                        this.datas = response.data.data.users
                    } else if(code === RESPONSE.FAIL) {
                        this.$error(response.data.message)
                    }
                }
            }).catch(() => {
                this.loading = false
                this.$error('获取用户失败,请检查网络连接')
            })
        },
        changeType(id, type) {
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.post('/user/update/type/' + id + '/' + type)
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                this.loading = false
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCESS) {
                        this.$success('操作成功')
                    } else if(code === RESPONSE.FAIL) {
                        this.$error(response.data.message)
                    }
                }
            }).catch(() => {
                this.loading = false
                this.$error('操作失败,请检查网络连接')
            })
        },
        showModal(param) {
            this.delUser = param
            this.delModalVisiable = true
        },
        deleteUser (param) {
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.post('/user/delete/' + param.row.id)
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                this.loading = false
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCESS) {
                        this.$success('删除成功')
                        this.datas.splice(param.index, 1)
                        this.delUser = {}
                        this.delModalVisiable = false
                    } else if(code === RESPONSE.FAIL) {
                        this.$error(response.data.message)
                    }
                }
            }).catch(() => {
                this.loading = false
                this.$error('删除失败,请检查网络连接')
            })
        }
    }
}
</script>
