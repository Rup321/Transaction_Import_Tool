
const seedRoles = async () => {
    try {
        const { Role } = require("../models");
        const roles = [
            {
                role_name: "Maker",
                description: "Can upload transaction files"
            },
            {
                role_name: "Checker",
                description: "Can approve uploaded batches"
            }
        ];

        for (const role of roles) {
            await Role.findOrCreate({
                where: { role_name: role.role_name },
                defaults: role
            });
        }

        console.log("Roles seeded successfully.");
    } catch (error) {
        console.error("Error seeding roles:", error.message);
    }
};

module.exports = { seedRoles };