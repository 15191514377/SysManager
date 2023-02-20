import axios from "axios";
import('@/util/axios')
import ArrayUtil from "@/util/ArrayUtil";
import { Message } from "element-ui";

export default  {
    namespaced:true,
    state:{
        permissionList:[],
        checkedList:[],
        uncheckedList:[],
        //登录用户的权限信息
        loginUserPermissionList:[]
    },
    mutations:{
        //初始化
        init(state){
            state.checkedList = []
            state.uncheckedList = ArrayUtil.flatArray(state.permissionList,'children')
        },
        //保存选中的权限信息
        saveClicked(state,permission){
            state.checkedList = Array(...permission)
            state.uncheckedList = ArrayUtil.deleteSameItemFromOtherArray( state.uncheckedList,state.checkedList)
        },
        //保存登录用户的权限信息
        saveLoginUserPermission(state,permission){
            state.loginUserPermissionList = new Array(...permission)
        },
        check2uncheckById({permissionList,checkedList,uncheckedList},permission){
            const changedPermission =ArrayUtil.flatArray(permissionList,'children').filter(e=>e?.id===permission?.id)
            if(changedPermission.length){
                checkedList = checkedList.filter(e=>e?.id!==permission?.id)
                uncheckedList.every(e=>e?.id!==permission?.id)?uncheckedList.push(changedPermission):''
            }
        },
        unchecked2checked({permissionList,checkedList,uncheckedList},permission){
            const changedPermission =ArrayUtil.flatArray(permissionList,'children').filter(e=>e?.id===permission?.id)
            if(changedPermission.length){
                uncheckedList = uncheckedList.filter(e=>e?.id!==permission?.id)
                checkedList.every(e=>e?.id!==permission?.id)?checkedList.push(changedPermission):''
            }
        }
    },
    actions:{
        initPermissionList:({state})=>{
            axios.get('/api/permission/getAll').then(({data})=>{
                state.permissionList = JSON.parse(JSON.stringify(data))
                state.uncheckedList = JSON.parse(JSON.stringify(data))
            }).catch(err=>{
                console.log(err);
            })
        },
        addPermission: async({state},playload)=>{
            const {data} = await axios({
                url:'/api/permission/add',
                method:'post',
                headers:{'Content-Type': 'multipart/form-data'},
                data:playload
            })
            const {err} = data
            console.log({err});
            if(err.code===1){
                const errInfo = err.reason.join(',')
                Message.error({message:`权限添加失败！[${errInfo}]重复`,duration:800})
                return Promise.reject(false)
            }else{
                return Promise.resolve(true)
            }
        },
        updatePermission:async({state},playload)=>{
            axios({
                url:'/api/permission/update',
                method:'post',
                headers:{'Content-Type': 'multipart/form-data'},
                data:playload
            })
        }
    }
}