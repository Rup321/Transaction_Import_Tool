const fs = require("fs");
const csv = require("csv-parser");

const { Batch, Transaction, AuditLog, User, sequelize } = require("../models");
const httpStatus = require("../constants/httpStatus");


const readCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {

        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                rows.push(row);
            })
            .on("end", () => {
                resolve(rows);
            })
            .on("error", (error) => {
                reject(error);
            });

    });
};


const uploadTransactionFile = async (req) => {

    if (!req.file) {
        const error = new Error("Please upload a CSV file");
        error.statusCode = httpStatus.BAD_REQUEST;
        throw error;
    }

    let batch;

    try {


        const rows = await readCSVFile(req.file.path);


        batch = await Batch.create({
            file_name: req.file.originalname,
            uploaded_by: req.userData.id,
            status: "PENDING",
            total_records: rows.length,
            valid_records: 0,
            invalid_records: 0
        });

        const validTransactions = [];
        const invalidRows = [];
        const transactionIds = new Set();


        for (let index = 0; index < rows.length; index++) {

            const row = rows[index];

            const rowNumber = index + 2;
            const errors = [];

            const transactionId = row.transaction_id?.trim();
            const customerName = row.customer_name?.trim();
            const accountNumber = row.account_number?.trim();
            const amount = row.amount?.trim();


            if (!transactionId) {
                errors.push("Transaction ID is required");
            }

            if (!customerName) {
                errors.push("Customer name is required");
            }

            if (!accountNumber) {
                errors.push("Account number is required");
            }

            if (!amount) {
                errors.push("Amount is required");
            }

            // Amount validation
            if (amount) {

                const numericAmount = Number(amount);

                if (Number.isNaN(numericAmount)) {
                    errors.push("Amount must be a valid number");
                } else if (numericAmount <= 0) {
                    errors.push("Amount must be greater than zero");
                }
            }


            if (transactionId) {

                if (transactionIds.has(transactionId)) {
                    errors.push("Duplicate transaction ID in CSV");
                } else {
                    transactionIds.add(transactionId);
                }
            }


            if (transactionId && !errors.includes("Duplicate transaction ID in CSV")) {

                const existingTransaction = await Transaction.findOne({
                    where: {
                        transaction_id: transactionId
                    }
                });

                if (existingTransaction) {
                    errors.push("Transaction ID already exists");
                }
            }


            if (errors.length > 0) {

                invalidRows.push({
                    row: rowNumber,
                    transaction_id: transactionId || null,
                    reasons: errors
                });

                continue;
            }

            validTransactions.push({
                batch_id: batch.id,
                transaction_id: transactionId,
                customer_name: customerName,
                account_number: accountNumber,
                amount: Number(amount),
                status: "PENDING"
            });
        }


        if (validTransactions.length > 0) {
            await Transaction.bulkCreate(validTransactions);
        }

        await batch.update({
            total_records: rows.length,
            valid_records: validTransactions.length,
            invalid_records: invalidRows.length
        });


        await AuditLog.create({
            user_id: req.userData.id,
            batch_id: batch.id,
            module: "BATCH",
            action: "UPLOAD",
            description:
                `File ${req.file.originalname} uploaded. ` +
                `${rows.length} records processed, ` +
                `${validTransactions.length} valid, ` +
                `${invalidRows.length} invalid.`,
            ip_address: req.ip,
            request_method: req.method,
            request_url: req.originalUrl
        });


        fs.unlink(req.file.path, (error) => {
            if (error) {
                console.error("Failed to delete uploaded file:", error.message);
            }
        });
        return {
            batch_id: batch.id,
            file_name: batch.file_name,
            total_records: rows.length,
            valid_records: validTransactions.length,
            invalid_records: invalidRows.length,
            errors: invalidRows
        };

    } catch (error) {


        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, () => { });
        }

        throw error;
    }
};


const getBatchDetails = async (batchId) => {

    const batch = await Batch.findOne({
        where: {
            id: batchId
        },

        attributes: [
            "id",
            "file_name",
            "status",
            "total_records",
            "valid_records",
            "invalid_records",
            "remarks",
            "created_at",
            "updated_at"
        ],

        include: [
            {
                model: User,
                as: "uploader",
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email"
                ]
            },

            {
                model: Transaction,
                as: "transactions",
                attributes: [
                    "id",
                    "transaction_id",
                    "customer_name",
                    "account_number",
                    "amount",
                    "status",
                    "remarks",
                    "created_at",
                    "updated_at"
                ]
            }
        ]
    });


    if (!batch) {
        const error = new Error("Batch not found");
        error.statusCode = httpStatus.NOT_FOUND;
        throw error;
    }


    return batch;
};

const approveBatchService = async (batchId, req) => {

    const transaction = await sequelize.transaction();

    try {

        const batch = await Batch.findOne({
            where: {
                id: batchId
            },
            transaction
        });

        if (!batch) {
            const error = new Error("Batch not found");
            error.statusCode = httpStatus.NOT_FOUND;
            throw error;
        }

        if (batch.status === "AUTHORIZED") {
            const error = new Error("Batch is already authorized");
            error.statusCode = httpStatus.BAD_REQUEST;
            throw error;
        }

        const pendingTransactions = await Transaction.count({
            where: {
                batch_id: batchId,
                status: "PENDING"
            },
            transaction
        });

        if (pendingTransactions === 0) {
            const error = new Error(
                "No pending transactions available for approval"
            );

            error.statusCode = httpStatus.BAD_REQUEST;
            throw error;
        }

        await Transaction.update(
            {
                status: "AUTHORIZED"
            },
            {
                where: {
                    batch_id: batchId,
                    status: "PENDING"
                },
                transaction
            }
        );

        await batch.update(
            {
                status: "AUTHORIZED"
            },
            {
                transaction
            }
        );

        await AuditLog.create(
            {
                user_id: req.userData.id,
                batch_id: batch.id,
                module: "BATCH",
                action: "APPROVE",
                description:
                    `Batch ${batch.file_name} approved. ` +
                    `${pendingTransactions} transactions authorized.`,
                ip_address: req.ip,
                request_method: req.method,
                request_url: req.originalUrl
            },
            {
                transaction
            }
        );

        await transaction.commit();


        return {
            batch_id: batch.id,
            file_name: batch.file_name,
            status: "AUTHORIZED",
            authorized_transactions: pendingTransactions
        };

    } catch (error) {
        await transaction.rollback();

        throw error;
    }
};

module.exports = {
    uploadTransactionFile,
    getBatchDetails,
    approveBatchService
};