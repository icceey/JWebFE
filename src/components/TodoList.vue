<template>
    <div>
        <Row :gutter="20" v-for="row in rows" :key="row">
            <Col span="6" v-for="todo in todos.slice((row-1)*4, row*4)" :key="todo.id">

                <Card @click.native="curTodo=todo">
                    <p slot="title">
                        <Icon type="md-list"></Icon>
                        {{ todo.title }}
                    </p>
                    <div v-if="mode===viewMode.UNDO" slot="extra">
                        <a @click.stop="editTodo=todo;todoEditorModalVisiable=true" style="margin-right: 5px">
                            <Icon type="md-create" />修改
                        </a>
                        <a @click.stop="doneTodo(todo)" style="color: green">
                            <Icon type="md-checkmark" />已完成
                        </a>
                    </div>
                    <div v-if="mode===viewMode.DONE" slot="extra">
                        <a @click.stop="doneTodo(todo)" style="margin-right: 5px">
                            <Icon type="ios-undo" />未完成
                        </a>
                        <a @click.stop="delTodo=todo" style="color: red">
                            <Icon type="md-trash" />删除
                        </a>
                    </div>
                    <vue-markdown :source="todo.content" :html="false"></vue-markdown>
                    <!-- <p style="word-break:break-word;">{{ todo.content }}</p> -->
                </Card>

            </Col>
        </Row>
        <infinite-loading  @infinite="loadMore">
            <div v-if="page>=2" slot="no-more">没有更多啦</div>
            <div v-if="page<2" slot="no-more"></div>
            <div slot="no-results">还没有备忘哦</div>
        </infinite-loading>
        <Spin size="large" v-if="loading" fix></Spin>
        <TodoModal v-model="curTodo"></TodoModal>
        <TodoEditorModal v-model="editTodo" :visiable="todoEditorModalVisiable" :mode="editorMode.EDIT"
                @on-visiable-change="todoEditorModalVisiable=$event" @input="input" />
        <Modal v-model="delModalVisiable" @on-cancel="delTodo={}">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>你将要删除备忘</p>
                <p>{{ delTodo.title }}</p>
                <p>该操作不可撤销,确认删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="deleteTodo">删除</Button>
                <Button size="large" @click="delTodo={}">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import TodoEditorModal from './TodoEditorModal'
import VueMarkdown from 'vue-markdown'
import InfiniteLoading from 'vue-infinite-loading'
import TodoModal from './TodoModal'
import {RESPONSE, VIEW_MODE, EDITOR_MODE} from '../util/constants'

export default {
    name: 'TodoList',
    components: {
        VueMarkdown,
        TodoModal,
        TodoEditorModal,
        InfiniteLoading
    },
    props: {
        mode: {
            type: String,
            default: VIEW_MODE.ALL
        }
    },
    data() {
        return {
            loading: false,
            page: 0,
            totPage: 1,
            todos: [],
            curTodo: {},
            editTodo: {},
            delTodo: {},
            todoEditorModalVisiable: false,
            delModalVisiable: false,
            viewMode: VIEW_MODE,
            editorMode: EDITOR_MODE
        }
    },
    computed: {
        rows() {
            return Math.ceil(this.todos.length/4);
        },
    },
    methods: {
        loadMore($state) {
            if(this.page >= this.totPage) {
                $state.complete()
                return ;
            }
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.get('/todo/all/' + this.mode, {
                    params: {
                        page: this.page
                    }
                })
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCEES) {
                        this.page ++
                        for(var i = 0; i < response.data.data.todos.length; i++) {
                            this.todos.push(response.data.data.todos[i])
                        }
                        this.totPage = response.data.data.tot
                        $state.loaded();
                    } else if(code === RESPONSE.FAIL)  {
                        this.$error(response.data.message)
                    }
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            });
        },
        doneTodo(todo) {
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.post('/todo/update/' + (this.mode === VIEW_MODE.UNDO ? 'done/' : 'undo/') + todo.id)
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                this.loading = false
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCEES) {
                        if(this.mode === VIEW_MODE.UNDO) this.$success('已移至已完成列表')
                        else this.$success('已移至未完成列表')
                        this.removeTodo(todo)
                    } else if(code === RESPONSE.FAIL)  {
                        this.$error(response.data.message)
                    }
                }
            }).catch(() => {
                this.loading = false
            });
        },
        deleteTodo() {
            var todo = this.delTodo
            this.delTodo = {}
            this.loading = true
            new Promise((resolve, reject) => {
                this.axios.post('/todo/delete/' + todo.id)
                .then(response => resolve(response))
                .catch(() => reject())
            }).then(response => {
                this.loading = false
                if(response.data) {
                    var code = response.data.code
                    if(code === RESPONSE.SUCCEES) {
                        this.$success('删除成功')
                        this.removeTodo(todo)
                    } else if(code === RESPONSE.FAIL) {
                        this.$error(response.data.message)
                    }
                }
            }).catch(() => {
                this.loading = false
            });
        },
        removeTodo(todo) {
            var idx = this.todos.findIndex((e) => e.id === todo.id)
            this.todos.splice(idx, 1)
        },
        input(value) {
            console.log(value)
            if(value && value.id) {
                console.log(value)
                var idx = this.todos.findIndex((e) => e.id === value.id)
                this.todos.splice(idx, 1, value)
            }
        }
    },
    watch: {
        delTodo(newValue) {
            this.delModalVisiable = !!newValue.id
        },
    }
}
</script>

<style scoped>
.ivu-row {
    margin-top: 20px;
}
.ivu-card {
    height: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
