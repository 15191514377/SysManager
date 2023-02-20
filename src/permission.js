import router from "@/router/index";
import user from"@/store/modules/user";
import store from "@/store/index";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import {addRouter,splicingRouter} from "@/router/addRouter";

//定义白名单
// const whiteList = ['/login']
router.beforeEach((to, from, next) => {
    NProgress.start();
    if(to.meta.title){
        document.title = to.meta.title
    }
    if (to.path !== '/login') {
        //路由信息存在，放行
        if (user.state.RouterList.length) {
            next()
        } else {
            gotoRouter(to, next)
        }
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    NProgress.done(); // 结束Progress
});

function gotoRouter(to, next) {
    //已经从后台获取到导航列表，将该列表信息深拷贝给user.state.navList
    const loginUserCatalogList =  JSON.parse(localStorage.getItem('loginUserCatalogList'))
    const medialRouterList =  addRouter(loginUserCatalogList)
    const roleList =  splicingRouter(medialRouterList)
    router.addRoute(roleList)
    store.commit('user/saveLoginUserRouterList',roleList )
    next({
        ...to,
        replace:true
    })
}