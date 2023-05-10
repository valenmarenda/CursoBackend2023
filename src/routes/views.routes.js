import { Router } from 'express';
import fs from 'fs';

const productsPath = "src/files/Products.json";
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

const router = Router();

router.get('/', (req,res)=>{
    res.render('home', { products: productsData });
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realtimeproducts', { products: productsData });
})

export default router;