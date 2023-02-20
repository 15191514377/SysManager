import axios from "axios"
import '@/util/axios'
import ArrayUtil from '@/util/ArrayUtil'
import { Message } from "element-ui"
// 用户相关的vuex
export default {
    namespaced: true,
    state: {
        //保存登录成功的用户信息
        loginedUser: {},
        userList: [],
        checkedList: [],
        unCheckList: [],
        //存储用户详情页面的的用户信息
        detailUser: {},
        //存储用户的目录权限
        RouterList: []
    },
    mutations: {
        //初始化，清空checkedList，unCheckList为userList的深拷贝
        init(state) {
            state.checkedList = []
            state.unCheckList = JSON.parse(JSON.stringify(state.userList))
        },
        //保存用户的目录权限
        saveLoginUserRouterList(state,routerList){
            if((routerList instanceof Array)) state.RouterList = new Array(...routerList)
            else state.RouterList = new Array(routerList)
        },
        uncheck2check(state,user){
            state.checkedList.push(user)
            state.unCheckList.forEach((item,index)=>{
                if(item.id===user.id){
                    state.unCheckList.splice(index,1,null)
                }
            })
            state.unCheckList = state.unCheckList.filter(item=>item)
        },
        check2uncheck(state,user){
            state.unCheckList.push(user)
            state.checkedList.forEach((item,index)=>{
                if(item.id === user.id){
                    state.checkedList.splice(index,1,null)
                }
            })
            state.checkedList = state.checkedList.filter(item=>item) ? state.checkedList.filter(item=>item) : []
        },
        uncheck2checkById(state,userId){
            const user = state.userList.filter(item=>item.id === userId)
            if(user.length===1){
                state.checkedList.every(e=>e?.id!==userId)?state.checkedList.push(user[0]):''
                state.unCheckList = state.unCheckList.filter(e=>e?.id!==userId)
            }
        },
        check2uncheckById(state,userId){
            const user = state.userList.filter(item=>item.id===userId)
            if(user.length){
                if(!state.unCheckList.length){
                    state.unCheckList.push(user[0])
                    state.checkedList.forEach(item=>{
                        if(item.id === userId) item.delete = true
                    })
                }else{
                    if(state.unCheckList.every(item=>item.id!==userId)){
                        state.unCheckList.push(user[0])
                    }
                    state.checkedList.forEach(item=>{
                        if(item.id === userId) item.delete = true
                    })
                }
            } 

            state.checkedList = state.checkedList.filter(item=>!item?.delete)

            state.userList.forEach(item=>{
                if(item?.delete) delete item.delete
            })
        },
        //保存选中用户
        saveClicked(state, user) {
            state.checkedList = Array(...user)
            state.unCheckList.forEach((uncheck, index) => {
                state.checkedList.forEach(check => {
                    if (uncheck.id === check.id) {
                        state.unCheckList.splice(index, 1, null)
                    }
                })
            })
            if(state.unCheckList!==[]) state.unCheckList = state.unCheckList.filter(item => item)
        },
        //更新userList
        updateUserList: (state, user) => {
            state.userList.forEach(item => {
                if (item.id === user.id) {
                    state.userList.splice(state.userList.indexOf(item), 1, user)
                }
            })
        },
        // 清空detailUser，以便新添加用户
        emptyDetailUser: (state) => {
            state.detailUser = {}
        },
    },
    actions: {
        async initUserList({state,commit}) {
            const {data} = await axios({
                    url:'http://127.0.0.1:3000/api/user/getUsers', 
                    method: 'GET',
                })
            state.userList = data
            commit('init')
        },
        //通过用户名或id寻找用户
        findUserByNameOrId({state}, value) {
            axios.post('/api/user/getUsersByNameOrId', {value}).then(({data}) => {
                //TODO:用bug 数据为空会报错
                const checkList =  ArrayUtil.addItem(state.checkedList,data)
                const uncheckList = ArrayUtil.addItem(state.unCheckList,data)
                const userList = ArrayUtil.addItem(state.userList,data)
                
                state.unCheckList = ArrayUtil.deleteSameItem([...uncheckList,...state.unCheckList])
                state.checkList = ArrayUtil.deleteSameItem([...checkList,...state.checkList])
                state.userList = ArrayUtil.deleteSameItem([...userList,...state.userList])
            }).catch(err => {
                console.log(err);
            })
        },
        // 锁IP,解IP
        lockIP({state}, playload) {
            const {ip,lock} = playload
            axios.post('/api/user/lockIP', {ip,lock}).then(({data}) => {
                if (data.err === 0) {
                    // 更新userList,detailUser
                    state.userList.forEach(item => {
                        if (item.latestLogin && item.latestLogin.host === ip) {
                            item.latestLogin.lock = !item.latestLogin.lock
                        }
                    })
                    if (state.detailUser) {
                        if (state.detailUser.Logins) {
                            state.detailUser.Logins.forEach(item => {
                                if (item.host === ip) {
                                    item.lock = !lock
                                }
                            })
                        }
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 初始化detailUser
        initDetailUser({
            state
        }, id) {
            if (state.userList.length === 0) {
                axios.post('/api/user/getUserById', {
                        id
                    })
                    .then(({
                        data
                    }) => {
                        if (data.err === 0) {
                            state.detailUser = data.data
                        }
                    })
            } else {
                state.userList.forEach(item => {
                    if (item.id === id) {
                        state.detailUser = item
                    }
                })
            }
        },
        //获取用户对应的角色和权限
        async getRoleAndPermission(context,userId){
            const {data} = await axios({
                url:'/api/user/getRoleAndPermission',
                method:'post',
                data:{userId}
            })
            const {permissionList,navList} = data
            //为了实现动态路由，在localStorage中保存用户的目录权限
            localStorage.setItem('loginUserCatalogList',JSON.stringify(navList))
            context.commit('nav/upateNavListByLoginUserNavList',navList,{root:true})
            context.commit('permission/saveLoginUserPermission',permissionList,{root:true})
        },
        async updateUserDetail({dispatch},playload){
            const {data} = await axios({
                url:'/api/user/update',
                method:'post',
                data:playload
            })
            const {err} = data
            if(err.code===0){
                dispatch('initUserList')
                return Promise.resolve(true)
            } 
            else return Promise.resolve(true)
        },
        async deleteUser({dispatch},playload){
            const {data} = await axios({
                url:'/api/user/delete',
                method:'post',
                data:playload
            })
            const {err} = data
            if(err.code===0){
                Message.success({message:'该用户删除成功!',duration:800})
                dispatch('initUserList')
            }else{
                Message.error({message:'该用户删除失败!',duration:800})
            }
        },
        async findUser({state},playload){
            const {data} = await axios({
                url:'/api/user/find',
                method:'post',
                data:playload
            })
            const {err,userList} = data
            if(err.code===0&&userList.length){
                Message.success({message:'用户查找成功,请看前几列',duration:800})
                userList.forEach(item=>{
                    state.userList.sort((a)=>{
                        if(a?.id===item?.id) return -1
                        else return 1
                    })
                })
            }else{
                Message.error({message:'未找到该用户!',duration:800})
            }
        },
        async findUserByObj({state},playload){
            const {data} = await axios({
                url:'/api/user/findUserByObj',
                method:'post',
                data:playload
            })
            return Promise.resolve(data)
        },
        async getUserLoginInfo({state},playload){
            const {data} = await axios({
                url:'/api/user/getUserLogin',
                method:'post',
                data:playload
            })
            return Promise.resolve(data)
        },
        async addUser({dispatch},playload){
            const {data} = await axios({
                url:'/api/user/add',
                method:'post',
                data:playload
            })
            const {code,reason} = data
            if(code===1){
                Message.error({message:`[${reason.join(',')}]`,duration:1000})
                return Promise.resolve(false)
            }else{
                Message.success({message:'用户添加成功!',duration:1000})
                dispatch('initUserList')
                return Promise.resolve(true)
            }
        },
        async login({dispatch},playload){
            const {data} = await axios({
                url:'/api/user/login',
                method:'post',
                data:playload
            })
            if(data.code===0){
                data?.loginTime&&localStorage.setItem('loginTime',data.loginTime)
                return Promise.resolve(true)
            }else if(data.code===1){
                Message.error({message:'密码错误',duration:1000})
                return Promise.resolve(false)
            }else{
                Message.error({message:'账号已被冻结,请联系管理员',duration:1000})
                return Promise.resolve(false)
            }
        },
        async saveLoginedUser({state},payload){
            const {data} = await axios({
                url:'/api/user/findUserByObj',
                method:'post',
                data:payload
            })
            state.loginedUser = data[0]
        },
    }
}