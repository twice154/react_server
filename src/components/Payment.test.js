import React from 'react';
import {shallow} from 'enzyme'
import Payment from './Payment'

describe('Payment test',()=>{
    var requestPay=jest.spyOn(Payment.prototype,'requestPay')
    
    global.alert=jest.fn()
    global.IMP={init:jest.fn(),request_pay:jest.fn((a,callback)=>{callback('')})}
    var wrapper = shallow(<Payment/>)
    describe('requestPay test',()=>{
       
        it('success',()=>{   
            var rsp = {success:true, imp_uid:'1', merchant_uid:'2',paid_amount:'3',apply_num:'4'}
            global.IMP={init:jest.fn(),request_pay:jest.fn((a,callback)=>{callback(rsp)})}
        var wrapper = shallow(<Payment/>)
            wrapper.find('input').simulate('click')
            expect(requestPay.mock.calls.length).toBe(1)
            expect(global.alert.mock.calls[0][0]).toBe("결제가 완료되었습니다.고유ID : 1상점 거래ID : 2결제 금액 : 3카드 승인번호 : 4")
        })
        it('failure',()=>{   
            var rsp = {success:false, error_msg:'실패'}
            global.IMP={init:jest.fn(),request_pay:jest.fn((a,callback)=>{callback(rsp)})}
        var wrapper = shallow(<Payment/>)
            wrapper.find('input').simulate('click')
            expect(requestPay.mock.calls.length).toBe(2)
            expect(global.alert.mock.calls[1][0]).toBe( "결제에 실패하였습니다.에러내용 : 실패")
        })
    })

    it('snapshot test',()=>{
        expect(wrapper).toMatchSnapshot()
    })
})