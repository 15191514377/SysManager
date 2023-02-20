<template>
    <div class="notice">
        <div class="head">
            <div class="title"><span>标题：{{checkNotice.noticeTitle}}</span></div>
            <div class="bottom">
                <div class="creater"><span>创建人：{{checkNotice.creater}}</span></div>
                <div class="create-time"><span>创建时间：{{new Date(checkNotice.createTime).toLocaleString()}}</span></div>
            </div>
        </div>
        <div class="content" ref="content"></div>
        <div class="appdendix" v-show="JSON.parse(checkNotice.noticeFileds).length">
            <el-divider content-position="left">附件</el-divider>
            <ul>
                <li  v-for="(file,index) in JSON.parse(checkNotice.noticeFileds)" :key="index">
                    <!-- 将预览链接转换为下载链接 -->
                    <el-link :href="file.url.replace('public','download')" :download="file.name" type="primary">{{file.name}}</el-link>
                </li>
            </ul>
        </div>
        <div class="user">
            <el-divider content-position="left">接收用户</el-divider>
            <ul>
                <li v-for="(user,id) in noticeUserList" :key="id"><span>{{user.username}}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'NoticeDetail',
    data(){
        return{
            notice:{}
        }
    },
    computed:{
        ...mapState('notice',['checkNotice','noticeUserList'])
    },
    methods:{
        ...mapActions('notice',['getNoticeById','getUserByNoticeId']),
        ...mapMutations('notice',['getAttachmentList']),
    },
    mounted(){
        setTimeout(()=>{
            this.$nextTick(()=>{
                const contentDiv = this.$refs.content
                contentDiv.innerHTML = this.checkNotice?.noticeContent
            })    
        },100)
    },
}
</script>

<style lang="less" scoped>
/deep/ .el-divider__text{
    color: gray;
    &:hover{
        color: aquamarine;
        cursor: pointer;
    }
}
.notice{
    width: 1000px;
    padding: 10px;
    border: 1px solid orchid;
    .head{
        width: 800px;
        height: 60px;
        margin: 0 auto;
        border-bottom: 2px solid rgb(173, 157, 157);
        text-align: center;
        .title{
            span{
                width: 100px;
                height: 40px;
                color:rgb(103, 94, 94);
                font-size: 18px;
            }
        }
        .bottom{
            height: 25px;
            width: 600px;
            margin: 0 auto;
            text-align: center;
            span{
                font-size: 10px;
            }
            .creater{
                display: inline-block;
                margin-right: 10px;
            }
            .create-time{
                display: inline-block;
                margin-left: 10px;
            }
        }
    }
    .content{
        width: 800px;
        height: 400px;
        margin: 0 auto;
        margin-top: 10px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid rgb(146, 134, 134);
    }
    .appdendix{
        width: 800px;
        margin: 10px auto 0;
    }
    .user{
        width: 800px;
        height: 100px;
        margin: 10px auto 0;
        ul{
            min-height: 100px;
            padding: 5px 10px;
            li{
                display: inline-block;
                padding: 3px 5px;
                font-size: 12px;
                &:hover{
                    color: rgb(39, 161, 243);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>