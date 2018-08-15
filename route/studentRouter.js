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
//注册路由,登陆成功之后查询数据返回首页页面
router.get('/index',(req,res)=>{
    //查询默认是get提交,所以form表单不用加action和method,给输入框添加name属性,点击
    //搜索按钮会把值传过来,传过来的值在req的query对象中query: { search: '黑' }
    //所以根据req.query中有没有值来判断是模糊搜索还是全部搜索
    //console.log(req.query.search);
    //查询的条件,模糊搜索和全部搜索调用方法只是传入的对象不一样
    let obj={}
    //判断查询条件
    if(req.query.search){
        obj={
            userName: {$regex: req.query.search}
        }
    }
    //console.log(obj);
    // //查询数据库,并渲染到页面
    helper.find('student',obj,result=>{
        //console.log(result);
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
//注册路由,删除数据
router.get('/delete/:id',(req,res)=>{
    //res.send(req.params)
    //获取要删除的数据id
    let id=req.params.id
    //根据id调用数据库方法删除数据
    helper.deleteOne('student',{_id:helper.ObjectID(id)},result=>{
        //res.send(result)
        if(result.n==1){
            helper.tips(res,"删除成功",'/student/index')
        }
    })
})
//注册路由,进入编辑状态
router.get('/edit/:id',(req,res)=>{
    let id=req.params.id
    //console.log(req.params.id);
    helper.find('student',{_id:helper.ObjectID(id)},result=>{
        //res.send(result)
        //把查询到的数据渲染到编辑模板
        let html=template(path.join(__dirname,'../template/edit.html'),{
            result:result[0]
        })
        res.send(html)
    })
})
//注册路由,保存修改之后的内容到数据库
router.post('/edit',(req,res)=>{
    let id=req.body._id
    //去掉id两边的",用''替换"
    id=id.replace('"','')
    id=id.replace('"','')
    console.log(id);
    //删掉req.body中的_id,直接把这个对象传入函数中
    delete req.body._id
    console.log(req.body);
    helper.updateOne('student',{_id:helper.ObjectID(id)},{$set:req.body},result=>{
        //res.send(result)
        if(result.n==1){
            //res.redirect('/student/index')
            helper.tips(res,'修改成功','/student/index')
        }

    })
})
//暴露出去
module.exports=router