<template>
    <div class="permission-add">
        <el-table :data="permissionList" row-key="id"
        header-cell-class-name="headerCellStyle"
        :tree-props="{children:'children',hasChildren:'hasChildren'}">
            <el-table-column prop="className" label="名称" width="220px"></el-table-column>
            <el-table-column prop="type" label="权限类型" width="100px">
                <template slot-scope="permission">
                    <span>{{ permission.row.type===1?'页面权限':'' }}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" label="操作">
                <template slot-scope="permission">
                    <el-button :disabled="Boolean(permission.row?.parentId)" type="primary" plain icon="el-icon-plus" circle></el-button>
                    <el-button type="success" plain icon="el-icon-edit" circle></el-button>
                    <el-button type="danger" plain icon="el-icon-delete" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name:'PermissionAdd',
    computed:{
        ...mapState('permission',['permissionList'])
    },
    methods:{
        ...mapActions('permission',['initPermissionList'])
    },
    mounted(){
        this.initPermissionList()
    }
}
</script>

<style lang="less" scoped> 
.permission-add{
    /deep/ .headerCellStyle{
        text-align: center;
    }
}
</style>