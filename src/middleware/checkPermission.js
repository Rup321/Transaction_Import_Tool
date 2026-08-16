const { sequelize, Permission, RolePermission, User } = require("../models");

const checkPermission = async (req, res, next) => {
    try {
        const baseUrl = req.baseUrl || "";
        const routePath = req.route ? req.route.path : req.path
        let permissionExist = await Permission.findOne({
            where: {
                base_url: baseUrl,
                method: req.method,
                route: routePath
            }
        })
        if (!permissionExist) {
            return res.status(404).json({
                msg: "Permission not found",
                success: false
            })
        }

        let userRoleExists = await RolePermission.findOne({
            where: {
                permission_id: permissionExist.id,
                role_id: req.userData.role_id
            }
        })
        if (!userRoleExists) {
            return res.status(403).json({
                msg: "Forbidden",
                status: false
            })
        }

        next()

    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            status: false
        })
    }
}

module.exports = { checkPermission }