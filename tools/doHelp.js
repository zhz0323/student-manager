//引入mongodb包,并使用他的一个属性
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

//数据库名
const dbName = 'manager';

//把查询数据库的方法暴露出去
module.exports = {
    find: function (collectionName, obj, callback) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, (err, client) => {
            //使用某个库
            const db = client.db(dbName);
            //操作数据库
            db.collection(collectionName).find(obj).toArray(function (err, result) {
                if (err) throw err
                //关闭数据库
                client.close();
                //返回操作数据库的结果
                callback(result);
            });
        });
    },
    //插入数据库的方法
    insertOne(collectionName, obj, callback) {
        MongoClient.connect(url, function (err, client) {
            // 选择使用库
            const db = client.db(dbName);
            // 查找数据
            db.collection(collectionName).insertOne(obj,(err,result)=>{
                if(err) throw err;
                // 关闭数据库
                client.close();
                callback(result.result);
            })
        });
    },
    //提示状态和跳转页面的方法
    tips(res,message,url){
        res.send(`<script> alert('${message}'); window.location='${url}'; </script>`);
    }
}