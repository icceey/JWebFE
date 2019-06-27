<template>
  <div id="app">
    <Layout>
      <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <NavBar></NavBar>
      </Header>
      <Content :style="{padding: '0 50px'}">
          <router-view></router-view>
      </Content>
      <!-- <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer> -->
    </Layout>
  </div>
</template>

<script>
import NavBar from './components/NavBar';

export default {
  name: 'app',
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.layout-footer-center{
    text-align: center;
}
.ivu-layout {
  background: #fff !important;
}
.ivu-layout-content {
    margin-top: 48px;
    padding: 0 2%;
}

</style>
