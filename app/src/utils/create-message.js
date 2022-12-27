const formatTime = require('date-format');

const createMessages = (message, username, id) => {
    return {
        socketId: id,
        username,
        message,
        createAt: formatTime('dd:MM:yyyy-hh:mm:ss', new Date()),
    };
};

module.exports = {
    createMessages,
};
