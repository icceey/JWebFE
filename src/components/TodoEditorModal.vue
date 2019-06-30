<template>
    <Modal v-model="thisVisiable" :title="title" width="80%" footer-hide>
        <Form ref="formTodo" :model="formTodo" :rules="ruleTodo" label-position="top" >
            <FormItem label="事件标题" prop="title" >
                <Input v-model="formTodo.title" placeholder="事件标题" />
            </FormItem>
            <FormItem label="事件内容" prop="content">
                <MarkdownEditor v-model="formTodo.content" />
            </FormItem>
            <FormItem label="日期时间" prop="datetime">
                <DatePicker type="date" v-model="formTodo.date" :options="dateOptions"  
                        placeholder="选择日期" format="yyyy-MM-dd" style="width: 200px" show-week-numbers>
                </DatePicker>
                <TimePicker type="time" v-model="formTodo.time" :steps="[1,5]" 
                        :disabled-hours="disableHours" :disabled-minutes="disableMins"  
                        placeholder="选择时间" format="HH:mm" style="width: 200px">
                </TimePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="submit">提交</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { RESPONSE, EDITOR_MODE } from '../util/constants';

export default {
    name: 'TodoEditorModal',
    components: {
        MarkdownEditor
    },
    props: {
        visiable: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: EDITOR_MODE.NEW,
        },
        value: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            loading: false,
            title: '新建备忘',
            thisVisiable: false,
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
                ],
            },
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
        }
    },
    computed: {
        datetime() {
            var tmp = ''
            if(this.formTodo.date) {
                tmp = new Date(this.formTodo.date)
                if(this.formTodo.time) {
                    var tm = this.formTodo.time.split(':')
                    tmp.setHours(tm[0])
                    tmp.setMinutes(tm[1])
                }
            }
            return tmp.valueOf()
        },
        disableHours() {
            var dt = new Date()
            if(new Date(this.datetime).getDay() === dt.getDay())
                return [...Array(dt.getHours()).keys()]
            return []
        },
        disableMins() {
            var dt = new Date()
            if(this.disableHours.length > 0 && new Date(this.datetime).getHours() === dt.getHours())
                return [...Array(dt.getMinutes()+1).keys()]
            return []
        }
    },
    methods: {
        submit() {
            this.$refs.formTodo.validate(valid => {
                if(valid) {
                    if(this.datetime && new Date(this.datetime).valueOf() < Date.now()) {
                        this.$error('这个时间已经过了哦')
                        return ;
                    }
                    this.loading = true
                    var url = '/todo/add'
                    var dat = {}
                    if(this.mode === EDITOR_MODE.EDIT) {
                        url = '/todo/update/'+this.value.id
                        dat = this.value
                    }
                    dat.title = this.formTodo.title
                    dat.content = this.formTodo.content
                    dat.datetime = this.datetime
                    new Promise((resolve, reject) => {
                        this.axios.post(url, dat)
                        .then(res => resolve(res))
                        .catch(() => reject())
                    }).then(res => {
                        this.loading = false
                        if(res.data) {
                            var code = res.data.code
                            if(code === RESPONSE.SUCCEES) {
                                if(this.mode === EDITOR_MODE.NEW) this.$success('添加成功')
                                else {
                                    this.$success('修改成功')
                                    dat.datetime = new Date(dat.datetime).format('yyyy-MM-dd hh:mm:ss')
                                    this.$emit('input', dat)
                                }
                                this.thisVisiable = false
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
    },
    watch: {
        thisVisiable(newValue) {
            this.$emit('on-visiable-change', newValue)
        },
        visiable(newValue) {
            this.thisVisiable = newValue
        },
        value(newValue) {
            if(newValue.id) {
                this.formTodo.title = newValue.title
                this.formTodo.content = newValue.content
                if(newValue.datetime) {
                    this.formTodo.date = newValue.datetime.substring(0,10)
                    this.formTodo.time = newValue.datetime.substring(11,19)
                }
                this.title = '修改备忘'
            }
        }
    }
}
</script>

