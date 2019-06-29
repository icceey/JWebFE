<template>
    <Modal v-model="visiable" :title="value.title" width="60%" footer-hide>
        <vue-markdown :source="value.content" :html="false" ></vue-markdown>
        <p style="text-align: right"> {{ datetime }} </p>
    </Modal>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
    name: 'TodoModal',
    components: {
        VueMarkdown
    },
    props: {
        value: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    mounted() {
        document.querySelectorAll(".ivu-modal-body").forEach((e) => {
            e.style.fontSize="18px";
        })
    },
    data() {
        return {
            visiable: false,
        }
    },
    computed: {
        datetime() {
            if(this.value.datetime) {
                return this.value.datetime.substring(0, 19).replace('T',' ')
            } else return ''
        }
    },
    watch: {
        value(newValue) {
            this.visiable = !!newValue.title
        },
        visiable(newValue) {
            if(!newValue) this.$emit('input', {})
        }
    }
}
</script>


<style scoped>

</style>
