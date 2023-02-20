import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import notice from '@/store/modules/notice'
import role from '@/store/modules/role';
import nav from '@/store/modules/nav'
import permission from '@/store/modules/permisson'
import file from '@/store/modules/file'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        notice,
        role,
        nav,
        permission,
        file
    }
})

export default store