const fs = require('fs');
const dbFile = "./chat.db";
const exist = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
.open({
    filename: dbFile,
    driver: sqlite3.Database
})
.then(async dBase => {
    db = dBase;
    try {
        if (!exist) {


        } else {
            // await db.run(
            //     `create table message(msg_id integer primary key autoincrement, content TEXT, author integer, constraint fk_author foreign key (author) references user(user_id));`
            // );
            // await db.run(`insert into message(content, author) values("oo",2)`);


            console.log(await db.all("select * from message"));

        }
    } catch (dbError) {
        console.error(dbError);
    }
    module.exports = {
        getMessage : async () => {
            try{
                return await db.all(`select msg_id , content, login, user_id from message join message on message.author = user.user_id`)
            }
            catch (dbError) {
                console.error(dbError);
            }
        },
        addMessage : async (msg, userId) => {
            await db.all(`insert into message(content, author) values(msg,userId)`
                [msg, userId])
        },
        isUserExist: async (login) => {
            const candidate = await  db.all(`select * from user where login = ?`, [
                login,
            ]);
            return !!candidate.length;
        },
        addUser: async (user) => {
            await db.run(`insert into user (login, password) values (?, ?)`, [
                user.login,
                user.password,
            ]);
        }
    };
});
