
module.exports = (sequelize, DataTypes) => {
    
    const UserMessage = sequelize.define( "usermessage", {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        message_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { modelName: "usermessage" })

    return UserMessage
}