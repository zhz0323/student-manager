const express=require('express')
//引入中间件,为了获取表单上传的数据
const bodyParser = require('body-parser')
// 导入 express-session中间件(包)
const session = require('express-session')

//引入自己写的路由
const manageRouter=require('./route/managerRouter')
let app=express()

//托管静态资源
app.use(express.static('static'))
//调用中间件的方法,自动格式化数据,在req上增加.body这个属性,把上传的数据保存在body里面
//这个方法要放在中间件的前面
app.use(bodyParser.urlencoded({ extended: false }))

// 相信第一次请求,保存验证码的
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  //下面的参数都不是必须项,可以省略
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
}))

//挂载路由中间件
app.use('/manager',manageRouter)


app.listen(8080,'127.0.0.1',()=>{
    
    console.log('sucess');
})