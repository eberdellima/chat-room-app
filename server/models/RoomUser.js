
module.exports = (sequelize, DataTypes) => {

    const RoomUser = sequelize.define( "roomuser", {
        room_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { modelName: "roomuser"}) 

    return RoomUser
}