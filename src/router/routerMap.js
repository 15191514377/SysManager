const map = {
    notice:() => import('@/components/pages/notice/index'),
    noticeDetail: () => import('@/components/pages/notice/NoticeDetail'),
    NoticeShare: () => import('@/components/pages/notice/NoticeShare'),
    NoticeAdd:()=>import('@/components/pages/notice/NoticeAdd'),
    NoticeManager:()=>import('@/components/pages/notice/NoticeManager'),
    user: () => import('@/components/pages/user/index'),
    UserManager:()=>import('@/components/pages/user/UserManager'),
    UserAdd:()=>import('@/components/pages/user/UserAdd'),
    UserDetail: () => import('@/components/pages/user/UserDetail'),
    nav: () => import('@/components/pages/nav/NavManager'),
    role:()=>import('@/components/pages/permission/index'),
    RoleUser:()=>import('@/components/pages/permission/RoleUser'),
    RolePermission:()=>import('@/components/pages/permission/RolePermission'),
    PermissionAdd:()=>import('@/components/pages/permission/PermissionAdd'),
}

export default fields => {
    return map[fields] || null
}