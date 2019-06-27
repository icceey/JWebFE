<template>
    <Modal v-model="newTodoModalVisiable" title="新建备忘" width="80%" footer-hide>
        <Form ref="formTodo" :model="formTodo" label-position="top" >
            <FormItem label="事件标题" prop="title" >
                <Input v-model="formTodo.title" placeholder="事件标题" />
            </FormItem>
            <FormItem label="事件内容" prop="content">
                <MarkdownEditor v-model="formTodo.content" />
            </FormItem>
            <FormItem label="日期时间">
                <DatePicker type="date" v-model="formTodo.date" :options="dateOptions"  placeholder="选择日期" format="yyyy-MM-dd" style="width: 200px" show-week-numbers></DatePicker>
                <TimePicker type="time" v-model="formTodo.time"  placeholder="选择时间" format="HH:mm:ss"   style="width: 200px"></TimePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="submit">提交</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { mapActions } from 'vuex';

export default {
    name: 'NewTodoModal',
    components: {
        MarkdownEditor
    },
    data() {
        const dateCheck = (rule, value, callback) => {
            
        }
        const timeCheck = (rule, value, callback) => {

        }
        return {
            loading: false,
            formTodo: {
                title: '',
                content: '',
                date: '',
                time: ''
            },
            ruleTodo: {
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'},
                    {max: 20, message: '标题最长20字符哦', trigger: 'change'},
                ],
                content: [
                    {required: true, message: '请输入事件内容', trigger: 'blur'},
                ]
            },
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
        }
    },
    computed: {
        newTodoModalVisiable: {
            get() {
                return this.$store.state.newTodoModalVisiable;
            },
            set(visiable) {
                this.changeNewTodoModalVisiable({visiable: visiable});
            }
        },
        datetime() {
            var tmp = ''
            if(this.formTodo.date) {
                tmp = new Date(this.formTodo.date)
                if(this.formTodo.time) {
                    var tm = this.formTodo.time.split(':')
                    tmp.setHours(tm[0]);
                    tmp.setMinutes(tm[1]);
                    tmp.setSeconds(tm[2]);
                }
            }
            return tmp.toString()
        }
    },
    methods: {
        ...mapActions(['changeNewTodoModalVisiable']),
        submit() {
            
        },
    }
}
</script>


<style scoped>
.ivu-modal {
    height: 80%;
}
</style>
