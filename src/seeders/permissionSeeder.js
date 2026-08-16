

const seedPermissions = async () => {
    const { Permission } = require("../models");
    const permissions = [
        {
            action: "CREATE",
            base_url: "/api",
            route: "/upload",
            method: "POST",
            description: "Upload transaction CSV"
        },
        {
            action: "READ",
            base_url: "/api",
            route: "/batches",
            method: "GET",
            description: "View all batches"
        },
        {
            action: "READ",
            base_url: "/api",
            route: "/batches/:id",
            method: "GET",
            description: "View batch details"
        },
        {
            action: "APPROVE",
            base_url: "/api",
            route: "/batches/:id/approve",
            method: "POST",
            description: "Approve transaction batch"
        },
        {
            action: "READ",
            base_url: "/api",
            route: "/audit-logs",
            method: "GET",
            description: "View audit logs"
        },
        {
            action: "READ",
            base_url: "/api",
            route: "/audit-logs",
            method: "GET",
            description: "View audit logs"
        }

    ];

    for (const permission of permissions) {
        await Permission.findOrCreate({
            where: {
                base_url: permission.base_url,
                route: permission.route,
                method: permission.method
            },
            defaults: permission
        });
    }

    console.log("Permissions seeded successfully");
};

module.exports = { seedPermissions };