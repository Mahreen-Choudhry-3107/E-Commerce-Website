const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const products = require('../data/products.json');

let orders = [];

router.post('/', (req, res) => {
  const { items, customer } = req.body;

  if (!items || !items.length || !customer) {
    return res.status(400).json({ error: 'Items and customer information are required' });
  }

  let total = 0;
  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    const subtotal = product.price * item.quantity;
    total += subtotal;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal
    };
  }).filter(Boolean);

  if (orderItems.length === 0) {
    return res.status(400).json({ error: 'No valid products in order' });
  }

  const order = {
    id: uuidv4(),
    items: orderItems,
    customer,
    total: Math.round(total * 100) / 100,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json(order);
});

router.get('/', (req, res) => {
  res.json(orders);
});

module.exports = router;
