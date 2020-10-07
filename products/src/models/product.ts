import mongoose, { mongo } from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

import {Question} from './qna';
interface CommentAttrs {
    comments: string;
    rating: number;
    userId: string;
}
interface QuestionAttrs{
    question: string;
    answer?: string;
    userId:string;
    _id?: string;
}

interface ProductAttrs {
    title:string;
    price:number;
    userId:string;
    commentRating?: CommentAttrs[];
    questions?: QuestionAttrs[];
}


interface ProductDoc extends mongoose.Document{
    title:string;
    price: number;
    userId: string;
    commentRating?: CommentAttrs[];
    questions?: QuestionAttrs[];
    version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc>{
    build(attrs:ProductAttrs):ProductDoc;
}

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    commentRating: {type:Array, default:[]},
    questions: {type:[Question],default:[]}

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

productSchema.statics.build = (attrs: ProductAttrs)=>{
    return new Product(attrs);
};

const Product = mongoose.model<ProductDoc,ProductModel>('Product',productSchema);

export {Product};
