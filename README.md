# Inventory Management API

## APIs

### 1. Create Product
POST `/api/products`  
- Body: `{ name, sku, price, warehouseId, initialQuantity?, description?, category? }`
- Returns: `{ message: "Product created", productId }`

### 2. Low Stock Alerts
GET `/api/companies/:companyId/alerts/low-stock`  
- Returns: 
```json
{
  "alerts": [
    {
      "product_id": 123,
      "product_name": "Widget A",
      "sku": "WID-001",
      "warehouse_id": 456,
      "warehouse_name": "Main Warehouse",
      "current_stock": 5,
      "threshold": 20,
      "days_until_stockout": 12,
      "supplier": {
        "id": 789,
        "name": "Supplier Corp",
        "contact_email": "orders@supplier.com"
      }
    }
  ],
  "total_alerts": 1
}