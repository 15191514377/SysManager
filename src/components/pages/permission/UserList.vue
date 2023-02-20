<template>
    <div class="p-user">
        <div class="header">
            <div v-show="checkedRoleList.length" class="role">
                <el-tag >当前角色为：{{checkedRoleList.length?checkedRoleList[0].name:'' }}</el-tag>
            </div>
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchValue"
                @keyup.native.enter="searchUser()"></el-input>
            <el-tag type="info" @click.stop="searchUser">搜索</el-tag>
        </div>
        <div class="checked">
            <ul>
                <li v-for="(checked, id) in checkedList" :key="id" @click.stop="clickChecked(checked)">{{ checked.username }}</li>
            </ul>
        </div>
        <div class="unchecked">
            <ul>
                <li v-for="(unchecked, id) in unCheckList" :key="id" @click.stop="clickUncheck(unchecked)">{{ unchecked.username}}</li>
            </ul>
        </div>
        <div class="bottom">
            <el-button type="danger" @click.stop="cancle()">取消全部</el-button><el-button type="primary" @click.stop="confirm()">确定</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import ArrayUtil from '@/util/ArrayUtil'
export default {
    name: 'PUser',
    data() {
        return {
            searchValue: ""
        }
    },
    computed: {
        ...mapState('user', ['checkedList', 'unCheckList', 'userList']),
        ...mapState('role',['checkedRoleList'])
    },
    methods: {
        ...mapActions('user', ['initUserList', 'findUserByNameOrId']),
        ...mapActions('role',['allocatUser']),
        ...mapMutations('user', ['uncheck2check','check2uncheck','init']),
        searchUser() {
            if (!this.searchValue.trim()) {
                this.$message.error({ message: '请输入要搜索的内容', duration: 800 })
                return
            }
            this.findUserByNameOrId(this.searchValue)
        },
        clickChecked(checked){
            this.check2uncheck(checked)
        },
        clickUncheck(unchecked){
            this.uncheck2check(unchecked)
        },
        // 为角色分配用户
        confirm(){
            if(this.checkedRoleList.length !== 1){
                this.$message.error({message:'请选择一个角色',duration:1000})
                return
            }
            const localUserList  = JSON.parse(localStorage.getItem('UserList'))
            const userList =  ArrayUtil.getDifferent(localUserList,this.checkedList,'id')
            if(!userList.length){
                this.$message.error({message:'请更改分配的用户!',duration:1000})
                return
            }
            this.allocatUser({userList,role:this.checkedRoleList[0]})
        },
        cancle(){
            this.init()
        }
    },
}
</script>

<style lang="less" scoped>
.p-user {
    padding: 0 5px;
    .header {
        width: 100%;
        min-width: 500px;
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
            vertical-align: middle;
            cursor: pointer;
        }
        .role{
            /deep/ .el-tag{
                width: 200px;
            }
            margin-bottom: 5px;
        }
    }

    .checked,
    .unchecked {
        width: 100%;
        height: 35vh;
        min-width: 500px;
        min-height: 180px;
        padding: 5px 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        border: 1px solid rgb(214, 210, 210);
        ul{

            li{
                display: inline-block;
                widows: 50px;
                height: 25px;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:hover{
                    color:rgb(65, 232, 244);
                    cursor: pointer;
                }    
            }
        }
    }
    .bottom{
        float: right;
        /deep/ .el-button{
            line-height: 1;
        }
    }
}
</style>