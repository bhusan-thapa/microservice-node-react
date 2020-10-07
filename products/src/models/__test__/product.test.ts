import {Product} from '../product';

it('implements optimimstic concurrency control',async(done)=>{
    // Create an instance of a product
    const product = Product.build({
        title: 'gun',
        price: 10,
        userId: '123'
    });

    //Save the product to the database
    await product.save();
    //fetch the product twice
    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);
    //make two separate changes to the products we fetched
    firstInstance!.set({price: 20});
    secondInstance!.set({price: 30});

    //save the first fecthed product
    await firstInstance!.save();

    //save the second fetched product and expect an error
    try{
        await secondInstance!.save();
    }catch(err){
        return done();
    }
    throw new Error('Should not reach here');
});


it('increments the version number each time the product is saved',async()=>{
    const product = Product.build({
        title: 'gun',
        price: 10,
        userId: '123'
    });
    await product.save();
    expect(product.version).toEqual(0);
    await product.save();
    expect(product.version).toEqual(1);
    await product.save();
    expect(product.version).toEqual(2);
})