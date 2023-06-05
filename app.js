const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const mysql = require("mysql2");
const Stream = require('stream').Transform;

const jwt = require('jsonwebtoken');
const key = '5ca24005b740717ba4f3f6bc48a230700e68c2a4b11ecedb96f169f4efaf1f21';

function createToken(email, password) {
	var token = jwt.sign({ email: email, password: password }, key);
	return token;
}

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "user",
	password: "123hard321"
})

// connection.connect(function(err){
//
//     if (err) {
//         return console.error("Ошибка: " + err.message);
//     }
//     else{
//         login ="0"
//         console.log("Подключение к серверу MySQL успешно установлено");
//     }
// });


const server = http.createServer((req, res) =>{
    //ответ с сервера

    var json;

    if (req.method === 'POST')
    {
        // POST
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

         req.on('end', () => {
            console.log(body);
            let params
                try {
                    params = JSON.parse(body);
                } catch (err) {
                    console.log("упс...");
                }
                if (params !== undefined) {
                    if (params.type === 2) {
                        if(params.login != undefined && params.password != undefined ){
                            if(params.login.length<45 && params.password.length<45 ){
                        const user = [params.login, params.password];
                        const sql = "select * from user.users where login = ? and pass = ?"
                
                        connection.query(sql, user, function (err, results) {
                            if (err) console.log(err);
                           
                
                
                
                
                            if (results[0] === undefined) {
                                console.log("пользователь не найден");
                                json = {
                                    login: false,
                
                                }
                
                            } else {
                                console.log("такой пользователь есть");
                                var token = createToken(params.login, params.password);
                                json = {
                                    user_id: results[0].id,
                                    nickname: results[0].login,
                                    login: true,
                                    token: token
                
                                }
                
                            }
                            res.end(JSON.stringify(json));
                        });
                    }
                } else res.end(JSON.stringify(false));
                    }
                    if (params.type === 3) {
                        if(params.login != undefined && params.password != undefined ){
                        if(params.login.length<45 && params.password.length<45 ){
                        const user = [params.login];
                        const sql = "select id from user.users where user.users.login = ?"
                        console.log(params.password);
                        connection.query(sql, user, function (err, results) {
                            if (err) console.log(err);
                            else console.log(results);
                
                            if (results[0] === undefined) {
                                console.log("такого пользователя нет");
                                const user2 = [params.login, params.password];
                                const sql2 = "insert into users (login, pass) values (?,?)"
                                connection.query(sql2, user2, function (err, results) {
                                    if (err) console.log(err);
                                    else {
                                    }
                                })
                                var token = createToken(params.login, params.password);
                                json = {
                                    nickname: params.login,
                                    login: true,
                                    token: token
                                }
                
                            } else {
                                console.log("такой пользователь есть");
                                json = {
                                    login: false,
                                }
                
                            }
                
                            res.end(JSON.stringify(json));
                        });
                    }
                } else res.end(JSON.stringify(false));
                    }
                    if (params.type === 1) {
                        const queue = "SELECT * FROM user.products";
                
                        connection.query(queue, '', function (err, results) {
                            if (err) console.log(err);
                            else {
                
                                let newest = {
                                    'id': [],
                                    'name': [],
                                    'price': [],
                                    'path': [],
                                }
                
                                for (let i = 0; i < results.length; i++) {
                                    
                                        newest.id.push(results[i].id);
                                        newest.name.push(results[i].name);
                                        newest.price.push(results[i].price);
                                        newest.path.push(results[i].path)
                
                
                                }
                                res.end(JSON.stringify(newest));
                            }
                        })
                    }
    
                
                    if (params.type === 5) {
                        if (params.token != null){
                            var status = false;
					var username;
					var flagKostil = false;
					try {
						var rest = jwt.verify(params.token, key);
						flagKostil = true;
					} catch (err) {
						console.log("Ya tus")
						res.end(JSON.stringify({ status: "Gabella" }));
						flagKostil = false;
					}

				
                        if(flagKostil){
                        const user = [rest.email];
                        const queue = "SELECT * FROM user.transaction where persone like ?"
                
                        connection.query(queue, user, function (err, results) {
                            if (err) console.log(err);
                            else { }
                
                            if (results[0] === undefined) {
                                console.log("Заказы не найдены");
                                let order = {
                                    'id': [],
                                    'status': [],
                                    'price': [],
                                    'persone': [],
                                    'date': [],
                                    'info': [],
                                }
                                
                                res.end(JSON.stringify(order));
                
                            } else {
                
                                let order = {
                                    'id': [],
                                    'status': [],
                                    'price': [],
                                    'persone': [],
                                    'date': [],
                                    'info': [],
                                }
                                console.log(results[0].Status);
                
                                for (let i = 0; i < results.length; i++) {
                                    order.id.push(results[i].id);
                                    order.status.push(results[i].status);
                                    order.price.push(results[i].price);
                                    order.persone.push(results[i].persone);
                                    order.date.push(results[i].date);
                                    order.info.push(results[i].info);
                                }
                            
                                res.end(JSON.stringify(order));
                            }
                
                        })
                    }
                    }
                }
                    if (params.type === 6) {
                        if (params.token != null){
                            var status = false;
					    var username;
					    var flagKostil = false;
					    try {
                            var rest = jwt.verify(params.token, key);
                            flagKostil = true;
					        } catch (err) {
                                console.log("Ya tus")
                                res.end(JSON.stringify({ status: "Gabella" }));
                                flagKostil = false;
					        }

				
                        if(flagKostil) {
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                var yyyy = today.getFullYear();
                                var hourse = today.getHours();
                                var minute = today.getMinutes();
                                today = mm + '/' + dd + '/' + yyyy+ ' ' + hourse + ':' + minute;
                
                                const queue = "SELECT * FROM user.products";
                
                
                                connection.query(queue, '', function (err, results) {
                                    if (err) console.log(err);
                                    else {
                                        money = 0;
                                        info = "";
                                       var error = false;
                                        for(var w in params.cart){
                                            if((w < results.length && w > 0)){
                                                if (params.cart[w] != null){
                                                    if(Math.round(params.cart[w]) > 1 && Math.round(params.cart[w]) < 1000){
                                                        info+=results[w-1].name+"("+Math.round(parseInt(params.cart[w]))+") ";
                                                        money+=Math.round(parseInt(params.cart[w]))*results[w-1].price;
                                                    } else error = true;
                                                } else error = true;
                                            } else error = true;
                                        }
                                        
                                    if (error == false && money>0){
                                        const user = ["notready", money, rest.email, today, info];
                                        const sql = "insert into user.transaction (status, price, persone, date, info) values (?,?,?,?,?)";
                                        connection.query(sql, user, function (err, results) {
                                            if (err) {console.log(err)
                                                res.end(JSON.stringify(false));
                                            } else res.end(JSON.stringify(true));;
                                        })
                                        console.log('ready');
                                        } else res.end(JSON.stringify(false));
                                    }
                                })
                            }
                        }
                    }
                    if (params.type > 6) {
                        res.end(JSON.stringify(false));
                    }
                            
                    }
        });

        
    }
    else
    {

        let filePath = path.join(__dirname,"public", req.url === '/' ? 'index.html' : req.url)
        const ext = path.extname(filePath)
        console.log(filePath)
        let contentType = 'text/html'

        switch (ext) {
            case '.svg':
                contentType = 'application/image/svg+xml'
                break
            case '.txt':
                contentType = 'text/txt'
                break
            case '.css':
                contentType = 'text/css'
                break
            case '.woff':
                contentType = 'application/font-woff'
                break
            case '.js':
                contentType = 'text/javascript'
                break
            case '.png':
                contentType = 'image/png'
                break
            case '.jpg':
                contentType = 'image/jpg'
                break
            default:
                contentType = 'text/html'
        }

        if (!ext) {
            filePath += '.html'
        }

        console.log(filePath)

        fs.readFile(filePath, (err, content) => {
            if (err) {
                fs.readFile(path.join(__dirname,"public", 'error.html'), (err, data) => {
                    if (err) {
                        res.writeHead((500))
                        res.end('ERROR')
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        })

                        res.end(data)
                    }
                })
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType
                })

                res.end(content)
            }
        })
    }


})


server.listen(3000,()=>{
    console.log(`Server has been started ON 443...`)
})
