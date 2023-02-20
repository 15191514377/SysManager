<template>
    <div class="p-role">
        <div class="header">
            <el-input placeholder="请输入角色名称" prefix-icon="el-icon-search" v-model="searchValue"
                @keyup.native.enter="searchRole"></el-input>
            <el-tag type="info" @click.stop="searchRole">搜索</el-tag>
        </div>
        <div class="content">
            <ul>
                <li v-for="(role, id) in roleListBySort" :key="id" @click.stop="itemClick(role)">{{ role.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'RoleList',
    data() {
        return {
            searchValue: ''
        }
    },
    computed: {
        ...mapState('role', ['roleListBySort'])
    },
    methods: {
        ...mapActions('role', ['findRoleByName', 'getUserAndPermission','initRoleList']),
        ...mapMutations('role', ['checkOne']),
        //通过角色名查找角色
        searchRole() {
            if (!this.searchValue.trim()) {
                this.$message.error({ message: '请输入角色名称', duration: 1000 })
                return
            }
            this.findRoleByName(this.searchValue)
        },
        itemClick(role) {
            this.checkOne(role)
            this.getUserAndPermission(role)
        },
    },
    mounted(){
        this.initRoleList()
    }
}
</script>

<style lang="less" scoped>
.p-role {
    padding: 0 5px;

    .header {
        width: 100%;

        /deep/ .el-input {
            display: inline-block;
            width: 80%;

            input {
                height: 25px;
            }

            i {
                height: 25px;
                line-height: 1;
            }
        }

        /deep/ .el-tag {
            display: inline-block;
            width: 20%;
            padding: 0 5px;
            vertical-align: middle;
            cursor: pointer;

        }
    }

    .content {
        ul {
            border-radius: 5px;
            border: 1px solid rgb(226, 220, 220);
            min-height: 90vh;
            padding: 3px 5px;

            li {
                width: 100px;
                height: 25px;
                padding: 2px 7px;
                font-size: 12px;
                font-weight: 400;
                cursor: pointer;

                &:hover {
                    border-radius: 3px;
                    background-color: rgb(226, 220, 220);
                }
            }
        }
    }

}
</style>