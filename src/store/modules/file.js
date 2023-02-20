import axios from 'axios'
import '@/util/axios'
import {Message} from 'element-ui'

export default{
    namespaced:true,
    state:{},
    mutations:{},
    actions:{
        async uploadFile({state},playload){
            const {data} = await axios({
                url:'/api/file/upload',
                method:'post',
                headers:{'Content-Type':"multipart/form-data"},
                data:playload
            })
            const {err,fileList} = data
            if(err.code===0&&!err.reason.length){
                Message.success({message:'文件上传成功!',duration:800})
                return Promise.resolve(fileList)
            }else{
                Message.error({message:`[${err.reason.join(',')}]文件上传失败!`,duration:800})
                return Promise.resolve(fileList)
            }
        }
    }
}