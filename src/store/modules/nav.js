import axios from 'axios'
import '@/util/axios'
import ArrayUtil from '@/util/ArrayUtil'
import {Message} from 'element-ui'

export default {
    namespaced: true,
    state: {
        navList: [],
        checkedList:[],
        uncheckedList:[]
    },
    mutations: {
        //根据用户的RouterList更新navList，实现动态路由
        upateNavListByLoginUserNavList(state,navList){
            if(navList instanceof Array) state.navList = new Array(...navList)
            else state.navList = new Array(navList)
        },
        init(state){
            state.checkedList = []
            state.uncheckedList =ArrayUtil.flatArray(state.navList,'children')
        },
        check2uncheckById(state,nav){
            const changedNav = ArrayUtil.flatArray(state.navList,'children').filter(e=>e?.id===nav?.id)
            if(changedNav.length===1){
                state.checkedList = state.checkedList.filter(e=>e?.id!==nav?.id)
                state.uncheckedList.every(e=>e?.id!==nav?.id)?state.uncheckedList.push(changedNav[0]):''
            }
        },
        uncheck2checkById({checkedList,uncheckedList,navList},nav){
            const changedNav = ArrayUtil.flatArray(navList,'children').filter(e=>e?.id===nav?.id)
            if(changedNav.length===1){
                uncheckedList =  uncheckedList.filter(e=>e?.id!==nav?.id)
                checkedList.every(e=>e?.id!==nav?.id)?checkedList.push(changedNav[0]):''
            }
        }
    },
    actions: {
        //初始化导航列表
        async initNavList({state}) {
            const {data} = await axios({
                url:'/api/nav/getNavs',
                method:'get'
            })
            state.navList = data
            state.navList.sort((a, b) => a.index - b.index)
        },
        // 删除导航信息
        async deleteNav({dispatch}, playload) {
            const {data} = await axios({
                url:'/api/nav/delete',
                method:'post',
                data:playload
            })
            const {code} = data
            if(code===0){
                Message.success({message:'该目录删除成功!',duration:800})
                dispatch('initNavList')
            }else{
                Message.error({message:'该目录删除失败!',duration:800})
            }
        },
        //更新导航信息
        updateNav: async ({dispatch},playload)=>{
            const {data} = await axios({
                url:'/api/nav/update',
                method:'post',
                data: playload
            })
            const {code,reason} = data
            if(code===1){
                Message.error({message:`[${reason.join(',')}]字段重复,目录修改失败!`,duration:800})
                return Promise.resolve(false)
            }else if(code===0&&reason.length){
                Message.error({message:`${reason[0]}!`,duration:800})
                return Promise.resolve(false)
            }else{
                dispatch('initNavList')
                Message.success({message:'目录修改成功',duration:800})
                return Promise.resolve(true)
            }
        },
        //添加导航信息
        addNav:async({dispatch},playload)=>{
            const {data} = await axios({
                url:'/api/nav/add',
                method:'post',
                data:playload
            })
            if(data.code===0){
                dispatch('initNavList')
                Message.success({message:'目录添加成功!',duration:800})
                return Promise.resolve(true)
            }else{
                Message.error({message:`[${data.reason.join(',')}]字段重复!`,duration:800})
                return Promise.resolve(false)
            }
        }
    }
}