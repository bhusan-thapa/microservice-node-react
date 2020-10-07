import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {errorHandler,NotFoundError,currentUser} from '@gazmer-ecomm2/common';

import {createProductRouter} from './routes/new';
import {showProductRouter} from './routes/show';
import {listProductRouter} from './routes/list';
import {updateProductRouter} from './routes/update';
import {uploadProduct} from './routes/upload';
import {addCommentRouter} from './routes/add-comment';
import {addQuestionRouter} from './routes/add-questions';
import {addAnswerRouter} from './routes/add-answer';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !=='test'
    })
);
app.use(currentUser);
app.use(createProductRouter);
app.use(showProductRouter);
app.use(listProductRouter);
app.use(updateProductRouter);
app.use(uploadProduct);
app.use(addCommentRouter);
app.use(addQuestionRouter);
app.use(addAnswerRouter);

app.all('*',()=>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app};