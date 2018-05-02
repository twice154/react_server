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

dbServer.drop('UserInformation');
var db = dbServer.create({  //userinfo라는 이름의 database를 만든다
    name: "UserInformation",
    type: "graph",
    storage: "plocal"
}).then(function (db) {
    db.class.create('User','V').then(function(User){ //사용자 정보 저장을 위한 User 클래스를 정의
        //T
        User.property.create([{
                name: 'userId',
                type: 'String'
            },{
                name: 'password',
                type: 'String'
            },{
                name: 'name',
                type: 'String'
            },{
                name: 'birth',
                type:'String'
            },{
                name:'email',
                type:'String'
            },{
                name:'gender',
                type:'String'
            },{
                name:'nickname',
                type:'String'
            },{
                name:'phone',
                type:'String'
            },{
                name:'verified',
                type:'Boolean'
            }]).then(db.class.create('DonationSettings')).then((setting)=>{
                setting.property.create([{
                    name:'donationImgs', //도네이션때 사용할 이미지 주소들. ','로 구분
                    type: 'String'
                },{
                    name:'fobiddens', //금지어 들/ ','로 구분
                    type:'String'
                },{
                    name:'fontColor', //글자 컬러 헥사
                    type:'String'
                },{
                    name:'fontSize', //글자 크기
                    type:'Integer'
                },{
                    name:'highlightColor', //하이라이트 글자 색 헥사.
                    type:'String'
                },{
                    name:'messageCheck', //메시지로 후원 on off
                    type:'Boolean'
                },{
                    name:'TTSspeed', //tts 읽어주는 속도 TODO: 시청자가 정할지도 선택. % 50~200
                    type:'Integer'
                },{
                    name:'TTSvolume', //tts 크기 %
                    type:'Integer'
                },{
                    name:'userId', //누구의 설정인지 알기위한  구별자.
                    type:'String'
                },{
                    name:'videoCheck', //영상도네 on off
                    type:'Boolean'
                },{
                    name:'voiceCheck', //음성도네 on oof
                    type:'Boolean'
                },{
                    name:'volume', //영상, 음성, tts 총 볼륨.
                    type:'Integer'
                }])
            }).then(db.class.create('ReactoSettings')).then((setting)=>{
                setting.property.create([{
                    name:'No1_duration', //reacto 버튼 1번에 들어가는 이름
                    type: 'String'
                },{
                    name:'No2_duration', //reacto 버튼 2번에 들어가는 이름
                    type:'String'
                },{
                    name:'No3_duration', //reacto 버튼 3번에 들어가는 이름
                    type:'String'
                },{
                    name:'No4_duration', //reacto 버튼 4번에 들어가는 이름
                    type:'String'
                },{
                    name:'No5_duration', //reacto 버튼 5번에 들어가는 이름
                    type:'String'
                },{
                    name:'No6_duration', //reacto 버튼 6번에 들어가는 이름
                    type:'String'
                },{
                    name:'percent', //몇 퍼센트 이상일때 활성화 시켜줄지.
                    type:'Integer'
                },{
                    name:'resetTime', //몇 초가 지나면 리셋해줄지.(디폴트는 5초, 0초인 경우는 리셋되지 않는다.)
                    type:'String'
                },{
                    name:'userId',//어떤 유저의 정보인지.
                    type:'String'
                }])
            })
            .then(function (properties) {
                console.log("Properties created");
                db.close();
                dbServer.close();
            });
        });
    });
