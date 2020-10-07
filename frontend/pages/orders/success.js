

const SuccessOrder = (props)=>{
    return (
        <div>
            <h1>Payment Successful</h1>
            <br/>
            Thank you {props.currentUser.email}
        </div>
    )
}


export default SuccessOrder;