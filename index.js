console.clear();
const express = require('express');
const cors = require('cors');
const { Users } = require('./function');
const { Buffer } = require('buffer')

const port = 3560;
const app = express();
app.use(express.json());
app.use(cors());

const userscls = new Users();

app.get('/user', async (req, res) => {
    const qur = req.query;
    var responce;

    if (qur.password == 'lofi-stu-admin') {
        try {
            const result = await userscls.getUsers();

            responce = {
                status: 200,
                code: "SUCCESS",
                message: "สำเร็จ",
                data: result
            };
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            responce = {
                status: 500,
                code: "SERVER_ERROR",
                message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์"
            };
        }
    } else {
        responce = {
            status: 400,
            code: "PASSWORD_NOT_CORRECT",
            message: "รหัสผ่านไม่ถูกต้อง!"
        };
    }

    res.send(responce);
});

app.get('/user/where', async (req, res) => {
    const query = req.query;

    try {
        const result = await userscls.getUsersWhere(query.username);

        if (result.status == 400) {
            res.send(result)
        } else {
            res.send({
                status: 200,
                code: "SUCCESS",
                message: "สำเร็จ",
                data: result
            })
        }

    } catch (errro) {
        res.send({
            status: 500,
            code: "SERVER_ERROR",
            message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์"
        })
    }
})

app.get('/login/:type', async (req, res) => {
    const query = req.query;
    const type = req.params.type;

    if (!query.username) {
        res.send({
            status: 400,
            code: "USERNAME_IS_EMPTY",
            message: "ชื่อผู้ใช้ห้ามเปนค่าว่าง"
        })
    } else if (type == 0) {
        if (!query.password) {
            res.send({
                status: 400,
                code: "PASSWORD_IS_EMPTY",
                message: "รหัสผ่านห้ามเป็นค่าว่าง"
            })
        } else {
            try {
                const getUser = await userscls.getUsersWhere(query.username);

                if (getUser.status == 400) {
                    res.send(getUser)
                } else {
                    if (query.password == getUser.password) {
                        res.send({
                            status: 200,
                            code: "SUCCESS",
                            message: "เข้าสู่ระบบสำเร็จ",
                            data: getUser
                        })
                    } else {
                        res.send({
                            status: 400,
                            code: "PASSWORD_NOT_CORRECT",
                            message: "รหัสผ่านไม่ถูกต้อง"
                        })
                    }
                }
            } catch (errro) {
                res.send({
                    status: 500,
                    code: "SERVER_ERROR",
                    message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์"
                })
            }
        }
    } else if (type == 1) {
        if (!query.password) {
            res.send({
                status: 400,
                code: "PASSWORD_IS_EMPTY",
                message: "รหัสผ่านห้ามเป็นค่าว่าง"
            })
        } else {
            try {
                const getUser = await userscls.getUsersWhere(query.username);

                if (getUser.status == 400) {
                    res.send(getUser)
                } else if (query.password == "01login") {
                    res.send({
                        status: 200,
                        code: "SUCCESS",
                        message: "เข้าสู่ระบบสำเร็จ",
                        data: getUser
                    })
                }
            } catch (errro) {
                res.send({
                    status: 500,
                    code: "SERVER_ERROR",
                    message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์"
                })
            }
        }
    }
})

app.post('/register', async (req, res) => {
    const body = req.body;
    const query = req.query;

    if (!body.username) {
        res.send({
            status: 400,
            code: "USERNAME_IS_EMPTY",
            message: "ชื่อผู้ใช้ห้ามเป็นค่าว่าง"
        })
    } else if (!body.password) {
        res.send({
            status: 400,
            code: "PASSWORD_IS_EMPTY",
            message: "รหัสผ่านห้ามเป็นค่าว่าง"
        })
    } else if (!body.email) {
        res.send({
            status: 400,
            code: "EMAIL_IS_EMPTY",
            message: "อีเมลห้ามเป็นค่าว่าง"
        })
    } else {
        try {
            const adduser = await userscls.addUser(body.username, body.password, body.email, body.url, query.type);
            res.send(adduser)
        } catch (error) {
            res.send({
                status: 500,
                code: "SERVER_ERROR",
                message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์"
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Listen: http://localhost:${port}`);
})