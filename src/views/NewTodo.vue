<template>
    <div>
        <NewTodoModal></NewTodoModal>    
    </div>
</template>

<script>
import NewTodoModal from '@/components/NewTodoModal'

export default {
    name: 'NewTodo',
    components: {
        NewTodoModal
    },
    data() {
        return {
            
        }
    }
}
</script>
