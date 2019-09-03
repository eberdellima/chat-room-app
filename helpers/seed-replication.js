
const mapToUsers = (collections) => {
    return [...collections].map(data => {
        data.icon = ""
        data.rooms = [1]
        return data
    })
}

const mapToMessages = (collections) => {
    return [..collections].map(data => {
        data.sent_time = Date.now()
        return data
    })
}

const mapToRooms = (collections) => {
     return collections
}

module.exports = {
    mapToUsers,
    mapToMessages,
    mapToRooms
}