const models = require('../../models');

const index = function (req, res) {
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit)) { // 정수가 아니라면
        return res.status(400).end();
        // end를 호출하면 응답해준다. 
    }
    models.User
        .findAll({
            limit: limit
        })
        .then(users => {
            res.json(users);
        });
};

const show = function (req, res) {
    const id = parseInt(req.params.id, 10);
    // id를 받아올 수 있다. 문자열이므로 형 변환 필요
    if (Number.isNaN(id)) {
        return res.status(400).end();
    }
    models.User.findOne({
        where: {id}
    }).then(user => {
        if (!user) return res.status(404).end();
        res.json(user);
    });
    // 특정 조건에 해당하는 값을 반환해서 새 Array를 반환
};

const destroy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).end();
    }
    models.User.destroy({
        where: {id}
    }).then(() => {
        res.status(204).end();
    });
    // id가 삭제할 id와 같지 않는 것만 필터링 => 삭제하는 것과 동일한 결과 도출
};

const create = (req, res) => {
    const name = req.body.name;
    if (!name) return res.status(400).end();
    
    // 이름과 지금 받은 이름이 같은지 판별해서 필터링해서 새로운 배열 반환
    // 그 배열의 길이가 있다면 중복된 것
    //if (isConflic) 
    models.User.create({name})
        .then(user => {
            res.status(201).json(user); //
        })
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).end();
            }
        })
};

const update = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        return res.status(400).end();
    }

    const name = req.body.name;
    if (!name) {
        return res.status(400).end();
    }

    // if (isConflict) return res.status(409).end();
    // if (!user) return res.status(404).end();
    models.User.findOne({where: {id}})
        .then(user => {
            if (!user) return res.status(404).end();

            user.name = name;
            user.save()
                .then(_=>{
                    res.json(user);
                })
                .catch(err => {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        return res.status(409).end();
                    }
                })
        })
};

module.exports = {index, show, destroy, create, update};