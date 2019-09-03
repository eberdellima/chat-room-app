
module.exports = (sequelize, DataTypes) => {

    const Room = sequelize.define( "room", {
        id: { type: DataTypes.INTEGER, allowNull: false }
    }, { modelName: "room"})

    return Room
}