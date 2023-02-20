<template>
    <div class="notice-share">
        <el-divider content-position="left"><span>{{ checkNotice?.noticeTitle }}</span> </el-divider> 
        <ul class="user-checked">
            <li v-for="(user,id) in checkedList" :key="id" @click="itemClick(user)">{{user?.username}}</li>
        </ul>
        <ul class="user-unchecked">
            <li v-for="(user,id) in unCheckList" :key="id" @click="itemClick(user)">{{ user?.username }}</li>
        </ul>
        <div class="btn">
            <el-button type="primary" plain @click.native.stop="submitAllotUser">确定</el-button> 
            <el-button plain type="danger" @click.native.stop="clearAllCheckedUser">取消全部</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import ArrayUtil from '@/util/ArrayUtil'
export default {
    name: 'NoticeShare',
    computed:{
        ...mapState('notice',['checkNotice']),
        ...mapState('user',['checkedList','unCheckList'])
    },
    methods:{
        ...mapMutations('user',['uncheck2checkById','check2uncheckById','init']),
        ...mapActions('notice',['alloctUser']),
        itemClick(user){
            if(user?.id){
                if(this.checkedList.some(item=>item.id===user.id)){
                    this.check2uncheckById(user.id)
                }else{
                    if(this.unCheckList.some(item=>item.id===user.id)){
                        this.uncheck2checkById(user.id)
                    }
                }
                
            }
        },
        submitAllotUser(){
            const checkedUserList =  JSON.parse(localStorage.getItem('noticeUserCheckedList')?localStorage.getItem('noticeUserCheckedList'):'[]')
            const updateUserList =  ArrayUtil.getDifferent(checkedUserList,this.checkedList,'id')
            const updateUserIdList = updateUserList.map(item=>item?.id)
            this.alloctUser(updateUserIdList).then(flag=>{
                if(flag) this.$router.push('/sys/notice/nManager')
            })
        },
        clearAllCheckedUser(){
            this.init()
        }
    }
}
</script>

<style lang="less" scoped>
.notice-share{
    padding: 10px 5px;
    ul:nth-of-type(0n+1){
        margin-bottom: 10px;
    }
    ul{
        width: 600px;
        height: 150px;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid rgb(173, 168, 168);
        li{
            display: inline-block;
            max-width: 80px;
            height: 20px;
            margin-right: 15px;
            font-size: 12px;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            &:hover{
                font-size: 13px;
                color: rgb(29, 65, 248);
                cursor: pointer;
            }
        }
    }
}
</style>