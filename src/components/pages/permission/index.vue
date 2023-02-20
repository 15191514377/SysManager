<template>
    <div class="permission-manager">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'PermissionManager',
}
</script>

<style lang="less" scoped>
.permission-manager{
    width: 80%;
    min-width: 800px;
    padding: 10px 5px;
    border: 1px solid gray;
    display: flex;
    .left{
        width: 30%;
    }
    .right{
        width: 70%;
        height: inherit;
    }

}
</style>