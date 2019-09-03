
module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define( "message", {
        id: { type: DataTypes.INTEGER, allowNull: false },
        sender: { type: DataTypes.STRING, allowNull: false },
        sent_time: { type: DataTypes.DATE, allowNull: false },
        room_id: { type: DataTypes.INTEGER, allowNull: false },
        text: { type: DataTypes.TEXT, allowNull: false }
    }, { modelName: "message"})

    return Message
}
