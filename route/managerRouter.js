const express=require('express')
const path=require('path')
//引入验证码模块,第三方包
const svgCaptcha = require('svg-captcha')
//导入自己写的方法
const doHelper=require('../tools/doHelp')
//获取路由对象
var router = express.Router();
//登陆页路由
router.get('/login', (req, res) =>{
    //返回静态页面
    res.sendFile(path.join(__dirname,'../template/login.html'))
  });
//登录页 提交数据,判断登陆的逻辑
router.post('/login',(req,res)=>{
    //res.send(req.body)
    //获取表单数据
    let username=req.body.username
    let userpass=req.body.userpass
    let vCode=req.body.vCode.toLowerCase()
    console.log(req.session.captcha)
    //判断验证码是否正确
    if(vCode==req.session.captcha){
        //如果验证码正确再去数据库查询用户名和密码是否正确
        doHelper.find('admin',{username,userpass},(result)=>{
            if(result.length==0){
                doHelper.tips(res,'用户名或密码错误','/manager/login')
            }else{
                //登陆成功之后把用户名和密码保存到session中
                req.session.username=username
                req.session.userpass=userpass
                res.redirect('/student/index');
            }
        })
    }else{
        //验证码不正确直接提示客户
        doHelper.tips(res,'验证码输入错误','/manager/login')
    }
})
//注册页路由
router.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../template/register.html'))
})
//注册页 提交数据,判断注册的逻辑
router.post('/register',(req,res)=>{
    //res.send(req.body);
    let username=req.body.username
    let userpass=req.body.userpass

    doHelper.find('admin',{username},(result)=>{
        if(result.length==0){
            doHelper.insertOne('admin',{username,userpass},(result)=>{
                console.log(result);
                //res.send(result);
                if(result.n==1){
                    doHelper.tips(res,'注册成功','/manager/login')
                }
            })
        }else{
            doHelper.tips(res,'用户名已被注册','/manager/register')
        }
    })
})
//获取验证码的接口
router.get('/vcode',(req,res)=>{
    //使用第三方生成验证码
    var captcha = svgCaptcha.create();
    //把验证码信息保存到session中,方便后续的匹配
    req.session.captcha = captcha.text.toLowerCase();
    //captcha.text验证码
    console.log(captcha.text);
    // 设置类型
    res.type('svg');
    // 返回生成的验证码图片
	res.status(200).send(captcha.data);
})
//暴露出去
module.exports=router