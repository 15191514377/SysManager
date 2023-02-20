<template>
    <div class="UserAdd">
        <el-form :model="user" status-icon :rules="rules" label-position="right" label-width="70px" ref="form"> 
            <el-form-item label="Id" prop="userId">
                <el-input v-model="user.userId"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="user.sex">
                    <el-radio label="男生"></el-radio>
                    <el-radio label="女生"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-upload
                    action="#"
                    :before-upload="handleBeforeUpload">
                    <img v-if="user.avatar" :src="user.avatar" >
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="user.phone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click.native.stop="submitAdd">确认</el-button>
                <el-button type="danger" plain @click.native.stop="submitReset">重置</el-button>
                <el-button type="info" plain @click.native.stop="submitCancle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'UserAdd',
    props:{
        changeShow:Function,
    },
    data() {
        var userIdVal = (rule, value, callback) => {
            var userIdReg = /\d{8}$/
            if (!value) {
                return callback(new Error('请输入账号'))
            }
            if (!userIdReg.test(value)) {
                return callback(new Error('请输入8位数字'))
            }
            callback()
        }
        var passwordVal = (rule, value, callback) => {
            const passwordReg = /\w{4,8}$/
            if (!value) {
                return callback(new Error('请设置密码'))
            }
            if (!passwordReg.test(value)) {
                return callback(new Error('请输入4~8位字符(A-Za-z0-9_)'))
            }
            callback()
        }
        var usernameVal = (rule, value, callback) => {
            const usernameReg = /[\u2E80-\u9FFF]{2,5}$/
            if (!value) {
                return callback(new Error('请输入用户姓名'))
            }
            if (!usernameReg.test(value)) {
                return callback(new Error('请输入2~5位汉字'))
            }
            callback()
        }
        var phoneVal = (rule, value, callback) => {
            const phoneReg = /^1[3-9]\d{9}$/
            if (!value) {
                return callback(new Error('请输入手机号码'))
            }
            if (!phoneReg.test(value)) {
                return callback(new Error("请输入正确的手机号码"))
            }
            callback()
        }
        var emailVal = (rule, value, callback) => {
            const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!value) {
                return callback(new Error('请输入邮箱'))
            }
            if (!emailReg.test(value)) {
                return callback(new Error('请输入正确的邮箱'))
            }
            callback()
        }
        return{
            user:{
                username:'',
                password:'',
                phone:'',
                email:'',
                sex:'',
                userId:'',
                avatar:''
            },
            rules:{
                username:[{validator:usernameVal,trigger:'blur'}],
                userId:[{validator:userIdVal,trigger:'blur'}],
                passwordVal:[{validator:passwordVal,trigger:'blur'}],
                phone:[{validator:phoneVal,trigger:'blur'}],
                email:[{validator:emailVal,trigger:'blur'}]
            }
        }
    },
    methods:{
        ...mapActions('file',['uploadFile']),
        ...mapActions('user',['addUser']),
        handleBeforeUpload(file){
            const reg = /^image/
            const isImg = reg.test(file.type)
            const isLess2M = file.size/1025/1024<24
            if(isImg&&isLess2M){
                const fm = new FormData()
                fm.append('avatar',file)
                this.uploadFile(fm).then(fileList=>{
                    fileList.length?this.user.avatar = fileList[0].url:''
                })
            }else{
                this.$message.error({message:'请上传小于2MB的图片!',duration:1000})
            }

            return false
        },
        submitAdd(){
            this.$refs.form.validate(validate=>{
                if(validate){
                    this.user.sex==='男'?this.user.sex=1:this.user.sex=0
                    this.addUser({user:this.user}).then(flag=>{
                        flag?this.changeShow():''
                    })
                }
            })
        },
        submitReset(){
            this.$refs.form.resetFields()
        },
        submitCancle(){
            this.$refs.form.resetFields()
            this.changeShow()
        }
    }
}
</script>

<style lang="less" scoped>
@avatarSize:60px;

.UserAdd{
    width: 400px;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: rgb(231, 225, 225);
    border: 1px solid rgb(214, 211, 211);
    /deep/ .el-upload{
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover{
            border-style: dashed;
        }
        i{
            font-size: 28px;
            color: #8c939d;
            width: @avatarSize;
            height: @avatarSize;
            line-height: @avatarSize;
            text-align: center;
        }
        img{
            width: @avatarSize;
            height: @avatarSize;
            display: block;
        }
    }

    /deep/ .el-form-item__content{
        input{
            width: 300px;
        }
        .el-button{
            float: right;
            margin-left: 20px;
        }
    }
}
</style>