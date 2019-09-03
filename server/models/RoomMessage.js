
module.exports = (sequelize, DataTypes) => {

    const RoomMessage = sequelize.define( "roommessage", {
        room_id: { type: DataTypes.INTEGER, allowNull: false },
        message_id: { type: DataTypes.INTEGER, allowNull: false} 
    }, { modelName: "roommessage"})

    return RoomMessage
}