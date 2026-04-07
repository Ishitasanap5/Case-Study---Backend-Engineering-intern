//Companies
CREATE TABLE Companies (
   company_id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   address TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
//Warehouses
CREATE TABLE Warehouses (
   warehouse_id SERIAL PRIMARY KEY,
   company_id INT NOT NULL,
   name VARCHAR(255) NOT NULL,
   location TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (company_id) REFERENCES Companies(company_id) ON DELETE CASCADE
);
//Suppliers
CREATE TABLE Suppliers (
   supplier_id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   contact_email VARCHAR(255),
   phone VARCHAR(20),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



//Products
CREATE TABLE Products (
   product_id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   sku VARCHAR(50) UNIQUE NOT NULL,
   price DECIMAL(12,2) NOT NULL,
   description TEXT,
   is_bundle BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
//Product_Bundles (for bundle products)
CREATE TABLE Product_Bundles (
   bundle_id INT NOT NULL,
   product_id INT NOT NULL,
   quantity INT DEFAULT 1,
   PRIMARY KEY (bundle_id, product_id),
   FOREIGN KEY (bundle_id) REFERENCES Products(product_id) ON DELETE CASCADE,
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);
//Inventory
CREATE TABLE Inventory (
   inventory_id SERIAL PRIMARY KEY,
   product_id INT NOT NULL,
   warehouse_id INT NOT NULL,
   quantity INT DEFAULT 0,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
   FOREIGN KEY (warehouse_id) REFERENCES Warehouses(warehouse_id) ON DELETE CASCADE,
   UNIQUE (product_id, warehouse_id)  -- ensures one row per product per warehouse );
//Inventory_Changes
CREATE TABLE Inventory_Changes (
   change_id SERIAL PRIMARY KEY,
   inventory_id INT NOT NULL,
   old_quantity INT NOT NULL,
   new_quantity INT NOT NULL,
   changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   change_reason TEXT,
   FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id) ON DELETE CASCADE
);
//Product_Suppliers
CREATE TABLE Product_Suppliers (
   product_id INT NOT NULL,
   supplier_id INT NOT NULL,
   cost_price DECIMAL(12,2),
   PRIMARY KEY (product_id, supplier_id),
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
   FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE CASCADE
);
