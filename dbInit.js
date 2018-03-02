/**
 * Created by Gabriel on 2017-01-27.
 */
//DB 초기화를 위한 코드, 맨 처음 한번만 실행시켜주면 된다.
var orientDB = require("orientjs");
var dbServer = orientDB({  //connecting to orientdb
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: '1138877'
});

//dbServer.drop('usersinfo');
var db = dbServer.create({  //userinfo라는 이름의 database를 만든다
    name: "UserInformation",
    type: "graph",
    storage: "plocal"
}).then(function (db) {
    db.class.create('User','V').then(function(user){ //사용자 정보 저장을 위한 User 클래스를 정의
        user.property.create({
                name: 'id',
                type: 'String'
            },{
                name: 'password',
                type: 'String'
            },{
                name: 'name',
                type: 'String'
            },{
                name: 'nickname',
                type: 'String'
            },{
                name: 'birth',
                type: 'Date'
            },{
                name: 'email',
                type: 'String'
            },{
                name: 'phone',
                type: 'String'
            },{
                name: 'gender',
                type: 'Char'
            },{
                name: 'verified',
                type: 'Boolean'
            },{
                name: 'admin',
                type: 'Boolean'
            }).then(function (properties) {
                console.log("Properties created");
                db.close();
                dbServer.close();
            });
        });
    });
