import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Comments from '../../components/comments';
const ProductShow = ({product}) =>{
    const {doRequest,errors} = useRequest({
        url: `/api/orders`,
        method: 'post',
        body:{
            productId: product.id
        },
        onSuccess: order=> Router.push('/orders/[orderId]',`/orders/${order.id}`)
    })


    return (
     <div class="card mb-3" >
    <div class="row no-gutters">
        <div class="col-md-4">
        <img src="/logo.png" class="card-img" alt="..."/>
        </div>
        <div class="col-md-8">
        <div class="card-body">
        <h1 class="card-title">{product.title}</h1>
        <h5 class="card-title"> Price: ${product.price}</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            {errors}
            <button type="button" 
            onClick={()=>doRequest()}
            class="btn btn-outline-danger">
                Buy Now
            </button>
        </div>
        </div>
    </div>
     <div class="row"> 
    <div class="col-6">
        <Comments comments={product.commentRating} id={product.id}/>
    </div>
    </div>
</div>
    );
}
ProductShow.getInitialProps = async(context,client) =>{
    const {productId} = context.query;
    const {data} = await client.get(`/api/products/${productId}`);
    console.log('%%%%%',data);
    return {product: data};

}
export default ProductShow;