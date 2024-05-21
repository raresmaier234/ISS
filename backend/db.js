const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // Valoare implicită
    }
}, {
    tableName: 'Users'
});

const Bug = sequelize.define('Bug', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Bugs'
});

module.exports = { sequelize, User, Bug };
