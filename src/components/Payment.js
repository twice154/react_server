/**
 * 결제페이지. 아임포트를 사용. TODO: 카카오페이 같은 결제 모듈도 사용할 수 있게.
 * @author G1
 * @logs // 18.2.25
 */

import React from 'react';

class Payment extends React.Component {

	componentWillMount(){
		window.IMP.init('imp60269147');
	}

	render(){
		return(
			<div>
				<form>
					<input type='BUTTON' defaultValue='pay' onClick={this.requestPay}/>
				</form>
			</div>
		)
	}

	requestPay(){
		window.IMP.request_pay({
			pg : 'nice', // version 1.1.0부터 지원.
			pay_method : 'card',
			merchant_uid : 'merchant_' + new Date().getTime(),
			name : 'test_name',
			amount : 1000,
			buyer_email : 'iamport@siot.do',
			buyer_name : 'dfiodiowe',
			buyer_tel : '010-1234-5678',
			buyer_addr : '서울특별시 강남구 삼성동',
			buyer_postcode : '123-456',
			m_redirect_url : 'https://www.naver.com'
			}, function(rsp) {
			if ( rsp.success ) {
			    var msg = '결제가 완료되었습니다.';
			    msg += '고유ID : ' + rsp.imp_uid;
			    msg += '상점 거래ID : ' + rsp.merchant_uid;
			    msg += '결제 금액 : ' + rsp.paid_amount;
			    msg += '카드 승인번호 : ' + rsp.apply_num;
			} else {
				msg = '결제에 실패하였습니다.';
			    msg += '에러내용 : ' + rsp.error_msg;
			}
			alert(msg);
		});
	}
}

export default Payment;