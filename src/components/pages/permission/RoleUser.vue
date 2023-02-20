<template>
    <ul class="RoleUser">
        <li>
            <RoleList />
        </li>
        <li>
            <UserList />
        </li>
    </ul>
</template>

<script>
import RoleList from '@/components/pages/permission/RoleList'
import UserList from '@/components/pages/permission/UserList';
export default {
    name:'RoleUser',
    components:{RoleList, UserList}
}
</script>

<style lang="less" scoped>
.RoleUser{
    padding: 10px 5px;
    li{
        display: inline-block;
        vertical-align: top;
    }
}
</style>