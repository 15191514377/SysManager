//处理后端请求
import routerMap from "@/router/routerMap";

function addRouter(list) {
    list.forEach((item)=>{
        // 若不存在英文名称，则无法与组件对应，删除该项
        if(!item.nameInEnglish) {
            item.delete = true
            return
        }
        if(item.nameInEnglish === 'notice'){
            item.redirect = '/sys/notice/nManager'
        }
        if(item.nameInEnglish === 'noticeDetail'){
            item.path = item.path+'/:id'
        }
        if(item.nameInEnglish === 'user'){
            item.redirect = '/sys/user/uManager'
        }
        if(item.nameInEnglish==='UserDetail'){
            item.path = item.path+'/:id'
        }
        item.component = routerMap(item.nameInEnglish)

        delete item.createTime
        delete item.fatherNavId
        delete item.headIcon
        delete item.id 

        //设置标题和图标
        item.meta = {}
        if(item.name) item.meta.title = item.name
        if(item.headIconURI) item.meta.icon = item.headIconURI
        delete item.name
        delete item.headIconURI

        if(item.children){
            addRouter(item.children)
        }
    })

    return list.filter(item=>!item.delete)
}


//拼接router
function splicingRouter(list) {
    const router = {
        path: '/sys',
        name: 'SysHome',
        component: () => import('@/components/commons/ManagerHome'),
        children:list
    }

    return router
}


export {
    addRouter,
    splicingRouter
}