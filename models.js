const Sequlize = require('sequelize');
const sequelize = new Sequlize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false // console.log 와 바인딩 되어있음.
}); // 객체 생성

const User = sequelize.define('User', {
    name: {
        type: Sequlize.STRING,
        unique: true
    }
});

module.exports = {Sequlize, sequelize, User};