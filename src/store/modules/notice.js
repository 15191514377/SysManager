import axios from 'axios'
import '@/util/axios'
import { Message } from 'element-ui'

export default {
    namespaced: true,
    state:{
            //所有的公告列表
            noticeList: [],
            //公告详情页中的notice对象
            checkNotice: {},
            //用户的公告列表
            userNoticeList: [],
            //某一公告已经分配的用户
            noticeUserList:[],
    },
    mutations: {
        addNoticeToCheckNotice(state, noticeId) {
            state.checkNotice = state.noticeList.filter(item=>item.id === noticeId)[0]
        },
        //获取公告详情页的附件
        getAttachmentList(state){
            let attachmentList = []
            const attachmentListJSON = state.checkNotice?.noticeFileds
            if(attachmentListJSON){
                attachmentList = [...JSON.parse(attachmentListJSON)]
            }
            return attachmentList
        }
    },
    actions: {
        //获取后端notice列表
        initNoticeList({state}) {
            axios.get('/api/notice/getAll').then(({data})=>{
                state.noticeList = data
            })
        },
        // 获取用户的公告
        getUserNotice({state}, userId) {
            axios.post('/api/notice/userNoticeList', {userId}).then(({data}) => {
                    state.userNoticeList = data.data
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //通过noticeId获取notice
        async getNoticeById({state},noticeId){
            const {data} = await axios.post('/api/notice/getNoticeById',{id:noticeId})
            const {err,noticeList} = data
            if(err===1){
                Message.error({message:`${err.reason[0]}`,duration:1000})
                return Promise.reject(false)
            }else{
                state.checkNotice = noticeList[0]
                return Promise.resolve(true)
            }
        },
        //根据NoticeId获取关联的用户
        async getUserByNoticeId({state},noticeId){
            const {data} = await axios.post('/api/notice/getUserListByNoticeId',{noticeId})
            return Promise.resolve(data)
        },
        //添加公告
        async addNotice({state},playload){
            const {data} = await axios({
                url:'/api/notice/add',
                method:"post",
                headers:{'Content-Type':'multipart/form-data'}, 
                data:playload
            })
            const {err,notice} = data;
            console.log({data});
            if(err.code===0){
                Message.success({message:'公告添加成功!',duration:800})
                state.noticeList.push(notice)
                return Promise.resolve(true)
            }else{
                Message.error({message:'公告添加失败!',duration:800})
                return Promise.reject(false)
            }
        },
        /**
         * 添加/更新公告分配的用户
         * @param {*} playload 用户id列表
         */
        async alloctUser({state},playload){
            const {data} = await axios({
                url:'/api/notice/alloctUser',
                method:"post",
                data:{
                    userIdList:playload,
                    noticeId:state.checkNotice?.id
                }
            })
            const {err} = data
            if(err.code===1){
                const userNameList = err.reason.map(item=>item?.username).filter(item=>item)
                Message.error({message:`[${userNameList.join(',')}]分配失败!`,duration:800})
                return Promise.reject(false)
            }else{
                return Promise.resolve(true)
            }
        },
        async searchNotice({state},playload){
            const {data} = await axios({
                url:"/api/notice/search",
                method:"post",
                data:playload
            })
            const {err,noticeList} = data
            if(err.code===0&&noticeList.length){
                noticeList.forEach(item=>{
                    state.noticeList.sort((a)=>{
                        if(a?.id===item?.id) return -1
                        else return 1
                    })
                })
                return Promise.resolve(true)
            }else{
                Message.error({message:'没有找到任何公告信息!',duration:800})
                return Promise.resolve(false)
            }
        },
        async deleteNotice({state},playload){
            const {data} = await axios({
                url:'/api/notice/delete',
                method:'post',
                data:playload
            })
            const {err} = data
            if(err.code===1){
                Message.error({message:'该公告删除失败!',duration:800})
            }else{
                const {notice} = playload
                if(notice?.id){
                    Message.success({message:'该公告删除成功!',duration:800})
                    state.noticeList = state.noticeList.filter(item=>item?.id!==notice.id)
                }
            }
        },
        async getNoticeUserList({state},playload){
            const {data} = await axios({
                url:'/api/notice/getNoticeUserList',
                method:'post',
                data:playload
            })
            const {userList} = data
            state.noticeUserList = userList
        },
        
    }
}