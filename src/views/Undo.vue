<template>
    <div>
        <TodoList :mode="mode"></TodoList>
    </div>
</template>


<script>
import TodoList from '../components/TodoList'
import {VIEW_MODE} from '../util/constants'

export default {
    name: 'Undo',
    components: {
        TodoList
    },
    data() {
        return {
            mode: VIEW_MODE.UNDO
        }
    }
}
</script>
