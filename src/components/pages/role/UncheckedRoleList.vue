<template>
    <div class="role">
        <div class="role-head">
            <div class="role-search">
                <img src="../../../assets/sousuo.svg" alt="">
                <input type="text" placeholder="请输入角色名称" v-model="roleName" @keyup.enter="findRole">
            </div>
        </div>
        <ul class="list">
            <li v-for="(role, index) in unCheckedRoleList" :key="index" @click.stop="clickItemToCheck(role)">{{ role.name }}</li>
        </ul>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'UncheckedRoleList',
    data() {
        return {
            roleName: ''
        }
    },
    computed: {
        ...mapState('role', ['roleList', 'unCheckedRoleList'])
    },
    methods: {
        ...mapActions('role', ['initRoleList']),
        ...mapMutations('role',['findRoleList','unCheck2Check']),
        //根据name获取role
        findRole() {
            const name = this.roleName
            if (!name.trim()) {
                this.$message({
                    message: '请输入角色名称',
                    type: 'warning'
                })
            } else {
                const role = { name }
                this.axios.post('/api/role/getRole', role).then(({data})=>{
                    console.log(data,(data instanceof Array));
                    this.findRoleList(data)
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        //分配角色
        clickItemToCheck(role){
            this.unCheck2Check(role)
        }
    },
    mounted() {
        this.initRoleList()
    }
}
</script>

<style lang="less" scoped>
.role {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgb(198, 194, 194);

    .role-head {
        height: 20px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-content: center;

        .role-search {
            display: flex;
            align-content: center;

            img {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }

            input {
                font-size: 14px;
            }

        }
    }

    .list {
        width: 100%;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        li {
            display: block;
            height: 20px;
            padding: 0 5px;
            margin-right: 15px;
            margin-bottom: 10px;
            border-radius: 10px;
            border: 1px solid rgb(117, 205, 239);
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            cursor: pointer;
            &:hover{
                color:rgb(84, 134, 241);
                border: 1px solid rgb(84, 134, 241);
            }
        }
    }
}
</style>