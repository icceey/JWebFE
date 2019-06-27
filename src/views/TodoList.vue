<template>
    <div>
        <Row :gutter="20" v-for="row in rows" :key="row">
            <Col span="6" v-for="todo in todos.slice((row-1)*4, row*4)" :key="todo.id">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        {{ todo.title }}
                    </p>
                    <a href="#" slot="extra" @click.prevent="">
                        <Icon type="ios-loop-strong"></Icon>
                        Change
                    </a>
                    <p>{{ todo.content }}</p>
                </Card>
            </Col>
        </Row>
        <Spin size="large" v-if="loading" fix></Spin>
    </div>
</template>

<script>

import {RESPONSE} from '../util/constants'

export default {
    name: 'TodoList',
    data() {
        return {
            loading: false,
            todos: []
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
            this.loading = true;
            new Promise((resolve, reject) => {
                this.axios.post('/todo/all')
                .then(response => resolve(response))
                .catch(() => reject());
            }).then(response => {
                if(response.data) {
                    var code = response.data.code;
                    if(code === RESPONSE.SUCCEES) {
                        this.todos = response.data.data.todos;
                    } else if(code === RESPONSE.FAIL)  {
                        this.$error(response.data.message);
                    }
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
    }
}
</script>

<style scoped>
.ivu-row {
    margin-top: 20px;
}
</style>
