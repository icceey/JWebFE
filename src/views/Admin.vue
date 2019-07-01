<template>
    <div>
        <Tabs value="user">
            <TabPane label="用户管理" name="user">
               <UserTable></UserTable>
            </TabPane>
            <!-- <TabPane label="" name="name2"></TabPane> -->
            <!-- <TabPane label="" name="name3"></TabPane> -->
        </Tabs>
    </div>
</template>


<script>
import UserTable from '../components/UserTable'

export default {
    name: 'Admin',
    components: {
        UserTable
    },
    data() {
        return {

        }
    }
}
</script>
