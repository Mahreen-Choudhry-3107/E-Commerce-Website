const express = require('express');
const router = express.Router();

let carts = {};

router.get('/:sessionId', (req, res) => {
  const cart = carts[req.params.sessionId] || [];
  res.json(cart);
});

router.post('/:sessionId', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  if (!carts[req.params.sessionId]) {
    carts[req.params.sessionId] = [];
  }

  const cart = carts[req.params.sessionId];
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.json(cart);
});

router.put('/:sessionId/:productId', (req, res) => {
  const { quantity } = req.body;
  const cart = carts[req.params.sessionId];

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = cart.find(i => i.productId === req.params.productId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  item.quantity = quantity;
  res.json(cart);
});

router.delete('/:sessionId/:productId', (req, res) => {
  const cart = carts[req.params.sessionId];
  if (cart) {
    carts[req.params.sessionId] = cart.filter(i => i.productId !== req.params.productId);
  }
  res.json(carts[req.params.sessionId] || []);
});

module.exports = router;
