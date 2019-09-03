module.exports = (sequelize, DataTypes) => {
    
    const Counter = sequelize.define( 'counter', {
        name: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.INTEGER, allowNull: false }
    }, { modelName: "counter"})

    return Counter
}