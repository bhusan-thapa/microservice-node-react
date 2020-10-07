import mongoose, { version } from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface ProductAttrs{
    title: string;
    price: number;
    id: string;
};

export interface ProductDoc extends mongoose.Document{
    title: string;
    price: number;
    version: number;
};

interface ProductModel extends mongoose.Model<ProductDoc>{
    build(attrs:ProductAttrs):ProductDoc;
    findByEvent(event: {id: string, version: number}):Promise<ProductDoc | null>;
};

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

productSchema.set('versionKey','version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.findByEvent = (event: {id:string, version: number})=>{
    return Product.findOne({
        _id: event.id,
        version: event.version -1
    })
};
productSchema.statics.build = (attrs: ProductAttrs) =>{
    return new Product({
        _id : attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

const Product = mongoose.model<ProductDoc,ProductModel>('Product',productSchema);

export {Product};