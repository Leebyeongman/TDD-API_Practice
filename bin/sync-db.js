const models = require('../models');

module.exports = () => {
    const options = {
        force: process.env.NODE_ENV === 'test' ? true : false
    }; // 환경 변수 값을 읽어서 test일때만 초기화
    return models.sequelize.sync(options);
};
