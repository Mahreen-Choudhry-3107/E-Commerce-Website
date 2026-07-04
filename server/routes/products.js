const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
