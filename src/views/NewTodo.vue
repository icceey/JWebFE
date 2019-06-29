<template>
    <div>
        <NewTodoModal></NewTodoModal>
    </div>
</template>

<script>
import NewTodoModal from '@/components/NewTodoModal'
import { mapActions } from 'vuex';

export default {
    name: 'NewTodo',
    components: {
        NewTodoModal
    },
    mounted() {
        this.changeNewTodoModalVisiable({visiable: true})
    },
    data() {
        return {
            
        }
    },
    methods: {
        ...mapActions(['changeNewTodoModalVisiable'])
    }
}
</script>
