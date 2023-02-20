<template>
    <div class="permission">
        <div class="header">
            <el-tag>当前角色为：{{ checkedRoleList.length ? checkedRoleList[0].name : ' ' }}</el-tag>
        </div>
        <el-tree :data="navList" :props="props" show-checkbox node-key="id" ref="tree"
        :check-strictly="true"
        @check=handleCheck
        :default-checked-keys="checkedList.map(e=>e?.id)">
        </el-tree>
        <div class="bottom">
            <el-button type="danger" @click.native.stop="cancle()">取消全部</el-button>
            <el-button type="primary" @click.native.stop="confirm()">确认</el-button>
        </div>
    </div>
</template>

<script>
import ArrayUtil from '@/util/ArrayUtil'
import {mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: "PermissionList",
    data() {
        return {
            props: {
                label: 'name',
                children: 'children'
            },
        }
    },
    computed: {
        ...mapState('role', ['checkedRoleList']),
        ...mapState('nav',['navList','checkedList'])
    },
    methods: {
        ...mapMutations('nav',['uncheck2checkById','check2uncheckById','init']),
        ...mapActions('role',['allocatNav']),
        handleCheck(checkedNav,checkedList){
            const {checkedNodes} = checkedList
            if(checkedNodes.some(e=>e?.id===checkedNav?.id)){
                this.uncheck2checkById(checkedNav)
                this.uncheck2checkById({id:checkedNav?.fatherNavId})
            }else{
                this.check2uncheckById(checkedNav)
                const secondNavList = ArrayUtil.flatArray(this.navList,'children').filter(e=>e?.fatherNavId===checkedNav?.id)
                secondNavList.forEach(secondNav=>{
                    this.check2uncheckById(secondNav)
                })
            }
        },
        cancle() {
            this.$refs.tree.setCheckedKeys([])
        },
        confirm() {
            if (this.checkedRoleList.length !== 1) {
                this.$message.error({ message: '请选择一个角色', duration: 800 })
                return
            }
            const localNavList = JSON.parse(localStorage.getItem('RoleNavList')?localStorage.getItem('RoleNavList'):'[]')
            const diffNavList = ArrayUtil.getDifferent(localNavList,this.checkedList,'id')
            if(!diffNavList.length){
                this.$message.error({message:'请至少更改一项目录权限!',duration:800})
                return
            }
            this.allocatNav({diffNavList,roleId:this.checkedRoleList[0]?.id})
        }
    },
    updated() {
        this.$nextTick(() => {
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedKeys(this.checkedList.length ? this.checkedList.map(item => item.id) : [])
            }
        })
    },
}
</script>

<style lang="less" scoped>
.permission {
    height: inherit;

    .header {
        margin-bottom: 10px;

        /deep/ .el-tag {
            width: 200px;
        }
    }

    /deep/ .el-tree {
        padding: 10px 0px;
        border-radius: 5px;
        border: 1px solid rgb(204, 202, 202);
    }

    .bottom {
        float: right;
        margin-top: 10px;

        /deep/ .el-button {
            height: 25px;
            line-height: 10px;
        }
    }
}
</style>