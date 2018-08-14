//引入express
const express=require('express')
//引入art-template
const template=require('art-template')
//引入自己写的工具包
const helper=require('../tools/doHelp')
//获取路由对象
let router = express.Router();
//引入path
const path=require('path')
//除了登出页,其他的页面都需要先登陆才能走下一步,所以把判断登陆的方法写到中间件,监控
router.use((req,res,next)=>{
    //判断要登陆的地址req.url,除了登出页其他页面都需判断
    if(req.url!='/logout'){
        if(!req.session.username){
            //如果session中没有username表示没有登陆,则提示用户
            helper.tips(res,'请登陆','/manager/login')
        }else{
            //登陆了就可以执行下面的路由
            next()
        }
    }else{
        //如果是登陆页面直接执行登出页面的路由
        next()
    }
})
//注册路由,登陆成功之后返回首页页面
router.get('/index',(req,res)=>{
    //查询数据库,并渲染到页面
    helper.find('student',{},result=>{
        //res.send(result)
        //登陆成功把用户名渲染到首页
        var html=template(path.join(__dirname,'../template/index.html'), {
            //把session中存的用户名渲染到首页模板
            username:req.session.username,
            result

        });
        res.send(html)
    })

})
//注册路由,新增页
router.get('/insert',(req,res)=>{
    res.sendFile(path.join(__dirname,'../template/add.html'))
})
//新增页保存数据到数据库
router.post('/insert',(req,res)=>{
    //res.send(req.body)
    //将新添加的数据写入数据库
    helper.insertOne('student',req.body,result=>{
        //res.send(result)
        if(result.n==1){
            helper.tips(res,"新增成功",'/student/index')
        }else{
            //新增失败
        }
    })
    
})
//注册路由,登出
router.get('/logout',(req,res)=>{
    //登出删除session中的username
    delete req.session.username
    //再跳转到登陆页
    res.redirect('/manager/login')
})
//暴露出去
module.exports=router