import express,{Request,Response} from 'express';
import {Product} from '../models/product';
import FuzzySearch from 'fuzzy-search';
// import {getCache,setCache} from '../services/cache';

const router = express.Router();

router.get('/api/products',async(req:Request,res:Response)=>{
    
	if (req.query && req.query.name) {
		const search_keyword = (req.query as any).name;
		// const cachedProduct = await getCache(search_keyword);
	    // 	if(cachedProduct){
		// 	console.log('from cache');
		// 	return res.send(JSON.parse(cachedProduct));
	    // 	}
		const products = await Product.find({});
		const fuzzy = new FuzzySearch(products, ["title"], {caseSensitive: false,});
		const result = fuzzy.search(search_keyword);
		
		// console.log('from mongo');
    		// setCache(search_keyword,JSON.stringify(result));
		res.send(result);
			
	}else{
		const products = await Product.find({});
		res.send(products);
    }
})

export {router as listProductRouter}
