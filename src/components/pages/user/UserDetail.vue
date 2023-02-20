<template>
    <div class="UserDetail">
        <div class="base-info">
            <img v-if="user.avatar" :src="user.avatar">
            <img v-else src="@/assets/renwu101.svg">
            <ul class="right">
                <li><span>账号</span>:<span>{{user.userId}}</span></li>
                <li><span>用户名</span>:<span>{{user.username}}</span></li>
                <li><span>性别</span>:<span>{{user.sex?'男':'女'}}</span></li>
                <li><span>电话</span>:<span>{{user.phone}}</span></li>
                <li><span>邮箱</span>:<span>{{user.email}}</span></li>
            </ul>
        </div>
        <el-divider></el-divider>
        <div class="login-info">
            <el-table :data="loginListLimit10" ref="tree">
                <el-table-column prop="loginAddress" label="登录地点"></el-table-column>
                <el-table-column prop="host" label="登录IP"></el-table-column>
                <el-table-column prop="loginTime" label="登录时间">
                    <template slot-scope="login">
                        {{ login.row.loginTime?new Date(login.row.loginTime).toLocaleString():'' }}
                    </template>
                </el-table-column>
                <el-table-column prop="signOutTime" label="退出时间">
                    <template slot-scope="login">
                        {{ login.row.signOutTime?new Date(login.row.signOutTime).toLocaleString():'' }}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentPage"
                :page-size="10"
                :hide-on-single-pag="!loginList.length>10"
                :total="loginList.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name:'UserDetail',
    data(){
        return{
            user:{},
            loginList:[],
            page:1
        }
    },
    computed:{
        loginListLimit10:function(){
            return this.loginList.slice((this.page-1)*10,this.page*10)
        },
    },
    methods:{
        ...mapActions('user',['findUserByObj','getUserLoginInfo']),
        handleCurrentPage(currentPage){
            this.page =currentPage
        }
    },
    mounted(){
        const {id} = this.$route.params
        if(id){
            this.findUserByObj({user:{id}}).then(userList=>{
                if(userList.length===1){
                    this.user = userList[0]
                }else{
                    this.$message.error({message:'未找到该用户!',duration:1000})
                    this.$router.push('/sys/user/uManager')
                }
            })
            const userList = [{id}]
            this.getUserLoginInfo({userList}).then(userLoginList=>{
                this.loginList = userLoginList.filter(e=>e?.id===id).map(e=>e?.loginList)[0]
            })
        }else{
            this.$router.push('/sys/user/uManager')
        }
    }
}
</script>

<style lang="less" scoped>
.UserDetail{
    width: 800px;
    margin-left: 120px;
    border: 1px solid red;
    .base-info{
        width: 100%;
        height: 180px;
        display: flex;
        justify-content: center;
        .right{
            margin-left: 20px;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            li{
                border-bottom: 1px solid rgb(198, 195, 195);
                span:first-child{
                    display: inline-block;
                    height: 30px;
                    width: 80px;
                    font-size: 14px;
                    text-align-last: justify;
                    line-height: 30px;
                }
                span:last-child{
                    display: inline-block;
                    height: 30px;
                    width: 200px;
                    font-size: 14px;
                    color:blue;
                }
            }
        }
    }
    .login-info{
        height: 500px;
        position: relative;
        /deep/ .el-pagination{
            position: absolute;
            right: 10px;
            bottom: 10px;
        }
    }
}
</style>