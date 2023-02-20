<template>
    <div class="SysLogin">
        <div class="panda">
            <div class="ear">
                <div class="left"></div>
                <div class="right"></div>
            </div>
            <div class="face">
                <div class="eye">
                    <div class="left">
                        <div class="white">
                            <div class="ball"></div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="white">
                            <div class="ball"></div>
                        </div>
                    </div>
                </div>
                <div class="nose"></div>
            </div>
            <div class="body"></div>
            <div class="foot">
                <div class="left">
                    <div class="sole"></div>
                </div>
                <div class="right">
                    <div class="sole"></div>
                </div>
            </div>
        </div>
        <div class="login">
            <div class="hand left"></div>
            <div class="hand right"></div>
            <span>Login</span>
            <div class="Id">
                <input v-model="userId" />
                <label>账号</label>
            </div>
            <div class="passwd">
                <input v-model="password" />
                <label>密码</label>
            </div>
            <button @click.stop="submitLogin">登录</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
    name: 'SysLogin',
    data() {
        return {
            userId: '22222222',
            password: 'hhdhD',
        }
    },
    methods: {
        ...mapMutations('user', ['saveLoginUser']),
        ...mapActions('user',['login','saveLoginedUser']),
        submitLogin() {
            this.login({user:{userId:this.userId,password:this.password}}).then(flag=>{
                if(flag){
                    this.$router.push('/sys/user/uManager')
                    this.saveLoginedUser({user:{userId:this.userId,password:this.password}})
                } 
            })
        },
    },
}
</script>

<style lang="less" scoped>
.SysLogin{
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: url('@/assets/login-bg.jpeg');
    .panda{
        position: relative;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        .ear{
            margin-left: 25px;
            display: flex;
            justify-content: space-between;
            position: relative;
            div{
                position: absolute;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background-color: #000;
                top: -10px;
            }
            .right{
                left:130px;
            }
        }
        .face{
            width: 200px;
            height: 200px;
            margin-left: 25px;
            border-radius: 50%;
            background-color: #fff;
            position: relative;
            z-index: 2;
            .eye{
                display: flex;
                justify-content: center;
                &>div{
                    width: 50px;
                    height: 80px;
                    margin-top: 30px;
                    border-radius: 50%;
                    background-color: #000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .white{
                        width: 30px;
                        height: 30px;
                        border-radius: 100%;
                        background-color: #fff;
                        display: flex;
                        justify-content: center;
                        align-content: center;
                        .ball{
                            width: 20px;
                            height: 20px;
                            border-radius: 100%;
                            background-color: #000;
                            margin-top: 7px;
                        }
                    }
                }
                &>.left{
                    margin-right: 20px;
                    transform: rotate(45deg);
                    &>div{
                        margin-left: 10px;
                    }
                }
                &>.right{
                    margin-left: 20px;
                    transform: rotate(-45deg);
                    &>div{
                        margin-right: 10px;
                    }
                }
            }
            .nose{
                width: 40px;
                height: 20px;
                border-radius: 10px;
                background-color: #000;
                position: absolute;
                left: 80px;
                top: 105px;
            }
        }
        .body{
            width: 250px;
            height: 280px;
            border-radius: 50%;
            background-color: #fff;
            position: absolute;
            top: 130px;
        }
        .foot{
            width: 400px;
            position: absolute;
            top: 50px;
            left: -75px;
            display: flex;
            justify-content: space-around;
            margin-top: 290px;
            z-index: 7;
            &>div{
                width: 82px;
                height: 120px;
                background-color: #000;
                border-radius:  40px 40px 35px 40px / 26px 26px 63px 63px;
                position: relative;
                .sole,
                .sole::before,
                .sole::after{
                    width: 20px;
                    height: 30px;
                    background-color: #222;
                    border-radius: 50%;
                    position: absolute;
                    top: 8px;
                    left: 0;
                    right: 0;
                    margin: auto;
                }
                .sole::after{
                    content: '';
                    left: 25px;
                }
                .sole::before{
                    content:'';
                    left: -50px;
                }


                &::after{
                    content:'';
                    width: 55px;
                    height: 65px;
                    background-color: #222;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 10px;
                    z-index: 10;
                }
                &.left{
                    &::after{
                        left:17px
                    }
                }
                &.right{
                    &::after{
                        right:17px
                    }
                }
            }
        }
    }
    .login{
        width: 350px;
        height: 250px;
        margin-left: 23px;
        background-color: #fff;
        border: 1px solid rgb(183, 181, 181);
        box-shadow: 3px 3px 12px -6px rgb(165, 164, 164);
        transform: translateY(-90px);
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        position: relative;
        z-index: 10;
        .hand,
        .hand::before,
        .hand::after{
            width: 40px;
            height: 30px;
            background-color: #000;
            border-radius: 50%;
            position: absolute;
            top: 70px;
            left: -27px;
        }
        .hand::before{
            content: '';
            top: 20px;
            left: 0px;
        }
        .hand::after{
            content: '';
            top: 40px;
            left: 0px;
        }
        &>.right{
            left: 335px;
        }
        span{
            width: 200px;
            text-align: center;
            font-size: 18px;
            color: rgb(6, 151, 151);
        }
        .Id,.passwd{
            width: 80%;
            margin-top: 10px;
            position: relative;
            input{
                width: 100%;
                height: 35px;
                border:none;
                border-bottom: 1px solid #bbb;
                text-indent: 5;
                outline: none;
                transition: 0.3s;
                &:focus{
                    border-color: #1dc797;
                    box-shadow: 0 1px #1dc797;
                }
                &:valid{
                    border-color: #1dc797;
                    box-shadow: 0 1px #1dc797;
                }
            }
            input:focus ~ label,input:valid ~ label{
                color:#1dc797;
                font-size: 12px;
                transform: translateY(-15px);
            }
            label{
                position: absolute;
                top: 5px;
                left: 0px;
                font-size: 14px;
                color: #888;
                transition: 0.3s;
            }
        }

        button{
            width: 150px;
            height: 40px;
            margin-top: 10px;
            background-color: #1dc797;
            border: none;
            border-radius: 3px;
            margin-top: 30px;
            letter-spacing: 10px;
            text-indent: 10px;
            cursor: pointer;
            transition: 0.3s;
            &:hover{
                letter-spacing: 25px;
                text-indent: 25px;
                background-color: #2fa080;
            }
        }
    }
    
}
</style>

