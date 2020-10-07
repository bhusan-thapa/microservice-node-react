
import {useState} from 'react';
import Router from 'next/router';

import StripeCheckout from 'react-stripe-checkout';
import userRequest from '../../hooks/use-request';

const OrderShow = ({order,currentUser})=>{
    const {doRequest,errors} = userRequest({
        url: '/api/payments',
        method: 'post',
        body:{
            orderId: order.id
        },
        onSuccess: payment=>Router.push('/orders/success')

    })

    return (
        <div>
            <StripeCheckout
                token = {({id}) => doRequest({token: id})}
                stripeKey='pk_test_51HRD3PEBDVAIlBSpQDIErWzMuwKlzvPYdgB3EU3zMon2JASdvayt37MeLFjXYQnkD9AGupuXdaRA3Cn8H5LyuQQX00YZhk8Wcl'
                amount= {order.product.price * 100}
                email={currentUser.email}
             />
             {errors}
        </div>
    )
}

OrderShow.getInitialProps = async (context,client) =>{
    const {orderId} =context.query;
    console.log('*******',orderId);
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
}

export default OrderShow;