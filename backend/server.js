const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const moment = require('moment');
// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for simplicity
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "R00tp@ssword", //local MySQL password
    database: "limenerp",
    port: 3307
})

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        console.error("Error code:", err.code);
        console.error("SQL State:", err.sqlState);
        return;
    }
    console.log("Connected to the MySQL database.");
});


app.post('/login', (req, res) => {
    const { userName, userPassword } = req.body;

    // Check if the user exists and the password is correct
    const query = `
        SELECT u.userID, b.branchID, b.branchName
        FROM user u
        JOIN employee e ON u.userID = e.user_id_fk
        JOIN branch b ON e.branch_id_fk = b.branchID
        WHERE u.userName = ? AND u.userPassword = ?;
    `;

    db.query(query, [userName, userPassword], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length > 0) {
            const { userID, branchID, branchName } = results[0];
            res.json({ message: "Success", userID, branchID, branchName });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Fetch Users
app.get('/api/users', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: 'Error fetching user data' });
        }
        console.log("Fetched user data:", results); // Log fetched data
        res.json(results);
    });
});

app.get('/api/users/check-username', (req, res) => {
    const { userName } = req.query; // Ensure this matches your frontend query
    console.log('Received username:', userName); // Log the username

    const query = 'SELECT COUNT(*) AS count FROM user WHERE userName = ?'; // Keep 'userName' in the query

    db.query(query, [userName], (error, results) => {
        if (error) {
            console.error('Error executing query:', error); // Log the error
            return res.status(500).json({ message: 'Internal Server Error', error }); // Include error for debugging
        }

        const exists = results[0].count > 0; // Check if user exists
        return res.json({ exists }); // Respond with existence status
    });
});


// Add a New User
app.post('/api/users', (req, res) => {
    console.log("Received POST request:", req.body);

    // Ensure the column names match the table schema
    const { userName, userPassword, userType } = req.body;

    if (!userName || !userPassword || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const sql = "INSERT INTO user (userName, userPassword, userType) VALUES (?, ?, ?)";
    db.query(sql, [userName, userPassword, userType], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: 'Error inserting user' });
        }
        console.log("User added:", result);
        
        res.status(201).json({ message: 'User added successfully!' });
    });
});

// Update an Existing User
app.put('/api/users/:userID', (req, res) => {
    const userID = req.params.userID;
    const { userName, userPassword, userType } = req.body;

    if (!userName || !userPassword || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = "UPDATE user SET userName = ?, userPassword = ?, userType = ? WHERE userID = ?";
    db.query(sql, [userName, userPassword, userType, userID], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: 'Error updating user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User updated:", result);
        res.status(200).json({ message: 'User updated successfully!' });
    });
});

// Delete an Existing User
app.delete('/api/users/:userID', (req, res) => {
    const userID = req.params.userID;
    const query = 'DELETE FROM user WHERE userID = ?';

    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to delete user.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    });
});

// Fetch Employees
app.get('/api/employees', (req, res) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching employee data:", err);
            return res.status(500).json({ error: 'Error fetching employee data' });
        }
        console.log("Fetched employee data:", results); // Log fetched data
        res.json(results);
    });
});


// Add a New Employee
app.post('/api/employees', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        empLName,
        empFName,
        empMName,
        empAge,
        empSex,
        empAddr,
        empPosition,
        empDailySalary,
        dateHired,
        empContNo,
        empEmail,
        user_id_fk,
        branch_id_fk
    } = req.body;

    if (!empLName || !empFName || !empAge || !empSex || !empAddr || !empPosition || !empDailySalary || !empContNo || !empEmail) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'INSERT INTO employee (empLName, empFName, empMName, empAge, empSex, empAddr, empPosition, empDailySalary, dateHired, empContNo, empEmail, user_id_fk, branch_id_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [empLName, empFName, empMName, empAge, empSex, empAddr, empPosition, empDailySalary, dateHired, empContNo, empEmail, user_id_fk, branch_id_fk],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add employee' });
            }
            res.status(201).json({ message: 'Employee added successfully' });
        }
    );
});
  
// Update an existing Employee
app.put('/api/employees/:empID', (req, res) => {
    const empID = req.params.empID;
    const { empLName, empFName, empMName, empAge, empSex, empAddr, empPosition, empDailySalary, dateHired, empContNo, empEmail, user_id_fk, branch_id_fk } = req.body;

    // Validate required fields
    if (!empLName || !empFName || !empAge || !empSex || !empAddr || !empPosition || !empDailySalary || !empContNo || !empEmail || !user_id_fk || !branch_id_fk) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = "UPDATE employee SET empLName = ?, empFName = ?, empMName = ?, empAge = ?, empSex = ?, empAddr = ?, empPosition = ?, empDailySalary = ?, dateHired = ?, empContNo = ?, empEmail = ?, user_id_fk = ?, branch_id_fk = ? WHERE empID = ?";
    
    db.query(sql, [empLName, empFName, empMName, empAge, empSex, empAddr, empPosition, empDailySalary, dateHired, empContNo, empEmail, user_id_fk, branch_id_fk, empID], (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ error: 'Error updating employee' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        console.log("Employee updated:", result);
        res.status(200).json({ message: 'Employee updated successfully!' });
    });
});


// Delete an existing Employee
app.delete('/api/employees/:empID', (req, res) => {
    const empID = req.params.empID;
    const query = 'DELETE FROM employee WHERE empID = ?';
  
    db.query(query, [empID], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Failed to delete employee.' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully!' });
    });
  });


// Fetch Attendance_Logs for Table
app.get('/api/attendance_logs', (req, res) => {
    const sql = "SELECT * FROM attendance_log";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching attendance_log data:", err);
            return res.status(500).json({ error: 'Error fetching attendance_log data' });
        }
        console.log("Fetched attendance_log data:", results); // Log fetched data
        res.json(results);
    });
});


// Helper function to calculate hours between two timestamps
const calculateHours = (timeIn, timeOut) => {
    const start = moment(timeIn);
    const end = moment(timeOut);
    const hours = end.diff(start, 'hours', true); // Get the difference in hours, including decimals

    return Math.min(hours, 8); // Cap at 8 hours
};

// POST endpoint to add attendance log
app.post('/api/attendance_logs', (req, res) => {
    const { emp_id_fk, timeIn, timeOut, attendanceDate } = req.body;

    const noOfHours = timeIn && timeOut ? calculateHours(timeIn, timeOut) : null;

    // SQL query to insert attendance log
    const sql = `
        INSERT INTO attendance_log (attendanceDate, timeIn, timeOut, emp_id_fk, noOfHours) 
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [attendanceDate, timeIn, timeOut, emp_id_fk, noOfHours], (err, result) => {
        if (err) {
            console.error('Error inserting attendance log:', err);
            return res.status(500).send('Error inserting attendance log');
        }
        res.status(201).send({ id: result.insertId, emp_id_fk, attendanceDate, timeIn, timeOut, noOfHours });
    });
});

// PUT endpoint to update attendance log
app.put('/api/attendance_logs/:attendanceID', (req, res) => {
    const { attendanceID } = req.params;
    const { timeOut } = req.body;

    // Fetch the existing attendance log to get timeIn
    const fetchSql = `SELECT timeIn FROM attendance_log WHERE attendanceID = ?`;
    db.query(fetchSql, [attendanceID], (err, result) => {
        if (err) {
            console.error('Error fetching attendance log:', err);
            return res.status(500).send('Error fetching attendance log');
        }

        if (result.length === 0) {
            return res.status(404).send('Attendance log not found');
        }

        const timeIn = result[0].timeIn;
        const noOfHours = calculateHours(timeIn, timeOut); // Calculate hours based on timeIn and timeOut

        const sql = `
            UPDATE attendance_log 
            SET timeOut = ?, noOfHours = ?
            WHERE attendanceID = ?`;

        db.query(sql, [timeOut, noOfHours, attendanceID], (err) => {
            if (err) {
                console.error('Error updating attendance log:', err);
                return res.status(500).send('Error updating attendance log');
            }

            res.status(200).send({ timeIn, timeOut, noOfHours });
        });
    });
});


// Fetch Attendance Logs for a specific employee and date
app.get('/api/attendance_logs/:emp_id_fk/:attendanceDate', (req, res) => {
    const { emp_id_fk, attendanceDate } = req.params;

    const sql = `
        SELECT * FROM attendance_log 
        WHERE emp_id_fk = ? AND attendanceDate = ?`;

    db.query(sql, [emp_id_fk, attendanceDate], (err, results) => {
        if (err) {
            console.error("Error fetching attendance_log data:", err);
            return res.status(500).json({ error: 'Error fetching attendance_log data' });
        }
        console.log("Fetched attendance_log data:", results); // Log fetched data
        res.json(results);
    });
});

// Fetch Salary_Transaction
app.get('/api/salaries', (req, res) => {
    const sql = "SELECT * FROM salary_transaction";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching salary_transaction data:", err);
            return res.status(500).json({ error: 'Error fetching salary_transaction data' });
        }
        console.log("Fetched salary_transaction data:", results); // Log fetched data
        res.json(results);
    });
});

// Fetch total hours worked by employee within a date range
app.get('/api/attendance/total-hours', (req, res) => {
    const { emp_id_fk, start, end } = req.query;

    const sql = `
        SELECT SUM(noOfHours) AS totalHours 
        FROM attendance_log 
        WHERE emp_id_fk = ? AND attendanceDate BETWEEN ? AND ?
    `;
    db.query(sql, [emp_id_fk, start, end], (err, results) => {
        if (err) {
            console.error("Error calculating total hours:", err);
            return res.status(500).json({ error: 'Error calculating total hours' });
        }
        const totalHours = results[0].totalHours || 0; // Default to 0 if no records found
        res.json({ totalHours });
    });
});

// Fetch employee details by emp_id
app.get('/api/employees/:emp_id', (req, res) => {
    const emp_id = req.params.emp_id; // Get emp_id from the request params
    const sql = "SELECT empID, empFName, empLName, empDailySalary FROM employee WHERE empID = ?";

    db.query(sql, [emp_id], (err, result) => {
        if (err) {
            console.error("Error fetching employee data:", err);
            return res.status(500).json({ error: 'Error fetching employee data' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(result[0]); // Send the employee's details
    });
});

// Insert salary transaction
app.post('/api/salaries', (req, res) => {
    const {
        paymentDate,
        payPeriodStart,
        payPeriodEnd,
        totalHours,
        totalSalary,
        handledBy,
        emp_id_fk
    } = req.body;

    // Check if all required fields are present
    if (!paymentDate || !payPeriodStart || !payPeriodEnd || !totalHours || !totalSalary || !handledBy || !emp_id_fk) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SQL query to insert salary transaction
    const sql = `
        INSERT INTO salary_transaction 
        (paymentDate, payPeriodStart, payPeriodEnd, totalHours, totalSalary, handledBy, emp_id_fk)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert data into salary_transaction table
    db.query(sql, [paymentDate, payPeriodStart, payPeriodEnd, totalHours, totalSalary, handledBy, emp_id_fk], (err, result) => {
        if (err) {
            console.error("Error inserting salary transaction:", err);
            return res.status(500).json({ error: 'Error inserting salary transaction' });
        }

        // Successfully inserted
        res.status(201).json({ message: 'Salary transaction added successfully', transactionId: result.insertId });
    });
});

// Delete an Existing Salary_transaction
app.delete('/api/salaries/:salaryID', (req, res) => {
    const salaryID = req.params.salaryID;
    const query = 'DELETE FROM salary_transaction WHERE salaryID = ?';

    db.query(query, [salaryID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to delete salary.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Salary not found.' });
        }

        res.status(200).json({ message: 'Salary deleted successfully!' });
    });
});

// Fetch Branches
app.get('/api/branches', (req, res) => {
    const sql = "SELECT * FROM branch"; // Adjust SQL query as needed
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching branches data:", err);
            return res.status(500).json({ error: 'Error fetching branches data' });
        }
        console.log("Fetched user data:", results); // Log fetched data
        res.json(results);
    });
});

// Fetch Branch Employees
app.get('/api/branchemployees', (req, res) => {
    const sql = "SELECT e.empID, CONCAT(e.empLName, ', ', e.empFName, ' ', e.empMName) AS empName, e.empPosition, e.empContNo, b.branchID, b.branchName FROM employee e INNER JOIN branch b ON e.branch_id_fk = b.branchID"; // Adjust SQL query as needed
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching branches data:", err);
            return res.status(500).json({ error: 'Error fetching branches data' });
        }
        console.log("Fetched user data:", results); // Log fetched data
        res.json(results);
    });
});
  

// Add a New Branch
app.post('/api/branches', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        branchName,
        branchAddr,
        branchContNo,
        branchEmail,
        branchType,
        branchManager
    } = req.body;

    if (!branchName || !branchAddr || !branchContNo || !branchEmail || !branchType) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'INSERT INTO branch (branchName, branchAddr, branchContNo, branchEmail, branchType, branchManager) VALUES (?, ?, ?, ?, ?, ?)',
        [branchName, branchAddr, branchContNo, branchEmail, branchType, branchManager],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add branch' });
            }
            res.status(201).json({ message: 'Branch added successfully' });
        }
    );
});
  
// Update an existing Branch
app.put('/api/branches/:branchID', (req, res) => {
    const branchID = req.params.branchID;
    const { branchName, branchAddr, branchContNo, branchEmail, branchType, branchManager } = req.body;

    // Validate required fields
    if (!branchName || !branchAddr || !branchContNo || !branchEmail || !branchType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = "UPDATE branch SET branchName = ?, branchAddr = ?, branchContNo = ?, branchEmail = ?, branchType = ?, branchManager = ? WHERE branchID = ?";
    
    db.query(sql, [branchName, branchAddr, branchContNo, branchEmail, branchType, branchManager, branchID], (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ error: 'Error updating employee' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        console.log("Employee updated:", result);
        res.status(200).json({ message: 'Employee updated successfully!' });
    });
});

// Delete an Existing Branch
app.delete('/api/branches/:branchID', (req, res) => {
    const branchID = req.params.branchID;
    const query = 'DELETE FROM branch WHERE branchID = ?';

    db.query(query, [branchID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to delete branch.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Branch not found.' });
        }

        res.status(200).json({ message: 'Branch deleted successfully!' });
    });
});

// Fetch Product List
app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching product data:", err);
            return res.status(500).json({ error: 'Error fetching product data' });
        }
        console.log("Fetched product data:", results); // Log fetched data
        res.json(results);
    });
});

// Add a New Product
app.post('/api/products', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        prodName,
        prodCategory,
        prodBrand,
        prodSKU,
        prodBarcode,
        prodCost,
        prodPrice,
        prodUOM,
        prodStatus,
        prodDesc
    } = req.body;

    // Check if all required fields are present
    if (!prodName || !prodCategory || !prodBrand || !prodSKU || !prodCost || !prodPrice || !prodUOM || !prodStatus) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Insert the product into the database
    db.query(
        'INSERT INTO product (prodName, prodCategory, prodBrand, prodSKU, prodBarcode, prodCost, prodPrice, prodUOM, prodStatus, prodDesc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [prodName, prodCategory, prodBrand, prodSKU, prodBarcode, prodCost, prodPrice, prodUOM, prodStatus, prodDesc],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add product' });
            }
            res.status(201).json({ message: 'Product added successfully' });
        }
    );
});

// Update existing product
app.put('/api/products/:prodNo', (req, res) => {
    const prodNo = req.params.prodNo;
    const { prodName, prodCategory, prodBrand, prodSKU, prodBarcode, prodCost, prodPrice, prodUOM, prodStatus, prodDesc } = req.body;

    // Validate required fields
    if (!prodName || !prodCategory || !prodBrand || !prodSKU || !prodBarcode || !prodCost || !prodPrice || !prodUOM || !prodStatus) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `UPDATE product 
                 SET prodName = ?, prodCategory = ?, prodBrand = ?, prodSKU = ?, prodBarcode = ?, prodCost = ?, prodPrice = ?, prodUOM = ?, prodStatus = ?, prodDesc = ? 
                 WHERE prodNo = ?`;

    db.query(sql, [prodName, prodCategory, prodBrand, prodSKU, prodBarcode, prodCost, prodPrice, prodUOM, prodStatus, prodDesc, prodNo], (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ error: 'Error updating product' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully!' });
    });
});

// Delete existing product
app.delete('/api/products/:prodNo', (req, res) => {
    const prodNo = req.params.prodNo;
    const query = 'DELETE FROM product WHERE prodNo = ?';

    db.query(query, [prodNo], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to delete product.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully!' });
    });
});

// Fetch Inventory List
app.get('/api/stocks', (req, res) => {
    const sql = `
        SELECT 
            inventory.invID,
            product.prodName,  -- Joining with product table to get product name
            inventory.stockOnHand,
            inventory.reorderQty,
            inventory.preferredQty,
            inventory.stockLocation,
            branch.branchName  -- Joining with branch table to get branch name
        FROM 
            inventory
        JOIN product ON inventory.prod_No_fk = product.prodNo
        JOIN branch ON inventory.branch_id_fk = branch.branchID`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching inventory data:", err);
            return res.status(500).json({ error: 'Error fetching inventory data' });
        }
        console.log("Fetched inventory data:", results); // Log fetched data
        res.json(results);
    });
});


app.get('/api/products/search', (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required.' });
    }

    const sql = `
        SELECT prodNo, prodName
        FROM product
        WHERE prodNo LIKE ? OR prodName LIKE ?
    `;

    const searchTerm = `%${query}%`;

    db.query(sql, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        res.json(results);
    });
});


app.get('/api/products/:prodNo', (req, res) => {
    const prodNo = req.params.prodNo;

    const sql = `
        SELECT prodNo, prodName 
        FROM product 
        WHERE prodNo = ? LIMIT 1
    `;

    db.query(sql, [prodNo], (err, results) => {
        if (err) {
            console.error('Error fetching product by prodNo:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            res.json(results[0]); // Return the first matching product (since prodNo is unique)
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    });
});


// Add or Update Inventory Record
app.post('/api/stocks', async (req, res) => {
    console.log('Request Body:', req.body);

    const {
        prod_No_fk,
        stockOnHand,
        reorderQty,
        preferredQty,
        stockLocation,
        branch_id_fk,
        createdBy // Assuming you get the logged-in user
    } = req.body;

    // Check if all required fields are present
    if (!prod_No_fk || !stockOnHand || !reorderQty || !preferredQty || !branch_id_fk) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if the inventory record already exists
    db.query(
        'SELECT * FROM inventory WHERE prod_No_fk = ? AND branch_id_fk = ?',
        [prod_No_fk, branch_id_fk],
        (selectError, selectResults) => {
            if (selectError) {
                console.error('Database Error:', selectError);
                return res.status(500).json({ error: 'Failed to check inventory record' });
            }

            if (selectResults.length > 0) {
                // If the record exists, update the stockOnHand
                const existingRecord = selectResults[0];
                const newStockOnHand = existingRecord.stockOnHand + parseInt(stockOnHand, 10);

                db.query(
                    'UPDATE inventory SET stockOnHand = ?, reorderQty = ?, preferredQty = ?, stockLocation = ? WHERE invID = ?',
                    [newStockOnHand, reorderQty, preferredQty, stockLocation, existingRecord.invID],
                    (updateError) => {
                        if (updateError) {
                            console.error('Database Error on update:', updateError);
                            return res.status(500).json({ error: 'Failed to update inventory record' });
                        }
                        res.status(200).json({ message: 'Inventory record updated successfully', invID: existingRecord.invID });
                    }
                );
            } else {
                // If no record exists, insert a new inventory record
                db.query(
                    'INSERT INTO inventory (prod_No_fk, stockOnHand, reorderQty, preferredQty, stockLocation, branch_id_fk) VALUES (?, ?, ?, ?, ?, ?)',
                    [prod_No_fk, stockOnHand, reorderQty, preferredQty, stockLocation, branch_id_fk],
                    (insertError, insertResults) => {
                        if (insertError) {
                            console.error('Database Error on insert:', insertError);
                            return res.status(500).json({ error: 'Failed to add inventory record' });
                        }

                        const invID = insertResults.insertId; // Get the new invID
                        res.status(201).json({ message: 'Inventory record added successfully', invID });
                    }
                );
            }
        }
    );
});


// Log Inventory Action
app.post('/api/inventory_log', async (req, res) => {
    console.log('Logging Inventory Action:', req.body);

    const {
        logType,
        qty,
        createdBy,
        inv_id_fk,
        referenceNo
    } = req.body;

    // Check if all required fields are present
    if (!logType || !qty || !createdBy || !inv_id_fk) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Log the inventory action
    db.query(
        'INSERT INTO inventory_log (logType, qty, logDateTime, createdBy, inv_id_fk, referenceNo) VALUES (?, ?, NOW(), ?, ?, ?)',
        [logType, qty, createdBy, inv_id_fk, referenceNo],
        (logError) => {
            if (logError) {
                console.error('Database Error during logging:', logError);
                return res.status(500).json({ error: 'Failed to log inventory action', details: logError });
            }
            res.status(201).json({ message: 'Inventory action logged successfully' });
        }
    );
});


// Update an Inventory Record
app.put('/api/stocks/:invID', (req, res) => {
    const invID = req.params.invID;
    const {
        stockOnHand,
        reorderQty,
        preferredQty,
        stockLocation,
        createdBy, // Assuming you get the logged-in user
        logType, // Log type (Sales, Purchase, etc.)
        qty, // Quantity to log
        referenceNo // Transaction ID reference
    } = req.body;

    // Check if required fields are provided
    if (!stockOnHand || !reorderQty || !preferredQty) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Update the inventory record in the database
    db.query(
        'UPDATE inventory SET stockOnHand = ?, reorderQty = ?, preferredQty = ?, stockLocation = ? WHERE invID = ?',
        [stockOnHand, reorderQty, preferredQty, stockLocation, invID],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to update inventory record' });
            }

            // Log the inventory update
            db.query(
                'INSERT INTO inventory_log (LogType, qty, logDateTime, createdBy, inv_id_fk, referenceNo) VALUES (?, ?, NOW(), ?, ?, ?)',
                [logType, qty, createdBy, invID, referenceNo],
                (logError) => {
                    if (logError) {
                        console.error('Database Error during logging:', logError);
                        return res.status(500).json({ error: 'Failed to log inventory update' });
                    }
                    res.status(200).json({ message: 'Inventory record updated and logged successfully' });
                }
            );
        }
    );
});

// Delete Existing Inventory Record
app.delete('/api/stocks/:invID', (req, res) => {
    const invID = req.params.invID;
    const query = 'DELETE FROM inventory WHERE invID = ?';

    db.query(query, [invID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to delete inventory record.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Inventory record not found.' });
        }

        // Log the deletion
        db.query(
            'INSERT INTO inventory_log (LogType, qty, logDateTime, createdBy, inv_id_fk, referenceNo) VALUES (?, ?, NOW(), ?, ?, ?)',
            ['Deletion', -results.affectedRows, 'system', invID, 'N/A'], // Assuming system log for deletions
            (logError) => {
                if (logError) {
                    console.error('Database Error during logging:', logError);
                }
            }
        );

        res.status(200).json({ message: 'Inventory record deleted successfully!' });
    });
});


// Fetch Stock Request List with Branch Name
app.get('/api/stockrequests', (req, res) => {
    const sql = `
        SELECT 
            stock_request.ordReqID,
            stock_request.ordRequester,
            stock_request.reqDate,
            stock_request.requestStatus,
            branch.branchName  -- Joining with branch table to get branch name
        FROM 
            stock_request
        JOIN branch ON stock_request.ordRequester = branch.branchID`; // Assuming branchID is in stock_request

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching stock request data:", err);
            return res.status(500).json({ error: 'Error fetching stock request data' });
        }
        console.log("Fetched stock request data with branch names:", results); // Log fetched data
        res.json(results);
    });
});

// Add a new stock request and line items
app.post('/api/stockrequest', (req, res) => {
    const { branchID, reqDate, requestStatus, lineItems } = req.body;

    const insertStockRequest = `
        INSERT INTO stock_request (ordRequester, reqDate, requestStatus)
        VALUES (?, ?, ?)
    `;

    const stockRequestParams = [branchID, reqDate, requestStatus];

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error starting transaction' });
        }

        db.query(insertStockRequest, stockRequestParams, (err, result) => {
            if (err) {
                console.error('Error inserting stock request:', err.sqlMessage || err);
                return db.rollback(() => {
                    return res.status(500).json({ error: 'Error inserting stock request' });
                });
            }

            const fetchOrdReqID = `
                SELECT ordReqID FROM stock_request 
                WHERE ordRequester = ? AND reqDate = ? 
                ORDER BY ordReqID DESC LIMIT 1
            `;

            db.query(fetchOrdReqID, [branchID, reqDate], (err, rows) => {
                if (err) {
                    console.error('Error fetching ordReqID:', err.sqlMessage || err);
                    return db.rollback(() => {
                        return res.status(500).json({ error: 'Error fetching ordReqID' });
                    });
                }

                const ordReqID = rows[0].ordReqID;

                // Build the VALUES part of the SQL query for the line items
                const insertLineItems = `
                    INSERT INTO request_line_item (qtyRequested, qtyFulfilled, prodNo, ordReqID)
                    VALUES ${lineItems.map(() => '(?, 0, ?, ?)').join(', ')}
                `;

                // Flatten the parameters for all line items
                const lineItemParams = lineItems.flatMap(item => [
                    parseInt(item.qtyRequested, 10),
                    item.prodNo,
                    ordReqID
                ]);

                // Log the generated query and params for debugging
                console.log('Generated query:', insertLineItems);
                console.log('Query parameters:', lineItemParams);

                db.query(insertLineItems, lineItemParams, (err, result) => {
                    if (err) {
                        console.error('Error inserting line items:', err.sqlMessage || err);
                        return db.rollback(() => {
                            return res.status(500).json({ error: 'Error inserting line items' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err.sqlMessage || err);
                            return db.rollback(() => {
                                return res.status(500).json({ error: 'Error committing transaction' });
                            });
                        }
                        res.json({ message: 'Stock request and line items added successfully', ordReqID });
                    });
                });
            });
        });
    });
});


app.get('/api/stockrequest/:ordReqID/lineitems', (req, res) => {
    const ordReqID = req.params.ordReqID;
    const sql = `
        SELECT rli.qtyRequested, rli.qtyFulfilled, rli.prodNo, p.prodName
        FROM request_line_item rli
        JOIN product p ON rli.prodNo = p.prodNo
        WHERE rli.ordReqID = ?
    `;
    db.query(sql, [ordReqID], (err, results) => {
        if (err) {
            console.error("Error fetching line items:", err);
            return res.status(500).json({ error: 'Error fetching line items' });
        }
        res.json(results);
    });
});



// DELETE stock request and associated line items
app.delete('/api/stockrequest/:id', (req, res) => {
    const ordReqID = req.params.id;
    
    const deleteLineItemsQuery = `DELETE FROM request_line_item WHERE ordReqID = ?`;
    const deleteStockRequestQuery = `DELETE FROM stock_request WHERE ordReqID = ?`;
    
    // Execute deletion of line items and stock request sequentially
    db.query(deleteLineItemsQuery, [ordReqID], (err, result) => {
        if (err) {
            console.error("Error deleting line items:", err);
            return res.status(500).json({ error: 'Error deleting line items' });
        }
        
        // After deleting line items, delete the stock request
        db.query(deleteStockRequestQuery, [ordReqID], (err, result) => {
            if (err) {
                console.error("Error deleting stock request:", err);
                return res.status(500).json({ error: 'Error deleting stock request' });
            }
            
            res.json({ message: 'Stock request and associated line items deleted successfully' });
        });
    });
});


// Fetch Stock Transfer List with Branch and Stock Request Details
app.get('/api/stocktransfers', (req, res) => {
    const sql = `
        SELECT 
            stock_transfer.stkTransNo,
            stock_transfer.stkTransDate,
            stock_transfer.fromBranch,
            stock_transfer.toBranch,
            stock_transfer.transferStatus,
            stock_transfer.senderEmpID,
            stock_transfer.receiverEmpID,
            stock_transfer.referenceOrder,
            stock_request.ordReqID AS referenceOrder, -- Fetching from stock_request table
            branch_from.branchName AS fromBranchName, -- From Branch Name
            branch_to.branchName AS toBranchName      -- To Branch Name
        FROM 
            stock_transfer
        JOIN branch AS branch_from ON stock_transfer.fromBranch = branch_from.branchID
        JOIN branch AS branch_to ON stock_transfer.toBranch = branch_to.branchID
        LEFT JOIN stock_request ON stock_transfer.referenceOrder = stock_request.ordReqID  -- Joining stock_request table (LEFT JOIN in case it's optional)
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching stock transfer data:", err);
            return res.status(500).json({ error: 'Error fetching stock transfer data' });
        }
        console.log("Fetched stock transfer data with branch and stock request details:", results);
        res.json(results);
    });
});


// Add a new stock transfer and line items (no qtyFulfilled update here)
app.post('/api/stocktransfer', (req, res) => {
    const { fromBranch, toBranch, stkTransDate, transferStatus, senderEmpID, receiverEmpID, referenceOrder, lineItems } = req.body;

    const insertStockTransfer = `
        INSERT INTO stock_transfer (fromBranch, toBranch, stkTransDate, transferStatus, senderEmpID, receiverEmpID, referenceOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const stockTransferParams = [fromBranch, toBranch, stkTransDate, transferStatus, senderEmpID, receiverEmpID, referenceOrder];

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error starting transaction' });
        }

        db.query(insertStockTransfer, stockTransferParams, (err, result) => {
            if (err) {
                console.error('Error inserting stock transfer:', err.sqlMessage || err);
                return db.rollback(() => {
                    return res.status(500).json({ error: 'Error inserting stock transfer' });
                });
            }

            const fetchStkTransNo = `
                SELECT stkTransNo FROM stock_transfer 
                WHERE fromBranch = ? AND toBranch = ? AND stkTransDate = ? 
                ORDER BY stkTransNo DESC LIMIT 1
            `;

            db.query(fetchStkTransNo, [fromBranch, toBranch, stkTransDate], (err, rows) => {
                if (err) {
                    console.error('Error fetching stkTransNo:', err.sqlMessage || err);
                    return db.rollback(() => {
                        return res.status(500).json({ error: 'Error fetching stkTransNo' });
                    });
                }

                const stkTransNo = rows[0].stkTransNo;

                // Insert line items into transfer_line_item
                const insertLineItems = `
                    INSERT INTO transfer_line_item (qtyTransferred, prod_No_fk, stkTransNo_fk)
                    VALUES ${lineItems.map(() => '(?, ?, ?)').join(', ')}
                `;

                const lineItemParams = lineItems.flatMap(item => [
                    parseInt(item.qtyTransferred, 10),
                    item.prod_No_fk,
                    stkTransNo
                ]);

                db.query(insertLineItems, lineItemParams, (err, result) => {
                    if (err) {
                        console.error('Error inserting line items:', err.sqlMessage || err);
                        return db.rollback(() => {
                            return res.status(500).json({ error: 'Error inserting line items' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err.sqlMessage || err);
                            return db.rollback(() => {
                                return res.status(500).json({ error: 'Error committing transaction' });
                            });
                        }
                        res.json({ message: 'Stock transfer and line items added successfully', stkTransNo });
                    });
                });
            });
        });
    });
});



// Fetch Line Items for Stock Transfer
app.get('/api/stocktransfer/:stkTransNo/lineitems', (req, res) => {
    const stkTransNo = req.params.stkTransNo;
    const sql = `
        SELECT tli.qtyTransferred, tli.prod_No_fk AS prodNo, p.prodName
        FROM transfer_line_item tli
        JOIN product p ON tli.prod_No_fk = p.prodNo
        WHERE tli.stkTransNo_fk = ?
    `;
    db.query(sql, [stkTransNo], (err, results) => {
        if (err) {
            console.error("Error fetching line items:", err);
            return res.status(500).json({ error: 'Error fetching line items' });
        }
        res.json(results);
    });
});


// DELETE stock transfer and associated line items
app.delete('/api/stocktransfer/:stkTransNo', (req, res) => {
    const stkTransNo = req.params.stkTransNo;

    const deleteLineItemsQuery = `DELETE FROM transfer_line_item WHERE stkTransNo_fk = ?`;
    const deleteStockTransferQuery = `DELETE FROM stock_transfer WHERE stkTransNo = ?`;

    // Execute deletion of line items and stock transfer sequentially
    db.query(deleteLineItemsQuery, [stkTransNo], (err, result) => {
        if (err) {
            console.error("Error deleting line items:", err);
            return res.status(500).json({ error: 'Error deleting line items' });
        }

        // After deleting line items, delete the stock transfer
        db.query(deleteStockTransferQuery, [stkTransNo], (err, result) => {
            if (err) {
                console.error("Error deleting stock transfer:", err);
                return res.status(500).json({ error: 'Error deleting stock transfer' });
            }

            res.json({ message: 'Stock transfer and associated line items deleted successfully' });
        });
    });
});

// DELETE stock transfer and associated line items
app.delete('/api/stocktransfer/:stkTransNo', (req, res) => {
    const stkTransNo = req.params.stkTransNo;

    const deleteLineItemsQuery = `DELETE FROM transfer_line_item WHERE stkTransNo_fk = ?`;
    const deleteStockTransferQuery = `DELETE FROM stock_transfer WHERE stkTransNo = ?`;

    // Execute deletion of line items and stock transfer sequentially
    db.query(deleteLineItemsQuery, [stkTransNo], (err, result) => {
        if (err) {
            console.error("Error deleting line items:", err);
            return res.status(500).json({ error: 'Error deleting line items' });
        }

        // After deleting line items, delete the stock transfer
        db.query(deleteStockTransferQuery, [stkTransNo], (err, result) => {
            if (err) {
                console.error("Error deleting stock transfer:", err);
                return res.status(500).json({ error: 'Error deleting stock transfer' });
            }

            res.json({ message: 'Stock transfer and associated line items deleted successfully' });
        });
    });
});

// Update qtyFulfilled in stock_request when a stock transfer is completed
app.patch('/api/stocktransfer/:stkTransNo/status', (req, res) => {
    const { stkTransNo } = req.params;
    const { status } = req.body;

    const updateStatusSQL = `UPDATE stock_transfer SET transferStatus = ? WHERE stkTransNo = ?`;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ error: 'Error starting transaction' });
        }

        // First, update the status of the stock transfer
        db.query(updateStatusSQL, [status, stkTransNo], (err, result) => {
            if (err) {
                console.error("Error updating stock transfer status:", err);
                return db.rollback(() => res.status(500).json({ error: 'Error updating stock transfer status' }));
            }

            // Only update qtyFulfilled if the status is set to "Completed"
            if (status === 'Completed') {
                // Fetch the stock transfer details, including the referenceOrder and line items
                const fetchTransferSQL = `
                    SELECT stk.referenceOrder, li.prod_No_fk, li.qtyTransferred
                    FROM stock_transfer stk
                    JOIN transfer_line_item li ON li.stkTransNo_fk = stk.stkTransNo
                    WHERE stk.stkTransNo = ?
                `;
                db.query(fetchTransferSQL, [stkTransNo], (err, transferRows) => {
                    if (err) {
                        console.error("Error fetching stock transfer details:", err);
                        return db.rollback(() => res.status(500).json({ error: 'Error fetching stock transfer details' }));
                    }

                    console.log('Fetched stock transfer details:', transferRows);

                    // Iterate over each line item in the stock transfer and update qtyFulfilled for matching products in the request
                    const updatePromises = transferRows.map((lineItem) => {
                        const { referenceOrder, prod_No_fk, qtyTransferred } = lineItem;

                        return new Promise((resolve, reject) => {
                            if (referenceOrder) {
                                console.log(`Processing line item for product ${prod_No_fk} with qtyTransferred: ${qtyTransferred}`);

                                // Update qtyFulfilled in the stock request for the matching line item
                                const updateQtyFulfilledSQL = `
                                    UPDATE request_line_item
                                    SET qtyFulfilled = qtyFulfilled + ?
                                    WHERE ordReqID = ? AND prodNo = ? AND qtyFulfilled < qtyRequested
                                `;

                                db.query(updateQtyFulfilledSQL, [qtyTransferred, referenceOrder, prod_No_fk], (err, result) => {
                                    if (err) {
                                        console.error(`Error updating qtyFulfilled for product ${prod_No_fk} in request ${referenceOrder}:`, err);
                                        return reject(err);
                                    }

                                    console.log(`Successfully updated qtyFulfilled for product ${prod_No_fk} in request ${referenceOrder}. Rows affected: ${result.affectedRows}`);

                                    if (result.affectedRows === 0) {
                                        console.log(`Product ${prod_No_fk} was not requested in order ${referenceOrder}, so no changes were made.`);
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                        });
                    });

                    Promise.all(updatePromises)
                        .then(() => {
                            // Check if all items in the stock request have been fulfilled
                            const checkRequestCompletionSQL = `
                                SELECT SUM(CASE WHEN qtyFulfilled >= qtyRequested THEN 1 ELSE 0 END) AS fulfilledCount, COUNT(*) AS totalCount
                                FROM request_line_item
                                WHERE ordReqID = ?
                            `;

                            db.query(checkRequestCompletionSQL, [transferRows[0].referenceOrder], (err, completionRows) => {
                                if (err) {
                                    console.error("Error checking request completion:", err);
                                    return db.rollback(() => res.status(500).json({ error: 'Error checking request completion' }));
                                }

                                const { fulfilledCount, totalCount } = completionRows[0];

                                // Update the stock request status based on fulfillment
                                let newStatus = fulfilledCount === totalCount ? 'Fulfilled' : 'Partially Fulfilled';
                                const updateRequestStatusSQL = `UPDATE stock_request SET requestStatus = ? WHERE ordReqID = ?`;

                                db.query(updateRequestStatusSQL, [newStatus, transferRows[0].referenceOrder], (err, result) => {
                                    if (err) {
                                        console.error("Error updating stock request status:", err);
                                        return db.rollback(() => res.status(500).json({ error: 'Error updating stock request status' }));
                                    }

                                    console.log(`Stock request status updated to ${newStatus}`);

                                    db.commit((err) => {
                                        if (err) {
                                            console.error("Error committing transaction:", err);
                                            return db.rollback(() => res.status(500).json({ error: 'Error committing transaction' }));
                                        }
                                        res.json({ message: 'Stock transfer status updated and qtyFulfilled adjusted where applicable' });
                                    });
                                });
                            });
                        })
                        .catch(err => {
                            console.error('Error during updating line items:', err);
                            return db.rollback(() => res.status(500).json({ error: 'Error updating request line items' }));
                        });
                });
            } else {
                // If status is not "Completed", we only commit the status change and skip the qtyFulfilled update
                db.commit((err) => {
                    if (err) {
                        console.error("Error committing transaction:", err);
                        return db.rollback(() => res.status(500).json({ error: 'Error committing transaction' }));
                    }
                    res.json({ message: 'Stock transfer status updated without qtyFulfilled change' });
                });
            }
        });
    });
});



app.patch('/api/stocktransfer/:stkTransNo/complete', (req, res) => {
    const { stkTransNo } = req.params;

    const updateTransferStatusSql = `
        UPDATE stock_transfer 
        SET transferStatus = 'Completed' 
        WHERE stkTransNo = ?
    `;

    const updateInventorySql = `
        UPDATE inventory 
        SET stockOnHand = stockOnHand + ? 
        WHERE branch_id_fk = ? AND prod_no_fk = ?
    `;

    const updateQtyFulfilledSql = `
        UPDATE stock_request 
        SET qtyFulfilled = qtyFulfilled + ? 
        WHERE ordReqID = ?
    `;

    // First, update the stock transfer status to "Completed"
    db.query(updateTransferStatusSql, [stkTransNo], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error completing stock transfer' });
        }

        // Then, retrieve the line items and update the inventory for each product
        const fetchLineItemsSql = `
            SELECT qtyTransferred, prod_No_fk, toBranch, referenceOrder 
            FROM transfer_line_item 
            WHERE stkTransNo_fk = ?
        `;

        db.query(fetchLineItemsSql, [stkTransNo], (err, lineItems) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching line items' });
            }

            // For each line item, update the inventory and qtyFulfilled (if applicable)
            const updatePromises = lineItems.map(item => {
                return new Promise((resolve, reject) => {
                    // Update inventory
                    db.query(updateInventorySql, [item.qtyTransferred, item.toBranch, item.prod_No_fk], (err) => {
                        if (err) return reject(err);

                        // Update qtyFulfilled if there's a reference order
                        if (item.referenceOrder) {
                            db.query(updateQtyFulfilledSql, [item.qtyTransferred, item.referenceOrder], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    db.commit((err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error committing transaction' });
                        }
                        res.json({ message: 'Stock transfer completed successfully' });
                    });
                })
                .catch(err => {
                    db.rollback(() => {
                        return res.status(500).json({ error: 'Error completing stock transfer' });
                    });
                });
        });
    });
});

// Fetch stock request details by ordReqID
app.get('/api/stockrequest/:ordReqID', (req, res) => {
    const ordReqID = req.params.ordReqID;

    const sql = `
        SELECT ordRequester, reqDate, requestStatus
        FROM stock_request
        WHERE ordReqID = ?
    `;

    db.query(sql, [ordReqID], (err, results) => {
        if (err) {
            console.error('Error fetching stock request:', err);
            return res.status(500).json({ error: 'Error fetching stock request' });
        }

        if (results.length > 0) {
            res.json(results[0]); // Return the stock request details
        } else {
            res.status(404).json({ message: 'Stock request not found.' });
        }
    });
});


//Fetch Supplier Information
app.get('/api/supplier', (req, res) => {
    const sql = "SELECT * FROM supplier";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching supplier data:", err);
            return res.status(500).json({ error: 'Error fetching supplier data' });
        }
        console.log("Fetched supplier data:", results); // Log fetched data
        res.json(results);
    });
});

// Add a New Supplier
app.post('/api/supplier', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        supName,
        supContNo,
        supPerson,
        supAddr,
        supDesc
    } = req.body;

    if (!supName || !supContNo || !supPerson || !supAddr || !supDesc) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'INSERT INTO supplier (supName, supContNo, supPerson, supAddr, supDesc) VALUES (?, ?, ?, ?, ?)',
        [supName, supContNo, supPerson, supAddr, supDesc],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add supplier' });
            }
            res.status(201).json({ message: 'Supplier added successfully' });
        }
    );
});

// Update an existing Supplier
app.put('/api/supplier/:supID', (req, res) => {
    const supID = req.params.supID;

    const {
        supName,
        supContNo,
        supPerson,
        supAddr,
        supDesc
    } = req.body;

    if (!supName || !supContNo || !supPerson || !supAddr || !supDesc) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "UPDATE supplier SET supName = ?, supContNo = ?, supPerson = ?, supAddr = ?, supDesc = ? WHERE supID = ?";
    
    db.query(sql, [supName, supContNo, supPerson, supAddr, supDesc, supID], (err, result) => {
        if (err) {
            console.error("Error updating supplier:", err);
            return res.status(500).json({ error: 'Error updating supplier' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        console.log("Supplier updated:", result);
        res.status(200).json({ message: 'Supplier updated successfully!' });
    });
});


// Delete an existing Supplier
app.delete('/api/supplier/:supID', (req, res) => {
    const supID = req.params.supID;
    const query = 'DELETE FROM supplier WHERE supID = ?';
  
    db.query(query, [supID], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Failed to delete supplier.' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Supplier not found.' });
      }
  
      res.status(200).json({ message: 'Supplier deleted successfully!' });
    });
  });


// Fetch Customers
app.get('/api/customer_info', (req, res) => {
    const sql = "SELECT * FROM customer_information";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching customer data:", err);
            return res.status(500).json({ error: 'Error fetching customer data' });
        }
        console.log("Fetched customer data:", results); // Log fetched data
        res.json(results);
    });
});  


// Add a New Customer
app.post('/api/customer_info', (req, res) => {
    console.log('Request Body:', req.body);

    const {
        custLName,
        custFName,
        custMName,
        custAddr,
        custEmail,
        paymentStatus	

    } = req.body;

    if (!custNo || !custLName || !custFName || !custMName || !custAddr || !custEmail || !custBalance || !paymentStatus) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'INSERT INTO customer_information (custLName, custFName, custMName, custAddr, custEmail, paymentStatus) VALUES (?, ?, ?, ?, ?, ?)',
        [custLName, custFName, custMName, custAddr, custEmail, paymentStatus],
        (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({ error: 'Failed to add customer' });
            }
            res.status(201).json({ message: 'Customer added successfully' });
        }
    );
});
  
// Update an existing Customer
app.put('/api/customer_info/:custNo', (req, res) => {
    const custNo = req.params.custNo;
    const { custLName, custFName, custMName, custAddr, custEmail, paymentStatus } = req.body;

    // Validate required fields
    if (!custLName || !custFName || !custMName || !custAddr || !custEmail || !paymentStatus) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = "UPDATE customer_information SET custLName = ?, custFName = ?, custMName = ?, custAddr = ?, custEmail = ?, paymentStatus = ? WHERE custNo = ?";
    
    db.query(sql, [custLName, custFName, custMName, custAddr, custEmail, paymentStatus, custNo], (err, result) => {
        if (err) {
            console.error("Error updating customer:", err);
            return res.status(500).json({ error: 'Error updating customer' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        console.log("Customer updated:", result);
        res.status(200).json({ message: 'Customer updated successfully!' });
    });
});


// Delete an existing Customer
app.delete('/api/customer_info/:custNo', (req, res) => {
    const custNo = req.params.empID;
    const query = 'DELETE FROM customer_info WHERE custNo = ?';
  
    db.query(query, [custNo], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Failed to delete customer.' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
  
      res.status(200).json({ message: 'Customer deleted successfully!' });
    });
  });

//sales_transaction
 
// Add a New Sales Transaction
app.post('/api/sales_transaction', (req, res) => {
    const { oRNo, dateOfSale, grandTotal, paymentStatus, custNo, empID } = req.body;

    // Check if all required fields are present
    if (!oRNo || !dateOfSale || !grandTotal || !paymentStatus || !custNo || !empID) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        INSERT INTO sales_transaction (oRNo, dateOfSale, grandTotal, paymentStatus, custNo, empID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [oRNo, dateOfSale, grandTotal, paymentStatus, custNo, empID], (err, result) => {
        if (err) {
            console.error('Error inserting sales transaction:', err);
            return res.status(500).json({ error: 'Error inserting sales transaction' });
        }
        res.status(201).json({ message: 'Sales transaction added successfully!' });
    });
});

// Get All Sales Transactions
app.get('/api/sales_transaction', (req, res) => {
    const sql = `
        SELECT st.*, c.custFName, c.custLName, e.empFName, e.empLName 
        FROM sales_transaction st
        LEFT JOIN customer c ON st.custNo = c.custNo
        LEFT JOIN employee e ON st.empID = e.empID
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching sales transactions:', err);
            return res.status(500).json({ error: 'Error fetching sales transactions' });
        }
        res.json(results);
    });
});

// Get Sales Transaction by Order Number
app.get('/api/sales_transaction/:oRNo', (req, res) => {
    const { oRNo } = req.params;

    const sql = `
        SELECT st.*, c.custFName, c.custLName, e.empFName, e.empLName 
        FROM sales_transaction st
        LEFT JOIN customer c ON st.custNo = c.custNo
        LEFT JOIN employee e ON st.empID = e.empID
        WHERE st.oRNo = ?
    `;

    db.query(sql, [oRNo], (err, results) => {
        if (err) {
            console.error('Error fetching sales transaction:', err);
            return res.status(500).json({ error: 'Error fetching sales transaction' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Sales transaction not found' });
        }

        res.json(results[0]);
    });
});

// Update an Existing Sales Transaction
app.put('/api/sales_transaction/:oRNo', (req, res) => {
    const { oRNo } = req.params;
    const { dateOfSale, grandTotal, paymentStatus, custNo, empID } = req.body;

    if (!dateOfSale || !grandTotal || !paymentStatus || !custNo || !empID) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        UPDATE sales_transaction 
        SET dateOfSale = ?, grandTotal = ?, paymentStatus = ?, custNo = ?, empID = ?
        WHERE oRNo = ?
    `;

    db.query(sql, [dateOfSale, grandTotal, paymentStatus, custNo, empID, oRNo], (err, result) => {
        if (err) {
            console.error('Error updating sales transaction:', err);
            return res.status(500).json({ error: 'Error updating sales transaction' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sales transaction not found' });
        }

        res.status(200).json({ message: 'Sales transaction updated successfully!' });
    });
});

// Delete a Sales Transaction
app.delete('/api/sales_transaction/:oRNo', (req, res) => {
    const { oRNo } = req.params;

    const sql = 'DELETE FROM sales_transaction WHERE oRNo = ?';

    db.query(sql, [oRNo], (err, result) => {
        if (err) {
            console.error('Error deleting sales transaction:', err);
            return res.status(500).json({ error: 'Error deleting sales transaction' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sales transaction not found' });
        }

        res.status(200).json({ message: 'Sales transaction deleted successfully!' });
    });
});


// Search Products by prodNo, prodName, prodBrand, prodSKU, or prodBarcode
app.get('/api/products/search', (req, res) => {
    const searchTerm = req.query.query;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    // SQL query to match the search term against multiple columns
    const sql = `
        SELECT * FROM product 
        WHERE 
            prodNo LIKE ? OR 
            prodName LIKE ? OR 
            prodBrand LIKE ? OR 
            prodSKU LIKE ? OR 
            prodBarcode LIKE ?
    `;

    // Use '%' to match any product containing the search term in any part of the field
    const searchValue = `%${searchTerm}%`;

    db.query(sql, [searchValue, searchValue, searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error("Error fetching product data:", err);
            return res.status(500).json({ error: 'Error fetching product data' });
        }

        res.json(results);
    });
});


app.listen(8081, ()=> {
    console.log("listening");
})