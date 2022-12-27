let userList = [
    {
        id: '1',
        room: '1',
        username: 'Nguyễn Lê Anh Vũ',
    },
    {
        id: '2',
        room: '2',
        username: 'Nguyễn  Vũ',
    },
];

const addUser = (user) => {
    userList = [...userList, user];
    return userList;
};

const getUserList = (room) => {
    const userListOfRoom = userList.filter((user) => user.room === room);
    return userListOfRoom;
};

const removeUser = (id) => {
    userList = userList.filter((user) => user.id !== id);
    return userList;
};

module.exports = {
    getUserList,
    addUser,
    removeUser,
};
