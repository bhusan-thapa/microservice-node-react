import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import {OrderStatus} from '@gazmer-ecomm2/common';
import {ProductDoc} from './product';

export { OrderStatus };

interface OrderAttrs{
    userId: string;
    status: OrderStatus;
    product: ProductDoc;
}

interface OrderDoc extends mongoose.Document{
    userId: string;
    status: OrderStatus;
    product: ProductDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
},{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs:OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);

export {Order};


