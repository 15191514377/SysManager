<template>
    <div class="nav">
        <!-- 设置一级导航 -->
        <el-menu default-active="2" class="el-menu-vertical-demo" 
        @open="handleOpen" 
        :unique-opened="true">
            <el-submenu v-for="(first,id) in RouterList[0].children" :key="id" :index="first.index.toString()">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{ first.meta.title }}</span>
                </template>
                <el-menu-item-group>
                    <!-- 设置二级导航 -->
                    <el-menu-item @click.native.stop="ToSecondNav(first,second)" 
                    v-for="(second,id) in first.children" :key="id" 
                    v-show="second.meta.title.indexOf('子页面')===-1&&second.meta.title.indexOf('公告详情页')===-1&&second.meta.title.indexOf('公告分享')===-1&&second.meta.title.indexOf('详情')===-1&&second.meta.title.indexOf('用户添加')===-1"
                    :index="first.index+'-'+second.index">{{ second.meta.title }}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'SideBar',
    computed: {
        ...mapState('user', ['RouterList'])
    },
    methods: {
        navRouter() {
            this.$router.push('/notice')
        },
        handleOpen(key) {
            const nav = this.RouterList[0].children.filter(item=>item.index === ~~key)[0]
            if(nav.path.indexOf('/')===0){
                nav.path = nav.path.slice(1)
            }
            this.$router.push(`/sys/${nav.path}`)
        },
        ToSecondNav(first,second){
            this.$router.push(`/sys/${first.path}/${second.path}`)
        }
    },
}
</script>

<style lang="less" scoped>
    .nav {
        width: 20%;
        min-width: 150px;
        height: 100vh;
        position: sticky;
        top: 0px;
    }
</style>