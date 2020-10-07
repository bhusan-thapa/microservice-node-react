import Link from 'next/link'
const LandingPage = ({ currentUser,products }) => {

  const productList = products.map(product=>{
    return(
      <div class="col" key={product.id}>
        <div className="card" style={{width: 18+ "rem"}}>
        <img src="/logo.png" className="card-img-top" alt="..."/>
        <div className="card-body">
          <h5 className="card-title">
          <Link href="/products/[productId]"
            as={`/products/${product.id}`}
           >{product.title}
          </Link> 
           </h5>
          <h5 className="card-title">Price: ${product.price}</h5>
          <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <Link href="/products/[productId]"
            as={`/products/${product.id}`}
           className="btn btn-primary">View Detail
          </Link> 
        </div>
      </div>
</div>
    );
  })
  return(
    <div>
      <h1>Products</h1>
      <div className="row">
      {productList}

      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context,client,currentUser) => {
  const {data} = await client.get('/api/products');

  return {products: data};
};

export default LandingPage;
