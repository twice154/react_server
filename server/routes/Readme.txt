/*
 *  @namespace   error
 *  @property   {Boolean}   success - 요청 성공 여부
 *  @property   {Int}       status  - http status 값
 *  @property   {String}    message - 구체적인 오류의 내용
 *  @property   {Object}    Data    - 부가 데이터
**/


/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    POST /api/users/
 *  @brief  회원가입에 사용하는 라우터 \n
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {Object}    req.body
 *    @property	{String}	userId
 *    @property {String}	password
 *    @property {String}	email
 *    @property {String}	phone
 *    @property {String}	name
 *    @property {String}	nickname
 *    @property {String}	birth
 *
 *  @respond {error}    회원가입에 성공했을때
 *      @respond { true, 200, "Mail send to {email}" }
 *
 *  @throw  {error}     userId가 중복되었을 경우
 *      @respond { false, 200, "user name was already registered" }
 * 
 *  @throw  {error}     토큰화에 실패했을 경우
 *      @respond { false, 400, "Can not get tempToken" }
 *
 *  @throw  {error}     메일 전송에 실패했을 경우
 *      @respond { false, 400, "Can not send mail" }
 *
 *  @throw  {error}     property에 빈 필드가 있을 경우
 *      @respond { false, 400, "There is blanked field" }
 *
**/



/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    PUT /api/users/{id}/{field}
 *  @brief  정보 수정에 사용하는 라우터 
 *  @see    PUT/api/users/{id}/verification 으로 req.body 없이 요청하면 해당 유저의 verificated 값이 true가 된다.
 *          (메일 인증에 사용), (url 쿼리에 token값을 전달해야함)
 *  @todo   추가로 비밀번호 확인이 필요한 경우 어떻게 할지 생각하기
 *          메일 인증의 경우 만료시간 정하기
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {Object}    cookies
 *    @property {String}    token   - 회원의 토큰, 경우에 따라서는 url쿼리로 전달 가능
 *  @params {enum}      url.params
 *    @property {String}    userId  - 회원정보를 수정하려는 회원의 ID
 *    @property {String}    field   - 어떤 필드를 수정하는지 url에 명시해야함
 *  @params {Object}    req.body
 * * * //// 아래 필드에서 한가지만 보내주어야 실행됨 //// * * *
 *    @property {String}	password
 *    @property {String}	email
 *    @property {String}	phone
 *    @property {String}	name
 *    @property {String}	nickname
 *    @property {String}	birth
 *    @property {Boolian}   verified
 *
 *  @respond {error}    정보수정에 성공했을때
 *      @respond { true, 200, "" }
 *
 *  @throw  {error}     /api/users/{id}/verification URL에 필드 값을 넣었을 때
 *      @respond { false, 400, "Verification do not need JSON input" }
 * 
 *  @throw  {error}     필드의 개수가 1개보다 많거나 적을 때
 *      @respond { false, 400, "too much fields or no field" }
 *
 *  @throw  {error}     URL 파라미터의 필드 이름과 req.body로 보내준 필드 이름이 다를 때
 *      @respond { false, 400, "url was not matched to User field" }
 *
 *  @throw  {error}     수정을 요청한 필드가 수정 가능한 User property에 해당하지 않을 때
 *      @respond { false, 400, "The field was able to modify" }
 *
**/




/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    DELETE /api/users/{id}/
 *  @brief  회원 탈퇴에 사용하는 라우터 
 *  @todo   추가로 비밀번호 확인이 필요한 경우 어떻게 할지 생각하기
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {Object}    req.cookies
 *    @property {String}    token   - 회원의 토큰
 *  @params {enum}      req.url.params
 *    @property {String}    userId  - 회원탈퇴를 하려는 회원의 ID
 *  @params {Object}    req.body
 *    @property {String}	userId
 *
 *  @respond {error}    회원 탈퇴에 성공했을때
 *      @respond { true, 200, "" }
 *
 *  @throw  {error}     해당 유저가 없을 때
 *      @respond { false, 400, "Not exist user" }
 * 
 *  @throw  {error}     URL의 userId와 field의 userId가 일치하지 않을 때
 *      @respond { false, 404, "URL was not match to field" }
 *
**/


/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    POST /api/auth/
 *  @brief  로그인에 사용하는 라우터
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {Object}      req.body
 *    @property {String}    userId
 *    @property {String}    password
 *
 *  @respond {error}    로그인에 성공했을 때
 *      @respond { true, 200, verified: user.verified }
 *          (+ Cookie.token)
 *
 *  @throw  {error}     없는 회원이거나 비밀번호가 틀릴 때
 *      @respond { false, 200, "ID or password was incorrect" }
 * 
**/




/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    DELTET /api/auth/
 *  @brief  로그아웃에 사용하는 라우터
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @respond {error}    로그아웃
 *      @respond { true, 200, "" }
 *          (+ Cookie Clear) 
**/




/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @GET    GET /api/check/duplication/{field}/{value}
 *  @brief  중복체크에 사용하는 라우터
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {enum}      req.url.params  - 세 개중 하나가 {field}로 들어감
 *    @property {String}    field   - 중복 체크할 필드의 이름
 *    @property {String}    value   - 중복 체크할 값
 *
 *  @respond {error}    중복된 값이 없을 때
 *      @respond { true, 200 }
 *
 *  @throw  {error}     중복된 값이 있을 때
 *      @respond { false, 200, "{field} exist" }
 * 
**/





/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @GET    POST /api/check/duplication/{field}/{value}
 *  @brief  중복체크에 사용하는 라우터
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {enum}      req.url.params  - 세 개중 하나가 {field}로 들어감
 *    @property {String}    field   - 중복 체크할 필드의 이름
 *    @property {String}    value   - 중복 체크할 값
 *
 *  @respond {error}    중복된 값이 없을 때
 *      @respond { true, 200 }
 *
 *  @throw  {error}     중복된 값이 있을 때
 *      @respond { false, 200, "{field} exist" }
 * 
**/



/*
 * * * * * * * * * * * * * * * * * * * * * *
 *  @URL    PUT /api/recovery/{id}/
 *  @brief  회원 탈퇴에 사용하는 라우터 
 *  @see    이메일을 바꾸지 않을 때 파라미터의 email 필드가 undefined가 되면 안되고 ""으로 해야함
 * * * * * * * * * * * * * * * * * * * * * *
 *
 *  @params {enum}      req.url.params
 *    @property {String}    ifChange  - 회원탈퇴를 하려는 회원의 ID
 *  @params {Object}    req.body
 *    @property {String}	userId
 *    @property {String}    email   - 다시 바꿀 email, 이메일을 바꾸지 않을 경우 ""로 전송
 *
 *  @respond {error}    email 수정 및 메일 발송에 성공했을 때
 *      @respond { true, 200, "Mail send to {email}" }
 *
 *  @throw  {error}     email 필드가 없을 때
 *      @respond { false, 400, "email field did not exist" }
 * 
 *  @throw  {error}     change 쿼리가 없을 때
 *      @respond { false, 400, "change query did not exist" }
 * 
 *  @throw  {error}     필드와 url 처리 switch문에서 혹시 모를 오류가 발생하였을 때
 *      @respond { false, 400, "Something worng in query check" }
 * 
 *  @throw  {error}     존재하지 않는 유저일 때
 *      @respond { false, 404, "Not exist user" }
 *
 *  @throw  {error}     메일 전송에 실패했을 경우
 *      @respond { false, 400, "Can not send mail" }
 *
**/
