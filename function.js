const { initializeApp } = require("firebase/app");
const { get, set, ref, update, remove, getDatabase } = require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyB6hMrSlgJZMvEej61cXEaHhjVsG0FwwlI",
    authDomain: "lofi-stu.firebaseapp.com",
    databaseURL: "https://lofi-stu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lofi-stu",
    storageBucket: "lofi-stu.appspot.com",
    messagingSenderId: "495811512979",
    appId: "1:495811512979:web:3e999deff924c934ae1b66",
    measurementId: "G-6LEFT4S5VT"
};

const appFirebase = initializeApp(firebaseConfig)
const db = getDatabase(appFirebase);

function Users() {
    this.getUsers = () => {
        const refUser = ref(db, '/users');

        return get(refUser).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return {
                    status: 200,
                    code: "NOT_FOUND_USER",
                    message: "ไม่พบผู้ใช้"
                };
            }
        });
    };

    this.getUsersWhere = (username) => {
        const refUser = ref(db, '/users/' + username)

        return get(refUser).then((result) => {
            if (result.exists()) {
                return result.val()
            } else {
                return {
                    status: 400,
                    code: "NOT_FOUND_USER",
                    message: "ไม่พบผู้ใช้"
                };
            }
        })
    }

    this.addUser = async (username, password, email, url, type) => {
        const checkuser = await this.getUsersWhere(username);

        if (checkuser.status == 400) {
            const newItem = {
                username: username,
                password: password,
                type: type,
                email: email,
                status: 0,
                image: url
            }

            const newItemRef = ref(db, 'users/' + username);

            try {
                await set(newItemRef, newItem);
                return {
                    status: 200,
                    code: "SUCCESS",
                    message: 'สร้างรายการใหม่เรียบร้อยแล้ว',
                    data: newItem
                };
            } catch (error) {
                return {
                    status: 400,
                    code: "ERROR_CREATE_USER",
                    message: 'เกิดข้อผิดพลาดในการสร้างรายการใหม่'
                };
            }

        } else {
            return {
                status: 400,
                code: "USER_IS_ALREADY",
                message: "มีผู้ใช้แล้ว"
            }
        }
    }
}

module.exports = { Users }