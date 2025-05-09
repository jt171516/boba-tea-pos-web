import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import passport from "passport";
import jwt from "jsonwebtoken";
import "./auth.js";

dotenv.config();

// set up PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
});

// Express app setup
const app = express();
app.set("trust proxy", 1);
const PORT = 5001;

// Set up session and passport middleware
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false, saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", } 
}));

// Configure CORS
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true
};
  
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet()); //security middleware to provide HTTPS headers
app.use(morgan("dev")); //log all requests
app.use(passport.initialize()); //initialize passport for authentication

// Route test
app.get("/", (req,res) => {
    console.log(res.getHeaders());
    res.send("Hello from the backend");
})

// Route to get all items
app.get("/api/item", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to submit new item 
app.post("/api/item", async (req, res) => {
    const { id, name, category, calories, price, sales } = req.body;
  
    try {
      const query = `
        INSERT INTO item (id, name, category, calories, price, sales)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [id, name, category, calories, price, sales];
      const result = await pool.query(query, values);
  
      res.status(201).json(result.rows[0]); // Return the newly added item
    } catch (error) {
      console.error("Error inserting item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Route to edit an item
  app.put("/api/item/:id", async (req, res) => {
    const { id } = req.params;
    const { name, category, calories, price, sales } = req.body;
  
    try {
      const query = `
        UPDATE item
        SET name = $1, category = $2, calories = $3, price = $4, sales = $5
        WHERE id = $6
        RETURNING *;
      `;
      const values = [name, category, calories, price, sales, id];
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Route to delete item
app.delete("/api/item/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = "DELETE FROM item WHERE id = $1 RETURNING *;";
      const values = [id];
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Route to get all inventory items
app.get("/api/inventory", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        console.log("Fetched inventory data:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to fetch all inventory items
app.get("/api/inventory-usage", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id AS inventory_id,
        name AS inventory_name,
        qty AS quantity
      FROM inventory
      ORDER BY name ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

// Route to edit inventory item quantity
app.put("/api/inventory/:id/quantity", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const query = `
      UPDATE inventory
      SET qty = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [quantity, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    res.status(200).json(result.rows[0]); // Return the updated inventory item
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a new employee
app.post("/api/employees", async (req, res) => {
  const { id, name, manager, password } = req.body;

  try {
    const query = `
      INSERT INTO employee (id, name, manager, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id, name, manager, password];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]); // Return the newly added employee
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to edit an employee
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, manager, password } = req.body;

  try {
    const query = `
      UPDATE employee
      SET name = $1, manager = $2, password = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [name, manager, password, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(result.rows[0]); // Return the updated employee
  } catch (error) {
    console.error("Error editing employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete an employee
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM employee WHERE id = $1 RETURNING *;";
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get item id by name
app.get("/api/item/:name", async (req, res) => {
    const itemName = req.params.name;
    try {
        const result = await pool.query("SELECT * FROM item WHERE name = $1", [itemName]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get the most recent open order
app.get("/api/orders/open", async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM orders WHERE is_closed = false ORDER BY id DESC LIMIT 1");
        if (result.rows.length === 0){
            return res.status(404).json({ error: "No open orders found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to create a new order entry with empty values
app.post("/api/createOrder", async (req, res) => {
    try{
        const result = await pool.query(
            "INSERT INTO orders (name, totalprice, timestamp, payment, is_closed) VALUES ($1, $2, $3, $4, $5) RETURNING id", 
            ["", 0, new Date().toISOString(),"", false]
        );
        const orderId = result.rows[0].id;
        res.status(201).json({ orderId });
    } catch (error) {
        console.error("Error creating dummy order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to submit an order
app.put("/api/orders/:id", async (req, res) => {
    const {id} = req.params;
    const {totalprice, payment, is_closed} = req.body;
    try {
      
        const itemsResult = await pool.query(
            `SELECT i.name 
             FROM ordersitemjunction oij
             JOIN item i ON oij.itemid = i.id
             WHERE oij.orderid = $1`,
            [id]
        );

        const itemNames = itemsResult.rows.map(row => row.name).join(", ");

        await pool.query(
            "UPDATE orders SET name = $1, totalprice = $2, timestamp = $3, payment = $4, is_closed = $5 WHERE id = $6",
            [itemNames, totalprice, new Date().toISOString(), payment, is_closed, id]
        );
        res.status(200).json({ message: "Order submitted successfully" });
    } catch (error) {
        console.error("Error submitting order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
 
//Route to create a new orderItemId and update the order's name column
app.post("/api/orderItemId", async (req, res) => {
    const {orderId, itemId, itemName} = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO ordersitemjunction (orderid, itemid) VALUES ($1, $2) RETURNING orderitemid",
            [orderId, itemId]
        );
        const orderItemId = result.rows[0].orderitemid;

        //const sanitizedItemName = String(itemName).trim();
        await pool.query(
            "UPDATE orders SET name = COALESCE(name, '') || CASE WHEN name IS NULL OR name = '' THEN '' ELSE ', ' END || $1 WHERE id = $2",
            [itemName, orderId]
        );

        res.status(201).json({ orderItemId });
    } catch (error) {
        console.error("Error creating order item ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get modifiers based on selected options
app.post("/api/modifiers", async (req, res) => {
    //Receive selected modifiers from the frontend
    const {size, sugar, ice, toppings} = req.body; 
    try {
        const modifiers = [];
        for (const topping of toppings){
            const result = await pool.query("SELECT id FROM modifier WHERE size = $1 AND sweetness_level = $2 AND ice_level = $3 AND topping = $4", 
                [size, sugar, ice, topping]
            );
            if (result.rows.length > 0) {
                modifiers.push(result.rows[0]); //Push the modifier ID to the array
            }
        }
        res.json(modifiers); //Return all matching modifiers IDs
    } catch (error) {
        console.error("Error fetching modifiers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Route to insert into ordersitemmodifierjunction table
app.post("/api/ordersitemmodifierjunction", async (req, res) => {
    //Receive item ID and modifier IDs from the frontend
    const { orderItemId, modifiers} = req.body; 
    
    console.log("Received itemId:", orderItemId);
    console.log("Received modifiers_id:", modifiers);

    try {
        for (const modifier of modifiers){
            await pool.query(
                "INSERT INTO ordersitemmodifierjunction (orderitemid, modifierid, qty) VALUES ($1, $2, $3)",
                [orderItemId, modifier, 1]
            );
        }
        res.status(201).json({ message: "Modifiers inserted successfully" });
    } catch (error) {
        console.error("Error inserting into ordersitemmodifierjunction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to update the payment method for an order
app.put("/api/orders/:id/payment", async (req, res) => {
    const { id } = req.params;
    const { payment } = req.body;

    try {
        await pool.query(
            "UPDATE orders SET payment = $1 WHERE id = $2",
            [payment, id]
        );
        res.status(200).json({ message: "Payment method updated successfully" });
    } catch (error) {
        console.error("Error updating payment method:", error);
        res.status(500).json({ error: "Internal server error" });
    }

});

// Route to delete an item from an order
app.delete("/api/orderItem/:orderItemId", async (req, res) => {
    const { orderItemId } = req.params;

    try {
        // Delete from ordersitemjunction
        const result = await pool.query("DELETE FROM ordersitemjunction WHERE orderitemid = $1 RETURNING *", [orderItemId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Order item not found" });
        }

        res.status(200).json({ message: "Order item removed successfully" });
    } catch (error) {
        console.error("Error deleting order item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to fetch all orders
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY timestamp DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch orders within a specific date range
app.get("/api/orders/date-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp DESC",
      [new Date(startDate), new Date(endDate)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch a single order by ID
app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to check if employee is manager
function isManager(req, res, next) {
    if (!req.user.manager) {
        return res.status(403).json({ error: "Access denied. Managers only." });
    }
    next();
}

// Initiate Google authentication
app.get('/auth/google', (req, res, next) => {
    const redirectUrl = req.query.state || '/';
    req.session.redirectUrl = redirectUrl;
    passport.authenticate('google', { scope: ['email', 'profile'], state: redirectUrl, session: false })(req, res, next);
});

// Callback route for authentication
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
    (req, res) => {
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const redirectUrl = req.query.state || '/';
        res.redirect(`${redirectUrl}?token=${token}`);
    }
);

// Redirect for failed authentication
app.get('/auth/failure', (req, res) => {
    const redirectUrl = req.session.redirectUrl || '/';
    req.session.redirectUrl = null;
    res.redirect(`${redirectUrl}?loginFailure=true`);
});

// Protected route to check if user is logged in
app.get('/auth/protected', passport.authenticate('jwt', {session: false }), (req, res) => {
    res.send(`Hello ${req.user.displayName}, you are authenticated!`);
});

// Logout route
app.get('/auth/logout', (req, res) => {
    const redirectUrl = req.query.state || '/';
    res.redirect(`${redirectUrl}?logout=true`);
});

// Check if manager
app.get('/auth/manager', passport.authenticate('jwt', {session: false }), isManager, (req, res) => {
    res.send(`Hello ${req.user.displayName}, you are a manager!`);
});

// X Report: Fetch hourly sales data for the current day
app.get("/api/x-report", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                EXTRACT(HOUR FROM timestamp) AS hour, 
                COUNT(DISTINCT id) AS total_orders, 
                COALESCE(SUM(CASE WHEN totalprice > 0 THEN totalprice ELSE 0 END), 0) AS total_sales, 
                COALESCE(SUM(CASE WHEN totalprice < 0 THEN -totalprice ELSE 0 END), 0) AS total_returns, 
                COUNT(*) AS total_items, 
                COUNT(CASE WHEN payment = 'cash' THEN 1 END) AS cash_payments, 
                COUNT(CASE WHEN payment = 'card' THEN 1 END) AS card_payments 
            FROM orders 
            WHERE DATE(timestamp) = CURRENT_DATE 
            GROUP BY hour 
            ORDER BY hour;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching X Report:", error);
        res.status(500).json({ error: "Failed to fetch X Report" });
    }
});

// Z Report: Fetch cumulative sales data with detailed breakdown
app.get("/api/z-report", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(o.totalprice), 0) AS total_sales, 
                COALESCE(SUM(CASE WHEN o.payment = 'cash' THEN o.totalprice ELSE 0 END), 0) AS cash_total, 
                COALESCE(SUM(CASE WHEN o.payment = 'card' THEN o.totalprice ELSE 0 END), 0) AS card_total, 
                COUNT(CASE WHEN o.payment = 'cash' THEN 1 END) AS cash_count, 
                COUNT(CASE WHEN o.payment = 'card' THEN 1 END) AS card_count, 
                COUNT(oj.itemid) AS total_items 
            FROM orders o 
            LEFT JOIN ordersitemjunction oj ON o.id = oj.orderid 
            WHERE DATE(o.timestamp) = CURRENT_DATE 
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching Z Report:", error);
        res.status(500).json({ error: "Failed to fetch Z Report" });
    }
});

// Product Usage Report: Fetch product usage data within a specific time span
app.get("/api/product-usage", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        product_id, 
        product_name, 
        SUM(quantity) AS total_quantity
      FROM order_items
      WHERE timestamp BETWEEN $1 AND $2
      GROUP BY product_id, product_name
      ORDER BY total_quantity DESC;
    `, [new Date(startDate), new Date(endDate)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No product usage data found for the specified time span" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Product Usage Report:", error);
    res.status(500).json({ error: "Failed to fetch Product Usage Report" });
  }
});

// Product Usage Report: Fetch usage data for a specific inventory item over time
app.get("/api/product-usage/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        DATE(o.timestamp) AS usage_date,
        SUM(oj.qty) AS total_quantity_used
      FROM orders o
      JOIN ordersitemjunction oj ON o.id = oj.orderid
      WHERE oj.itemid = $1
      GROUP BY usage_date
      ORDER BY usage_date ASC;
    `, [itemId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No usage data found for the specified item" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Product Usage Report:", error);
    res.status(500).json({ error: "Failed to fetch Product Usage Report" });
  }
});

// Inventory Usage Report: Fetch inventory usage data
app.get("/api/inventory-usage", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        inventory.name AS inventory_name,
        SUM(oi.quantity) AS inventory_count
      FROM inventory
      JOIN iteminventoryjunction ii ON inventory.id = ii.inventoryid
      JOIN ordersitemjunction oi ON ii.itemid = oi.itemid
      GROUP BY inventory.name
      ORDER BY inventory.name;
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No inventory usage data found" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory usage report:", error);
    res.status(500).json({ error: "Failed to fetch inventory usage report" });
  }
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})