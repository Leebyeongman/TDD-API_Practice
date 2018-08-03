const request = require('supertest');
const should = require('should');
const app = require('../../');
const models = require('../../models');

describe('GET /users는', () => {
    const users = [{
            name: 'alice'
        },
        {
            name: 'bek'
        },
        {
            name: 'chris'
        }
    ];
    before(() => models.sequelize.sync({
        force: true
    }));
    before(() => models.User.bulkCreate(users));
    describe('성공시', () => {
        
        it('유저 객체를 담은 배열로 응답한다', (done) => {
            request(app) // 슈퍼 테스트에 express 객체를 넘겨준다.
                .get('/users')
                // get메소드에 users 경로를 가지고 있는 요청을 보낸다.
                // 최종응답이 오고 에러가 오면 에러를 던진다.
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    // 배열이다 라는 것을 알 수 있음
                    done();
                });
        });

        it('최대 limit 갯수만큼 응답한다', (done) => {
            request(app) // 슈퍼 테스트에 express 객체를 넘겨준다.
                .get('/users?limit=2') // user List를 2개만 받겠다.
                .end((err, res) => {
                    res.body.should.have.lengthOf(2)
                    // length가 2이여야 한다.
                    done();
                });
        });
    });

    describe('실패시', () => {
        it('limit이 숫자형이 아니면 400을 응답한다.', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    });
});

describe('GET /users/1는', () => {
    const users = [{
            name: 'alice'
        },
        {
            name: 'bek'
        },
        {
            name: 'chris'
        }
    ];
    before(() => models.sequelize.sync({
        force: true
    }));
    before(() => models.User.bulkCreate(users));
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다.', (done) => {
            request(app)
                .get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1);
                    // (기대하는 id = 문자열, 그 값이 1이다라는 것);
                    done();
                });
        });
    });

    describe('실패시', () => {
        it('id가 숫자가 아닐 경우 400을 응답한다.', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        })
        it('id로 유저를 찾을 수 없을 경우 404로 응답한다.', (done) => {
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done)
        })
    })
});

describe('DELETE /users/1', () => {
    const users = [{
            name: 'alice'
        },
        {
            name: 'bek'
        },
        {
            name: 'chris'
        }
    ];
    before(() => models.sequelize.sync({
        force: true
    }));
    before(() => models.User.bulkCreate(users));
    describe('성공시', () => {
        it('204를 응답한다', (done) => {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        });
    });
    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users', () => {
    const users = [{
            name: 'alice'
        },
        {
            name: 'bek'
        },
        {
            name: 'chris'
        }
    ];
    before(() => models.sequelize.sync({
        force: true
    }));
    before(() => models.User.bulkCreate(users));
    describe('성공시', () => {
        let name = 'daniel',
            body;
        before((done) => {
            request(app)
                .post('/users')
                .send({
                    name
                })
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        it('생성된 유저 객체를 반환한다.', () => {
            body.should.have.property('id')
        });

        it('입력한 name을 반환한다.', () => {
            body.should.have.property('name', name)
        });
    });
    describe('실패시', () => {
        it('name 파라매터 누락시 400을 반환한다.', (done) => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });

        it('name이 중복일 경우 409를 반환한다', (done) => {
            request(app)
                .post('/users')
                .send({
                    name: 'daniel'
                })
                .expect(409)
                .end(done);
        })
    })
});

describe('PUT /users/:id', () => {
    const users = [{
            name: 'alice'
        },
        {
            name: 'bek'
        },
        {
            name: 'chris'
        }
    ];
    before(() => models.sequelize.sync({
        force: true
    }));
    before(() => models.User.bulkCreate(users));
    describe('성공시', () => {
        it('변경된 name을 응답한다.', (done) => {
            const name = 'chally';
            request(app)
                .put('/users/3')
                .send({
                    name: name
                })
                .end((err, res) => {
                    res.body.should.have.property('name', name);
                    done();
                });
        });
    });
    describe('실패시', () => {
        it('정수가 아닌 id일 경우 400을 응답한다.', (done) => {
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        });
        it('name이 없을 경우 400을 응답한다.', (done) => {
            request(app)
                .put('/users/1')
                .send({})
                .expect(400)
                .end(done);
        });
        it('없는 유저일 경우 404을 응답한다.', (done) => {
            request(app)
                .put('/users/999')
                .send({
                    name: 'foo'
                })
                .expect(404)
                .end(done);
        });
        it('이름이 중복일 경우 409을 응답한다.', (done) => {
            request(app)
                .put('/users/3')
                .send({
                    name: 'bek'
                })
                .expect(409)
                .end(done);
        });
    });
});