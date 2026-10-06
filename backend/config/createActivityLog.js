const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
    userId,
    action,
    module,
    description,
    referenceId = null,
    req = null,
    transaction = null,
}) => {
    return await ActivityLog.create(
        {
            userId,
            action,
            module,
            description,
            referenceId,
            ipAddress: req?.ip || null,
            userAgent: req?.get("user-agent") || null,
        },
        {
            transaction,
        }
    );
};

module.exports = createActivityLog;