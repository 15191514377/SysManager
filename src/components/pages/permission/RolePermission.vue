<template>
    <ul class="RolePermission">
        <li>
            <RoleList />
        </li>
        <li>
            <PermissionList />
        </li>
    </ul>
</template>

<script>
import RoleList from '@/components/pages/permission/RoleList';
import PermissionList from '@/components/pages/permission/PermissionList';
export default {
    name:'RolePermission',
    components:{RoleList,PermissionList}
}
</script>

<style lang="less" scoped>
.RolePermission{
    li{
        display: inline-block;
    }
}

</style>