// 配置路由相关信息
import VueRouter from 'vue-router'
import Vue from 'vue'

// 1.安装插件
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// 针对 push 方法
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
// 针对 replace 方法
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

//基础路由
const staticRoutesMap = [{
    path: "/login",
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('@/components/commons/Login')
}]


export default new VueRouter({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: staticRoutesMap
})