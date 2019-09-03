
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define( "user", {
        id: { type: DataTypes.INTEGER, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        icon: { type: DataTypes.STRING, allowNull: false },
    }, { modelName: "user"})

    return User
}