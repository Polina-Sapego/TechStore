import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { setupWebSocket } from './socket';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

setupWebSocket(server);

const dataPath = path.join(__dirname, 'data', 'products.json');

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  inStock: boolean;
}

app.get('/products', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { products } = JSON.parse(raw) as { products: Product[] };

  const { sort, category } = req.query;
  let result = [...products];

  if (category && typeof category === 'string') {
    result = result.filter(p => p.category === category);
  }

  if (sort === 'asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    result.sort((a, b) => b.price - a.price);
  }

  res.json(result);
});

app.get('/products/:id', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { products } = JSON.parse(raw) as { products: Product[] };

  const product = products.find(p => p.id === Number(req.params.id));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/products', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as { products: Product[] };
  const products = data.products;

  const newProduct: Omit<Product, 'id'> = req.body;

  if (!newProduct.title || !newProduct.price || !newProduct.category) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  const product: Product = {
    id: maxId + 1,
    title: newProduct.title,
    price: newProduct.price,
    rating: newProduct.rating ?? 0,
    image: newProduct.image ?? '',
    category: newProduct.category,
    inStock: newProduct.inStock ?? true,
  };

  products.push(product);

  fs.writeFileSync(dataPath, JSON.stringify({ products }, null, 2), 'utf-8');

  res.status(201).json(product);
});

app.put('/products/:id', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as { products: Product[] };
  const products = data.products;

  const productId = Number(req.params.id);
  const updatedProduct: Omit<Product, 'id'> = req.body;

  if (!updatedProduct.title || !updatedProduct.price || !updatedProduct.category) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const existingProduct = products[productIndex];
  products[productIndex] = {
    id: productId,
    title: updatedProduct.title,
    price: updatedProduct.price,
    rating: updatedProduct.rating ?? existingProduct.rating,
    image: updatedProduct.image ?? existingProduct.image,
    category: updatedProduct.category,
    inStock: updatedProduct.inStock ?? existingProduct.inStock,
  };

  fs.writeFileSync(dataPath, JSON.stringify({ products }, null, 2), 'utf-8');

  res.json(products[productIndex]);
});

(async () => {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();

app.delete('/products/:id', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as { products: Product[] };
  const products = data.products;

  const productId = Number(req.params.id);
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify({ products }, null, 2), 'utf-8');

  return res.status(204).end();
});
