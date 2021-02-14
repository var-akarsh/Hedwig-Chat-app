const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (existUser) {
        return {
            error: "User already exist"
        }
    }
    //Store User
    const user ={id,username,room}
    users.push(user)
    return {user}
}
const removeUser=(id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const userFound = users.find((user) => user.id === id)
    return userFound 
}
const getUsersinRoom=(room)=>{
    room = room.trim().toLowerCase()
    const userinRoom = users.filter((user)=> user.room===room)
        return userinRoom
    }
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}