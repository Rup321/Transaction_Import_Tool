
const seedRolePermissions = async () => {
    const {
        Role,
        Permission,
        RolePermission
    } = require("../models");

    const maker = await Role.findOne({
        where: {
            role_name: "Maker"
        }
    });

    const checker = await Role.findOne({
        where: {
            role_name: "Checker"
        }
    });

    if (!maker || !checker) {
        throw new Error("Roles not found. Seed roles first.");
    }

    // -----------------------------
    // MAKER PERMISSIONS
    // -----------------------------

    const makerRoutes = [
        ["POST", "/upload"],
        ["GET", "/batches"],
        ["GET", "/batches/:id"],
        ["GET", "/audit-logs"]
    ];

    for (const [method, route] of makerRoutes) {

        const permission = await Permission.findOne({
            where: {
                method,
                route,
                base_url: "/api"
            }
        });

        if (permission) {

            await RolePermission.findOrCreate({
                where: {
                    role_id: maker.id,
                    permission_id: permission.id
                }
            });

        }
    }

    // -----------------------------
    // CHECKER PERMISSIONS
    // -----------------------------

    const checkerRoutes = [
        ["GET", "/batches"],
        ["GET", "/batches/:id"],
        ["POST", "/batches/:id/approve"],
        ["GET", "/audit-logs"]
    ];

    for (const [method, route] of checkerRoutes) {

        const permission = await Permission.findOne({
            where: {
                method,
                route,
                base_url: "/api"
            }
        });

        if (permission) {

            await RolePermission.findOrCreate({
                where: {
                    role_id: checker.id,
                    permission_id: permission.id
                }
            });

        }
    }

    console.log("Role permissions seeded successfully");
};

module.exports = {
    seedRolePermissions
};