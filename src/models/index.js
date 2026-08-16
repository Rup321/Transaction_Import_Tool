const { sequelize } = require("../../config/db");
const { AuditLog } = require("./auditLog");
const { Batch } = require("./batch");
const { Permission } = require("./permission");
const { Role } = require("./role");
const { RolePermission } = require("./rolePermission");
const { Transaction } = require("./transaction");
const { User } = require("./user");

//user <=>Role

Role.hasMany(User, {
    foreignKey: "role_id",
});

User.belongsTo(Role, {
    foreignKey: "role_id",
})

// role Permission

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id", otherKey: "permission_id" });

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
    otherKey: "role_id"
})

// batch - transaction
Batch.hasMany(Transaction, { foreignKey: "batch_id", as: "transactions" });
Transaction.belongsTo(Batch, { foreignKey: "batch_id" });


// user - audit 
User.hasMany(Batch, { foreignKey: "uploaded_by" });
Batch.belongsTo(User, { foreignKey: "uploaded_by", as: "uploader" });

User.hasMany(AuditLog, { foreignKey: "user_id" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });


Batch.hasMany(AuditLog, {
    foreignKey: "batch_id",
    as: "auditLogs",
});

AuditLog.belongsTo(Batch, {
    foreignKey: "batch_id",
    as: "batch",
});


module.exports = { sequelize, User, Role, Permission, RolePermission, AuditLog, Batch, Transaction };