<template>
    <Row :gutter="16">
        <Col span="2"><h1>倍忘露</h1></Col>
        <Col span="18">
            <Menu theme="light" mode="horizontal" :active-name="activeMenu">
                <MenuItem name="todo" to="/todo">事件清单</MenuItem>
                <!-- <MenuItem name="?" to="/todo">草稿箱</MenuItem> -->
                <MenuItem name="done" to="/done">已完成</MenuItem>
                <!-- <MenuItem v-if="isAdmin" name="admin" to="/admin">后台管理</MenuItem> -->
            </Menu>
        </Col>
        <!-- <template v-if="isAuthed"> -->
            <Col v-if="isAuthed" span="2">
                <Button type="primary" size="large" @click="todoEditorModalVisiable=true">新建备忘</Button>
            </Col>
            <Col v-if="isAuthed" span="2">
                <Dropdown @on-click="handleDropDown">
                    <Button size="large">
                        欢迎{{ user.nickname || user.username }}<Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="profile">个人中心</DropdownItem>
                        <DropdownItem name="setting">设置</DropdownItem>
                        <DropdownItem name="logout" divided>退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        <!-- </template> -->
        <!-- <template v-else> -->
            <Col v-if="!isAuthed" span="2">
            </Col>
            <Col v-if="!isAuthed" span="1">
                <Button shape="circle" size="large" @click="changeLoginModalVisiable({visiable: true})">登录</Button>
            </Col>
            <Col v-if="!isAuthed" span="1">
                <Button shape="circle" size="large" @click="changeRegisterModalVisiable({visiable: true})">注册</Button>
            </Col>
        <!-- </template> -->
        <LoginModal />
        <RegisterModal />
        <TodoEditorModal :visiable="todoEditorModalVisiable" @on-visiable-change="todoEditorModalVisiable=$event" />
    </Row>
</template>


<script>
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import TodoEditorModal from './TodoEditorModal'
import {mapGetters, mapActions} from 'vuex'

export default {
    name: 'NavBar',
    components: {
        LoginModal,
        RegisterModal,
        TodoEditorModal
    },
    data() {
      return {
          todoEditorModalVisiable: false,
      };
    },
    mounted() {
        this.getUser();
    },
    computed: {
        ...mapGetters(['user', 'isAuthed', 'isAdmin']),
        activeMenu () {
            return this.$route.path.split('/')[1]
        },
    },
    methods: {
      ...mapActions(['changeLoginModalVisiable', 'changeRegisterModalVisiable', 'getUser', 'changeUser', 'clearAll']),
      handleDropDown(command) {
          if(command === 'logout') this.logout()
          else {
              this.$router.push('/' + command)
          }
      },
      logout() {
        this.axios.post('/user/logout');
        this.clearAll();
        this.$router.replace('/');
      }
    }
}
</script>


<style scoped>
.ivu-menu:after {
    content: none !important;
}
</style>
