const { Notification } = require("../models");

const createNotification = async ({
    userId,
    title,
    message,
    type,
    referenceId = null,
    transaction = null,
}) => {
    return await Notification.create(
        {
            userId,
            title,
            message,
            type,
            referenceId,
        },
        {
            transaction,
        }
    );
};

module.exports = createNotification;