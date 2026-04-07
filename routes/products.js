// Import dependencies
const express = require('express');
const { Product, Inventory, sequelize } = require('./models'); // Sequelize models
const router = express.Router();
// POST /api/products – Create a new product
router.post('/api/products', async (req, res) => {
    const data = req.body;
    // Validate required fields
    const { name, sku, price, warehouseId, initialQuantity = 0, description, category } = data;
    if (!name || !sku || price === undefined || !warehouseId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Convert price to decimal and check validity
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Price must be a number' });
    }
    try {
        // Check SKU uniqueness
        const existingProduct = await Product.findOne({ where: { sku } });
        if (existingProduct) {
            return res.status(409).json({ error: 'SKU already exists' });
        }
        //  Create Product and Inventory atomically
        const result = await sequelize.transaction(async (t) => {
            const product = await Product.create(
                { name, sku, price: parsedPrice, description, category },
                { transaction: t }
            );
            await Inventory.create(
                { productId: product.id, warehouseId, quantity: initialQuantity },
                { transaction: t }
            );
            return product;
        });
        // Success response
        return res.status(201).json({ message: 'Product created', productId: result.id });
    } catch (error) {
        // Handle errors
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Export the router
module.exports = router;

