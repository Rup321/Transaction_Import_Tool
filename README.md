# Transaction Import Tool

A simple transaction import and approval system built as a backend-focused assessment project.

The application allows an Operations Maker to upload transaction data through a CSV file. The system validates each transaction, stores valid transactions as `PENDING`, records invalid rows with error reasons, and allows an authorized Checker to approve a batch.

## Tech Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Express Validator
- Multer
- CSV Parser
- Morgan

### Frontend
- React
- Vite
- Axios

## Features

- User registration
- User login with JWT authentication
- Role-based access control
- CSV file upload
- CSV row validation
- Duplicate transaction detection
- Transaction storage
- Batch management
- Batch approval workflow
- Audit logging
- Validation and centralized error handling
- Simple React frontend

---

# Project Structure

```text
Transaction_Import_Tool/
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── seeders/
│   │   ├── validators/
│   │   ├── constants/
│   │   └── utils/
│   │
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── sample_transactions.csv
└── README.md
