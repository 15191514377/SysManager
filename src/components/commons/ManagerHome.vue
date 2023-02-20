<template>
    <div class="home">
            <SysHeader/>
        <div class="content">
            <SideBar/>
            <router-view class="home-router-view"></router-view>
        </div>
    </div>
</template>

<script>
import SysHeader from '@/components/commons/SysHeader.vue'
import SideBar from '@/components/commons/SideBar.vue'
export default {
    name: 'ManagerHome',
    components: { SysHeader, SideBar }
}
</script>

<style lang="less" scoped>
.home{
    .content{
        display: flex;
        .home-router-view{
            width: 80%;
            min-width: 480px;
        }
    }
}
</style>