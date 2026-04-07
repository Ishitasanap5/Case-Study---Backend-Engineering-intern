const express = require('express');
const { Product, Inventory, Warehouse, Product_Suppliers, Supplier, Sales } = require('./models');
const router = express.Router();
const { Op } = require('sequelize');

// GET /api/companies/:companyId/alerts/low-stock
router.get('/api/companies/:companyId/alerts/low-stock', async (req, res) => {
    const { companyId } = req.params;

    try {
        // 1️Fetch all warehouses for the company
        const warehouses = await Warehouse.findAll({ where: { companyId } });
        if (!warehouses.length) {
            return res.json({ alerts: [], total_alerts: 0 });
        }

        const warehouseIds = warehouses.map(w => w.warehouse_id);

        // Fetch inventory for these warehouses
        const inventoryList = await Inventory.findAll({
            where: { warehouse_id: warehouseIds },
            include: [
                {
                    model: Product,
                    attributes: ['product_id', 'name', 'sku', 'threshold', 'last_sold_at'],
                },
                {
                    model: Warehouse,
                    attributes: ['warehouse_id', 'name'],
                }
            ]
        });

        const alerts = [];
   // Filter inventory for low stock and recent sales
        for (const inv of inventoryList) {
            const product = inv.Product;
            const warehouse = inv.Warehouse;

            // Skip if no recent sales (assume 30 days)
            const recentSales = product.last_sold_at && new Date(product.last_sold_at) > new Date(Date.now() - 30*24*60*60*1000);
            if (!recentSales) continue;

            // Skip if stock above threshold
            const threshold = product.threshold || 10; // default threshold
            if (inv.quantity > threshold) continue;

            // Calculate days until stockout (simplified: stock / avg daily sales)
            const avgDailySales = 2; // assumption, in real case we calculate from Sales table
            const daysUntilStockout = Math.ceil(inv.quantity / avgDailySales);

            // Get primary supplier info
            const productSupplier = await Product_Suppliers.findOne({
                where: { product_id: product.product_id },
                include: [{ model: Supplier, attributes: ['supplier_id', 'name', 'contact_email'] }]
            });

            alerts.push({
                product_id: product.product_id,
                product_name: product.name,
                sku: product.sku,
                warehouse_id: warehouse.warehouse_id,
                warehouse_name: warehouse.name,
                current_stock: inv.quantity,
                threshold: threshold,
                days_until_stockout: daysUntilStockout,
                supplier: productSupplier ? {
                    id: productSupplier.Supplier.supplier_id,
                    name: productSupplier.Supplier.name,
                    contact_email: productSupplier.Supplier.contact_email
                } : null
            });
        }
   return res.json({ alerts, total_alerts: alerts.length });

    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
