<template>
    <div class="checked-role-list">
        <ul class="content">
            <li v-for="(role, index) in checkedRoleList" :key="index" @click="clickItemToUnclick(role)">{{ role.name }}</li>
            <li>xxxx</li>
            <li>xxxx</li>
            <li>xxxx</li>
            <li>xxxx</li>
            <li>xxxx</li>
        </ul>
        <div class="footer">
            <button @click.stop="roleReset()">重置</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'CheckedListRole',
    computed: {
        ...mapState('role', ['checkedRoleList'])
    },
    methods:{
        ...mapMutations('role',['check2unCheck','reset']),
        ...mapActions('role',['initRoleList']),
        clickItemToUnclick(role){
            this.check2unCheck(role)
        },
        // 重置
        roleReset(){
            this.reset()
        }
    }
}
</script>

<style lang="less" scoped>
.checked-role-list {
    min-height: 250px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid red;
    .content{
        height: 90%;
        min-height: 230px;
        display: flex;
        justify-content: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        li{
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
    .footer{
        margin-top: 10px;
        float: right;
        button{
            height: 20px;
            padding: 1px 3px;
            border-radius: 3px;
            border: 1px solid rgb(218, 209, 209);
        }
    }
}
</style>