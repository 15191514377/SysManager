<!-- 用户管理 -->
<template>
    <div class="user">
        <div class="head">
            <el-input placeholder="请输入用户名或账号" suffix-icon="el-icon-search" v-model="searchText" @keyup.native.enter="submitSearch"></el-input>
            <el-button type="primary" plain @click.native.stop="AddPageShow">新增</el-button>
            <el-button type="success" plain @click.native.stop="exportUsers">导出</el-button>
        </div>
        <div class="list" v-show="!UserAddShow">
            <el-table :data="userList" row-class-name="rowStyle" cell-class-name="cellStyle" 
            header-cell-class-name="headerCellStyle"
            @row-click="handleRowClick">
                <el-table-column prop="userId" label="账号" width="100px"></el-table-column>
                <el-table-column prop="username" label="用户名" width="100px"></el-table-column>
                <el-table-column prop="avatar" label="头像" width="100px">
                    <template slot-scope="user">
                        <el-image style="width: 30px;height: 30px;" :src="user.row.avatar" 
                        :preview-src-list="new Array(user.row.avatar)"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="50px">
                    <template slot-scope="user">
                        {{ user.row?.sex?'男':'女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="latestLogin" label="最后登录时间" width="150px">
                    <template slot-scope="user">
                        {{user?.row?.latestLogin?.loginTime?new Date(user?.row?.latestLogin?.loginTime).toLocaleString(): ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="isFreezed" label="状态" width="100px">
                    <template slot-scope="user">
                        {{ user.row?.isFreezed?'冻结':'未冻结' }}
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="150px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150px">
                    <template slot-scope="user">
                        {{ user.row?.createTime?new Date(user.row?.createTime).toLocaleString():'' }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作" width="200px">
                    <template slot-scope="user">
                        <el-button type="text" @click.native.stop="submitFreezeUser(user.row)" >{{user.row?.isFreezed?'解冻':'冻结'}}</el-button>
                        <el-button type="text">锁IP</el-button>
                        <el-button type="text">解IP</el-button>
                        <el-button type="text" @click.native.stop="submitDelete(user.row)" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <UserAdd v-show="UserAddShow" :changeShow="changeShow"/>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { saveAs } from 'file-saver'
import UserAdd from '@/components/pages/user/UserAdd';
export default {
    name: 'UserManager',
    data() {
        return {
            searchText: '',
            UserAddShow:false
        };
    },
    components:{UserAdd},
    computed: {
        ...mapState('user', ['userList', 'checkedList'])
    },
    methods: {
        ...mapActions('user', ['initUserList','lockIP','updateUserDetail','deleteUser','findUser']),
        ...mapMutations('user', ['updateUserList', 'deleteUserById']),
        //查找用户
        submitSearch() {
            if(this.searchText.trim()===''){
                this.$message.error({message:"输入不能为空!",duration:800})
                return
            }
            this.findUser({user:{userId:this.searchText.trim(),username:this.searchText.trim()}})
        },
        //冻结用户
        submitFreezeUser(user) {
            this.updateUserDetail({user:{id:user?.id,isFreezed:!user.isFreezed}}).then(flag=>{
                this.$message({
                    message:`该用户${user?.isFreezed?'解冻':'冻结'}${flag?'成功':'失败'}!`,
                    duration:800,
                    type:flag?'success':'error'
                })
            })
        },
        //锁ip,解ip
        lock(login) {
            if (login) {
                const ip = login.host;
                const lock = !login.lock
                this.lockIP({ ip, lock })
            }
        },
        // 删除用户
        submitDelete(user){
            if(user?.username){
                this.$confirm(`是否删除${user.username}?`,'提示',{
                    confirmButtonText:"删除",
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    if(user?.id){
                        this.deleteUser({user:{id:user.id}})
                    }
                }).catch(()=>{})
            }
        },
        handleRowClick(user){
            user?.id?this.$router.push(`/sys/user/uDetail/${user?.id}`):''
        },
        AddPageShow(){
            this.UserAddShow=true
        },
        //导出用户列表
        exportUsers() {
            this.axios.get('/api/excel/getUser', { responseType: 'blob' }).then(
                ({ data }) => {
                    saveAs(data, '用户列表.xlsx')
                }
            ).catch(err => {
                console.log(err);
            })
        },
        changeShow(){
            this.UserAddShow = !this.UserAddShow
        }
    },
    mounted() {
        this.initUserList()
    }
}
</script>

<style lang="less" scoped>
@bgcolor: rgb(196, 191, 194);

/deep/ .rowStyle{
    height: 25px;
    &:hover{
        cursor: pointer;
    }
}

/deep/ .cellStyle{
    height: 25px;
    font-size: 12px;
    text-align: center;
    span{
        &:hover{
            color: blue;
        }
    }
}

/deep/ .headerCellStyle{
    text-align: center;
}
.user {
    width: 100%;
    padding: 10px;
    min-width: 600px;
    min-height: 400px;
    position: relative;
    .head{
        /deep/ .el-input{
            width: 250px;
        }
        /deep/ .el-button{
            margin-left: 20px;
            float: right;
        }
    }    
    .list{
        margin-top: 50px;
        /deep/ .el-button{
            span{
                &:hover{
                    color: rgb(248, 70, 85);
                }
            }
            i{
                &:hover{
                        color: rgb(248, 70, 85);
                    }
            }
        }
    }
    /deep/ .UserAdd{
        position: absolute;
        top: 100px;
        left:250px;
    }
}
</style>