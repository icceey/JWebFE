<template>
    <Modal v-model="visiable" :title="value.title" width="60%" footer-hide>
        <vue-markdown :source="value.content"></vue-markdown>
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
    data() {
        return {
            visiable: false,
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
.ivu-modal {
    height: 80%;
}
.ivu-modal-content {
    height: 80%;
}
</style>
