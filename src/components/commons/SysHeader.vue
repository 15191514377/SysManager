<template>
    <div class="SysHeader">
        <div class="left">
            <img @click.stop="ToHomePage" src="@/assets/home.svg">
            <span @click.stop="ToHomePage">后台管理系统</span>
        </div>
        <div class="right">
            <el-popover
                v-show="noticeList.length"
                width="240"
                placement="left"
                trigger="hover">
                <ul class="notice-list">
                    <li v-for="(notice,id) in noticeList" :key="id" @click="ToNoticeDetailPage(notice)">
                        <span>{{ notice.noticeTitle }}</span>
                        <span>{{ notice.createUsername }} </span>
                        <span>{{ notice.publishTime?new Date(notice.publishTime).toLocaleString():'' }}</span>
                    </li>
                </ul>
                <div class="notice" slot="reference">
                    <el-badge :value="1" class="item">
                        <i class="el-icon-bell"></i>
                    </el-badge>
                </div>
            </el-popover>
            
        <div class="user-info">
            <img :src="loginedUser?.avatar?loginedUser.avatar:require('@/assets/renwu101.svg')">
            <el-popover
                placement="bottom"
                width="100"
                trigger="hover">
                <ul>
                    <li><el-link type="primary" :href="`/#/sys/user/uDetail/${loginedUser.id}`">个人中心</el-link></li>
                    <li><el-link type="danger" href="javascript:;" @click.native="submitExitLogin">退出登录</el-link></li>
                </ul>
                <span class="username" slot="reference">{{ loginedUser?.username }}</span>
            </el-popover>
        </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'SysHeader',
    data() {
        return{
            noticeList:[]
        }
    },
    computed: {
        ...mapState('user', ['loginedUser']),
    },
    methods: {
        ...mapActions('user',['exitLogin']),
        ToHomePage(){
            this.$router.replace('/sys')
        },
        submitExitLogin(){
            const loginTime = localStorage.getItem('loginTime')
            this.axios({
                url:'/api/user/exitLogin',
                method:'post',
                data:{user:{id:this.loginedUser.id,loginTime}}
            })
            this.$router.replace('/login')
        },
        getNoticeList(){
            this.axios({
                url:'/api/notice/userNoticeList',
                method:'post',
                data:{userId:this.loginedUser.id}
            }).then(({data})=>{
                console.log({data});
                this.noticeList = data.filter(e=>!e.isReaded).map(e=>e.noticeList).flat()
            })
        },
        ToNoticeDetailPage(notice){
            this.axios({
                url:'/api/notice/updateUserNotice',
                method:'post',
                data:{userNotice:{userId:notice.createUser,noticeId:notice.id}}
            })
            this.$router.push(`/sys/notice/nDetaile/${notice.id}`)
        }
    },
    mounted(){
        this.getNoticeList()
    }

}
</script>

<style lang="less" scoped>
/deep/ .el-popover{
    display: flex;
    justify-content: center;
}

.notice-list{
    li{
        display: flex;
        flex-wrap: wrap;
        padding: 5px 10px;
        border: none;
        box-shadow: 0 3px 4px -3px gray;
        cursor: pointer;
        span:first-child{
            width: 100%;
            font-size: 18px;
            text-align: center;
            color: rgb(84, 74, 74);
        }
        span:nth-child(2){
            font-size: 12px;
            width: 30%;
        }
        span:nth-child(3){
            width: 70%;
            font-size: 12px;
            text-align: right;
        }
    }
}

.SysHeader{
    min-width: 600px;
    border-bottom: 1px solid gray;
    box-shadow: 0px -3px 12px -1px rgb(182, 180, 180);
    display: flex;
    align-items: center;
    >div{
        display: flex;
        align-items: center;
    }
    .left{
        >*{
            margin-left: 20px;
            cursor: pointer;
        }
        flex-grow: 1;
        justify-content: flex-start;
        img{
            width: 50px;
            height: 50px;
        }
        >span{
            font-size: 30px;
            font-weight: 600;
            color: rgb(78, 75, 75);
        }
    }
    .right{
        flex-grow: 1;
        justify-content: flex-end;
        >*{
            margin-right: 40px;
        }
        >i{
            font-size: 60px;
        }
        >span{
            font-size: 30px;
            font-weight: 600;
            color: rgb(78, 75, 75);
        }
        .notice{
            cursor: pointer;
            /deep/ .el-badge{
                i{
                    font-size: 25px;
                }
            }
        }
        .user-info{
            margin-right: 50px;
            display: flex;
            align-content: center;
            >*{
                margin-right: 20px;
                cursor: pointer;
            }
            
            img{
                width: 50px;
                height: 50px;
                border-radius: 100%;
                margin-right: 20px;
            }
            span{
                display: flex;
                align-items: center;
                font-size: 18px;
                font-weight: 500;
                color: rgb(78, 75, 75);
                &:hover{
                    color:rgb(86, 190, 180);
                    text-shadow: 2px 2px 10px -2px rgb(86, 190, 180);
                }
            }
        }
    }
    
}

</style>