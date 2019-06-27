<template>
    <Row :gutter="16">
        <Col span="2"><h1>倍忘露</h1></Col>
        <Col span="20">
            <Menu theme="light" mode="horizontal" :active-name="activeMenu">
                <MenuItem name="todo" to="/todo">事件清单</MenuItem>
                <MenuItem name="new" to="/new">新建备忘</MenuItem>
                <MenuItem name="done" to="/done">已完成</MenuItem>
            </Menu>
        </Col>
        <!-- <template v-if="isLogined"> -->
            <Col v-if="isLogined" span="2">
                <Dropdown @on-click="handleDropDown">
                    <Button size="large">
                        欢迎{{ user.username }}<Icon type="ios-arrow-down"></Icon>
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
            <Col v-if="!isLogined" span="1">
                <Button shape="circle" size="large" @click="changeLoginModalVisiable({visiable: true})">登录</Button>
            </Col>
            <Col v-if="!isLogined" span="1">
                <Button shape="circle" size="large" @click="changeRegisterModalVisiable({visiable: true})">注册</Button>
            </Col>
        <!-- </template> -->
        <LoginModal></LoginModal>
        <RegisterModal></RegisterModal>
    </Row>
</template>


<script>
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import {mapGetters, mapActions} from 'vuex'

export default {
    name: 'NavBar',
    components: {
        LoginModal,
        RegisterModal
    },
    data() {
      return {
        
      };
    },
    mounted() {
        this.getUser();
    },
    computed: {
        ...mapGetters(['user', 'isLogined']),
        activeMenu () {
            return this.$route.path.split('/')[1]
        },
    },
    methods: {
      ...mapActions(['changeLoginModalVisiable', 'changeRegisterModalVisiable', 'getUser', 'changeUser']),
      handleDropDown(command) {
          if(command === 'logout') this.logout()
          else if(command === 'profile') this.$router.push('/profile')
      },
      logout() {
        this.axios.post('/user/logout');
        this.changeUser({user: {}});
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
