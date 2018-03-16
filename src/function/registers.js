
export function autoHypenPhone(phone){
    var str = phone.replace(/[^0-9]/g, '')
    
    var tmp = '';
    if( str.length < 4){
      return tmp;
    }else if(str.length < 7){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
      return tmp
    }else if(str.length < 11){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 3);
      tmp += '-';
      tmp += str.substr(6);
      return tmp
    }else{        
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 4);
      tmp += '-';
      tmp += str.substr(7);
      return tmp
    }
  }

export function  verifyPwd(pwd){
    var stringRegx = /[!@#$%^&*]/gi; 
    if(pwd.length>2){
        if(!stringRegx.test(pwd)){
            return {pwdVerifyPhrase:'최소 한개 이상의 특수문자가 포함되어야 합니다.(!@#$%^&*)'}
        }else if(pwd.length<8){
            return {pwdVerifyPhrase:'비밀번호가 너무 짧습니다.'}
        }
       return {pwdVerifyPhrase:'안전한 비밀번호입니다.',pwdVerified:true}
    }  
   
}
export function verifyEmail(email){
    var reg=/^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
    if(!reg.test(email)){
        alert('올바른 이메일을 입력하세요!')
        return 0;
    }
    console.log(2)
    return(true)
}
  