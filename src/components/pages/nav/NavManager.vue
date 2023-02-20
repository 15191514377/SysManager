<template>
    <div class="nav-manager">
        <div class="head">
            <el-button @click.stop="submitAddFirstNav()" type="primary">新增一级目录</el-button>
        </div>
        <div class="content">
            <el-table :data="navList" row-class-name="rowStyleUser" cell-class-name="cellStyleUser"
                header-cell-class-name="headerCellUser" row-key="id"
                :tree-props="{ hasChildren: 'hasChildren', children: 'seconds' }">
                <el-table-column prop="name" label="名称" width="150"></el-table-column>
                <el-table-column prop="nameInEnglish" label="英文名称" width="130"></el-table-column>
                <el-table-column prop="index" label="Index" width="100"></el-table-column>
                <el-table-column prop="path" label="路径" width="100"></el-table-column>
                <el-table-column prop="headIconURI" label="图标" width="100">
                    <template slot-scope="scope">
                        <el-image style="vertical-align: middle;width: 30px; height: 30px" :src="scope.row.headIconURI"
                            :preview-src-list="new Array(scope.row.headIconURI)"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button :disabled="Boolean(scope.row?.fatherNavId)" type="primary" plain icon="el-icon-plus" 
                        @click.native.stop="addSecondNav(scope.row)" circle></el-button>
                        <el-button type="success" plain icon="el-icon-edit" circle
                        @click.native.stop="emitItem(scope.row)"></el-button>
                        <el-button type="danger" plain icon="el-icon-delete" circle
                        @click.native.stop="deleteItem(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 导航添加页面，该页面显示在最前面，当点击新增才会出现，添加成功后，自动消失 -->
        <div v-show="formShow" class="add">
            <svg @click.stop="initNav()" t="1675076955416" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2867" width="20" height="20">
                <path
                    d="M806.4 263.2l-45.6-45.6L512 467.2 263.2 217.6l-45.6 45.6L467.2 512 217.6 760.8l45.6 45.6L512 557.6l248.8 248.8 45.6-45.6L557.6 512z"
                    p-id="2868" fill="rgb(125, 121, 121)"></path>
            </svg>
            <el-form :model="navForm" :rules="rules" ref="navForm" label-width="100px" class="navForm">
                <el-tag v-show="fatherNav.name">父目录：{{ fatherNav.name }}</el-tag>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="navForm.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="nameInEnglish">
                    <el-input v-model="navForm.nameInEnglish"></el-input>
                </el-form-item>
                <el-form-item label="Index" prop="index">
                    <el-input v-model="navForm.index"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="navForm.path"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="navForm.headIconURI" :src="navForm.headIconURI" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native.stop="submitForm('navForm')">提交</el-button>
                    <el-button @click="resetForm('navForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    name: 'NavManager',
    data() {
        var validateName = (rule, value, callback) => {
            const reg = /^[\u4e00-\u9fa5]{4,8}$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入4-8位汉字'))
            }
        };
        var validateEnglish = (rule,value,callback)=>{
            const reg = /^[A-za-z]{2,16}$/
            if(reg.test(value)){
                callback()
            }else{
                callback(new Error('请输入2~16位字母'))
            }
        };
        var validateIndex = (rule, value, callback) => {
            const reg = /^\d$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入0~9一位有效数字'))
            }
        };
        var validatePath = (rule, value, callback) => {
            const reg = /^[A-Za-z]{2,16}$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入2~16位字符'))
            }
        };
        return {
            //表单数据
            navForm: {
                name: '',
                nameInEnglish:'',
                index: '',
                path: '',
                headIcon: '',
                faterBarId: '',
                headIconURI :''
            },
            //表单校验规则
            rules: {
                name: [{ validator: validateName, trigger: 'blur' }],
                index: [{ validator: validateIndex, trigger: 'blur' }],
                path: [{ validator: validatePath, trigger: 'blur' }],
                nameInEnglish:[{validator:validateEnglish,trigger:'blur'}]
            },
            // 父nav
            fatherNav: {},
            //要更改的nav
            showNav: {},
            // 控制form表单是否显示
            formShow: false,
            imageUrl: '',

        }
    },
    computed: {
        ...mapState('nav', ['navList'])
    },
    methods: {
        ...mapMutations('nav', ['addOrUpdate']),
        ...mapActions('nav', ['deleteNav','initNavList','updateNav','addNav']),
        ...mapActions('file',['uploadFile']),
        //初始化showNav,imageUrl,formShow,fatherNav,uploadFile
        initNav() {
            this.showNav = {}
            this.imageUrl = ''
            this.formShow = false
            this.fatherNav = {}
            this.navForm = {
                name: '',
                nameInEnglish:'',
                index: '',
                path: '',
                headIcon: '',
                faterBarId: '',
            }
        },
        // 添加一级导航
        submitAddFirstNav() {
            this.formShow = true
        },
        //添加二级目录
        addSecondNav(first) {
            this.formShow = true
            this.fatherNav = first
            this.navForm.faterBarId = first?.id
        },
        //限制文件大小及类型，关闭el-upload默认上传,自定义上传方法
        beforeAvatarUpload(file) {
            const imgType = /^image/
            const isImg = imgType.test(file.type)
            const lt2m = file.size / 1024 / 1024 < 2
            if (!isImg) {
                this.$message.error('只能上传图片')
            }
            if (!lt2m) {
                this.$message.error('图片大小不能超过2MB')
            }
            if (isImg && lt2m) {
                const fm = new FormData()
                fm.append('nav_icon',file)
                this.uploadFile(fm).then(fileList=>{
                    if(fileList.length===1){
                        this.navForm.headIconURI=fileList[0]?.url
                        this.navForm.headIcon = fileList[0]?.localUrl
                    }
                })
            }
            return false
        },
        // 创建导航,更新导航
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(Object.keys(this.showNav).length){
                        this.updateNav({nav:this.navForm}).then(flag=>{
                            this.formShow = !flag
                        })
                    }else{
                        this.addNav({nav:this.navForm}).then(flag=>{
                            this.formShow = !flag
                        })
                    }
                    
                }
            });
        },
        //重置navForm
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 删除导航信息
        deleteItem(nav) {
            this.$confirm('是否删除该目录及其关联的子目录','提示',{
                confirmButtonText:'删除',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                this.deleteNav({nav})
            }).catch(()=>{
                this.$message.info({message:'已取消删除',duration:800})
            })
        },
        // 修改导航信息，
        emitItem(nav) {
            // 1.navform可见
            this.formShow = true
            //2.为navform绑定数据
            this.showNav = nav
            this.navForm = nav
        }
    },
    mounted(){
        this.initNavList()
    }
}
</script>

<style lang="less" scoped>
.nav-manager {
    width: 90%;
    min-width: 800px;
    border: 1px solid red;
    padding: 15px 10px;
    position: relative;

    .head {
        width: 100%;
        height: 30px;
        margin-bottom: 10px;

        .el-button {
            float: right;
            margin-right:182px;
        }
    }

    .add {
        position: absolute;
        top: 70px;
        left: 160px;
        width: 500px;
        height: 300px;
        padding: 15px 10px;
        border-radius: 5px;
        background-color: #f4f0f0;

        svg {
            position: absolute;
            top: -8px;
            right: -8px;
            display: inline-block;
            border-radius: 50%;
            border: 2px solid rgb(125, 121, 121);
            cursor: pointer;
        }
    }

    /deep/ .el-button {
        line-height: 0;

        span {
            vertical-align: middle;
            line-height: 0;
        }
    }

    .content {
        width: 100%;
    }

    /deep/ .headerCellUser {
        text-align: center;
    }

    /deep/ .cellStyleUser {
        height: 30px;
        text-align: center;
        padding-left: 10px;

        .cell {
            font-size: 10px
        }
    }

    /deep/ .rowStyleUser {
        height: 30px;
        padding: 3px 0;

        &:hover {
            cursor: pointer;
        }
    }
}


.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 5px;
    border: 1px dashed rgb(217, 215, 215);
}

.avatar {
    width: 80px;
    height: 80px;
    display: block;

}
</style>