const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => user.room === room && user.name === name);
  if (existingUser) {
    return { error: 'Nombre de usuario ya existe' };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const indexUser = users.findIndex((user) => user.id === id);
  if(indexUser !== -1) return users.splice(indexUser,1)[0];
};

const getUser = (id) => users.find(user => user.id === id);


const getUserInRoom = (room) => users.filter(user => user.room === room);

const userMethods =  { 
  addUser, 
  removeUser, 
  getUser, 
  getUserInRoom 
};

module.exports = userMethods;