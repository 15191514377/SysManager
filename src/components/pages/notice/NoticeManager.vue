<template>
    <div class="notice-manager">
        <div class="head">
            <el-input placeholder="请输入标题名称" v-model="searchText" ref="search"
            :maxlength="20" suffix-icon="el-icon-search" @keyup.native.enter="submitSearch"></el-input>
            <el-button type="primary" plain @click.native.stop="toAddNoticePage">新增</el-button>
        </div>
        <div class="content">
            <el-table :data="noticeList" :fit="false" highlight-current-row row-class-name="rowStyle" cell-class-name="cellStyle" 
            header-cell-class-name="headerCellStyle"
            @row-click="headleRowClick">
                <el-table-column prop="noticeTitle" label="标题" width="180"></el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180">
                    <template slot-scope="notice">
                        <span>{{notice?.row?.publishTime?new Date(notice.row.publishTime).toLocaleString():""}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" label="创建者" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180">
                    <template slot-scope="notice">
                        <span>{{ notice?.row?.createTime?new Date(notice.row.createTime).toLocaleString():"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="notice">
                        <span @click.stop="allocatUser(notice?.row)">分配用户</span>
                        <span @click.stop="submitDeleteNotice(notice?.row)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'NoticeManager',
    data() {
        return {
            searchText:''
        }
    },
    computed: {
        ...mapState('notice', ['noticeList', 'checkNotice']),
        ...mapState('user',['checkedList'])
    },
    methods: {
        ...mapMutations('notice',['addNoticeToCheckNotice']),
        ...mapActions('notice',['getUserByNoticeId','searchNotice','deleteNotice','getNoticeUserList']),
        ...mapActions('user',['initUserList']),
        ...mapMutations('user',['uncheck2checkById']),
        addNotice() {
            this.$router.push('/notice/add')
        },
        // 跳转到公告用户分配页面
        share(notice) {
            const id = notice.id
            this.$router.push(`/notice/nShare/${id}`)
        },
        headleRowClick(row){
            if(row?.id) {
                this.addNoticeToCheckNotice(row.id)
                this.getNoticeUserList({notice:{id:row.id}})
                this.$router.push(`/sys/notice/nDetaile/${row.id}`)
            }
            else this.$message.warning({message:"无法跳转到详情页",duration:800})
        },
        async allocatUser(notice){
            if(notice?.id){
                this.addNoticeToCheckNotice(notice.id)
                await this.initUserList()
                const userList = await this.getUserByNoticeId(notice.id)
                userList.forEach(item=>{
                        if(item?.id) this.uncheck2checkById(item?.id)
                })
                localStorage.setItem('noticeUserCheckedList',JSON.stringify(this.checkedList))
                this.$router.push('/sys/notice/nShare')
            }else{
                this.$message.warning({message:'无法跳转到公告分配页面!',duration:800})
            }
        },
        submitSearch(){
            if(!this.searchText.trim()){
                this.$message.error({message:'输入不能为空!',duration:800})
                return
            }
            this.searchNotice({notice:{noticeTitle:this.searchText}}).then(res=>{
                if(res){
                    this.$refs.search.blur() 
                    this.searchText = ''
                }
            })
        },
        submitDeleteNotice(notice){
            this.deleteNotice({notice:{id:notice?.id}})
        },
        toAddNoticePage(){
            this.$router.push('/sys/notice/nAdd')
        }
    },
    mounted(){
        //通过vuex获取公告数据
        this.$store.dispatch('notice/initNoticeList')
    },
}
</script>

<style lang="less" scoped>
/deep/ .rowStyle{
    cursor: pointer;
}

/deep/ .cellStyle{
    text-align: center;
}

/deep/ .headerCellStyle{
    text-align: center;
}

/deep/ .el-input{
    display: inline-block;
    height: 25px;
    width: 250px;
}

.notice-manager {
    width: 1000px;
    height: 400px;
    padding: 10px;
    border: 1px solid red;

    .head {
        /deep/ .el-input{
            display: inline-block;
            height: 25px;
            width: 250px;
            input{
                height: 25px;
            }
            i{
                line-height: 27px;
            }
        }
        /deep/ .el-button{
            float: right;
            padding: 0px;
            margin-right: 100px;
            width: 50px;
            height: 25px;
            span{
                height: 100%;
                width: 100%;
                font-size: 12px;
                line-height: 1;
            }
        }
    }

    .content {
        margin-top: 25px;
        span{
            margin-right: 10px;
            &:hover{
                color:rgb(27, 153, 249);
            }
        }
    }
}
</style>