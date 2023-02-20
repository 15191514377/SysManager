import axios from "axios"
import '@/util/axios'
import ArrayUtil from "@/util/ArrayUtil";
import { Message } from "element-ui";

export default {
    namespaced: true,
    state: {
        //全部的角色
        roleList: [],
        //选中的角色
        checkedRoleList: [],
        //未选中的角色列表
        unCheckedRoleList: [],
        //排序后的角色
        roleListBySort: [],
    },
    mutations: {
        //根据find内容，调整roleList中各个role出现的顺序
        findRoleList(state, findRoleList) {
            if (findRoleList instanceof Array) {
                console.log(111);
                findRoleList.forEach(item => {
                    state.checkedRoleList.forEach(role => {
                        if (item.id === role.id) {
                            const index = state.checkedRoleList.indexOf(role)
                            const slice = state.checkedRoleList.slice(index, index + 1)
                            state.checkedRoleList.splice(index, index + 1)
                            state.checkedRoleList.unshift(slice[0])
                        }
                    })
                    state.unCheckedRoleList.forEach(role => {
                        if (item.id === role.id) {
                            const index = state.unCheckedRoleList.indexOf(role)
                            const slice = state.unCheckedRoleList.slice(index, index + 1)
                            state.unCheckedRoleList.splice(index, index + 1)
                            state.unCheckedRoleList.unshift(slice[0])
                        }
                    })
                })
            }
        },
        //选中一个角色
        checkOne(state, role) {
            state.checkedRoleList = new Array(role)
        },
        // 未选中->选中
        unCheck2Check(state, role) {
            state.unCheckedRoleList.forEach(item => {
                if (item.id === role.id) {
                    state.unCheckedRoleList.splice(state.unCheckedRoleList.indexOf(item), 1)
                }
            })
            state.checkedRoleList.unshift(role)
        },
        // 选中->未选中
        check2unCheck(state, role) {
            state.checkedRoleList.forEach(item => {
                if (item.id === role.id) {
                    state.checkedRoleList.splice(state.checkedRoleList.indexOf(item), 1)
                }
            })
            state.unCheckedRoleList.unshift(role)
        },
        // 重置：所有选中->未选中
        reset(state) {
            state.checkedRoleList = []
            state.unCheckedRoleList = state.roleList
        }
    },
    actions: {
        //初始化
        initRoleList: ({state}) => {
            axios.get('/api/role/getAll').then(({data}) => {
                //深拷贝                
                state.roleList = JSON.parse(JSON.stringify(data))
                state.roleListBySort = JSON.parse(JSON.stringify(data))
                state.unCheckedRoleList = JSON.parse(JSON.stringify(data))
            }).catch(err => {
                console.log(err);
            })
        },
        //通过名称获取角色
        findRoleByName: ({state}, roleName) => {
            axios.post('/api/role/getRole', {name: roleName}).then(({data}) => {
                const temp1 = [...data, ...state.roleListBySort]
                const temp2 = [temp1[0]]
                for (let i = 0; i < temp1.length; i++) {
                    for (let j = 0; j < temp2.length; j++) {
                        if (temp1[i].id !== temp2[j].id) {
                            if (temp2.indexOf(temp1[i]) === -1) {
                                if (temp2.every(item => item.id !== temp1[i].id)) {
                                    temp2.push(temp1[i])
                                }
                            }
                        }
                    }
                }
                state.roleListBySort = temp2
            }).catch(err => {
                console.log(err);
            })
        },
        //获取角色关联的用户和权限
        async getUserAndPermission({rootState,commit,dispatch}, role) {
            //1.初始化
            // commit('user/init', null, {root: true})
            commit('permission/init', null, {root: true})
            commit('nav/init', null, {root:true})
            const {data} = await axios({
                url:'/api/role/getUserAndPermission',
                method:'post',
                data:{role}
            })

            const {navList,permissionList,userList} = data

            !rootState.nav.navList.length?dispatch('nav/initNavList',null,{root:true}):''
            navList.forEach(nav=>{
                commit('nav/uncheck2checkById',nav,{root:true})
            })
            localStorage.setItem('RoleNavList',JSON.stringify(navList))

            !rootState.permission.permissionList.length?dispatch('permission/initPermissionList',null,{root:true}):''
            permissionList.forEach(permission=>{
                commit('permission/unchecked2checked',permission,{root:true})
            })
            localStorage.setItem('PermissionList',JSON.stringify(permissionList))

            !rootState.user.userList.length?await dispatch('user/initUserList',null,{root:true}):''
            const diffUserList = ArrayUtil.getDifferent(userList,rootState.user.checkedList,'id')
            diffUserList.forEach(diffUser=>{
                rootState.user.checkedList.every(e=>e?.id!==diffUser?.id)?commit('user/uncheck2checkById',diffUser?.id,{root:true}):commit('user/check2uncheckById',diffUser?.id,{root:true})
            })
            localStorage.setItem('UserList',JSON.stringify(userList))
        },

        async allocatNav({dispatch,state},playload){
            const {data} = await axios({
                url:'/api/role/allotNav',
                method:'post',
                data:playload
            })
            const {code,reason} = data
            if(code===0){
                Message.success({message:'分配成功!',duration:800})
                state.checkedRoleList.length===1?dispatch('getUserAndPermission',state.checkedRoleList[0]):''
                return Promise.resolve(true)
            }else{
                Message.error({message:`[${reason.join(',')}]添加失败!`,duration:800})
                return Promise.resolve(false)
            }
        },

        async allocatUser({dispatch},playload){
            const {role} = playload
            const {data} = await axios({
                url:'/api/role/allocatUser',
                method:'post',
                data:playload
            })
            const {code,reason} = data
            if(code===0){
                Message.success({message:'更改成功!',duration:1000})
                dispatch('getUserAndPermission',role)
            }else{
                Message.error({message:`用户[${reason.join(',')}]更新失败!`,duration:1000})
            }
        }
    }
}