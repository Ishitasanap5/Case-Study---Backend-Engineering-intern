
# Inventory Management API

A backend API for managing products, inventory, and low-stock alerts across warehouses.

## Table of Contents

* [APIs](#apis)

  * [1. Create Product](#1-create-product)
  * [2. Low Stock Alerts](#2-low-stock-alerts)
* [Database Schema](#database-schema)
## APIs

### 1. Create Product

**POST** `/api/products`

**Body:**

```json
{
  "name": "Product Name",
  "sku": "SKU001",
  "price": 100.50,
  "warehouseId": 1,
  "initialQuantity": 50,        // optional
  "description": "Product details", // optional
  "category": "Category Name"      // optional
}
```

**Response:**

```json
{
  "message": "Product created",
  "productId": 123
}
```

---

### 2. Low Stock Alerts

**GET** `/api/companies/:companyId/alerts/low-stock`

**Response:**

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
```

---

## Database Schema

The database schema is defined in `docs/Schema.swql`.
> See [docs/Schema.swql](docs/Schema.swql) for full ER diagram and relationships.

---

## Author

**Ishita Nitin Sanap**
Email: [ishitasanap5@gmail.com](mailto:ishitasanap5@gmail.com)

---

