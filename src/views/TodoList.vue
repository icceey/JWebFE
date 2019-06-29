<template>
    <div>
        <Row :gutter="20" v-for="row in rows" :key="row">
            <Col span="6" v-for="todo in todos.slice((row-1)*4, row*4)" :key="todo.id">
                <Card @click.native="curTodo=todo">
                    <p slot="title">
                        <Icon type="md-list"></Icon>
                        {{ todo.title }}
                    </p>
                    <a slot="extra" @click.stop="">
                        <Icon type="md-create"></Icon>
                        修改
                    </a>
                    <vue-markdown>{{ todo.content }}</vue-markdown>
                    <!-- <p style="word-break:break-word;">{{ todo.content }}</p> -->
                </Card>
            </Col>
        </Row>
        <Spin size="large" v-if="loading" fix></Spin>
        <TodoModal v-model="curTodo"></TodoModal>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import TodoModal from '../components/TodoModal'
import {RESPONSE} from '../util/constants'

export default {
    name: 'TodoList',
    components: {
        VueMarkdown,
        TodoModal
    },
    data() {
        return {
            loading: false,
            todos: [],
            curTodo: {}
        }
    },
    computed: {
        rows() {
            return Math.ceil(this.todos.length/4);
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.post('/todo/all')
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCEES) {
                        this.todos = response.data.data.todos
                    } else if(code === RESPONSE.FAIL)  {
                        this.$error(response.data.message)
                    }
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            });
        },
    }
}
</script>

<style scoped>
.ivu-row {
    margin-top: 20px;
}
p {
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
