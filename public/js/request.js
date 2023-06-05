var url = window.location.origin;
var login;

function validateUsr(username) {
    let regexp = /[^A-z^А-я\d_]/;
    let forbiddenSymbols = username.match(regexp);
    if (forbiddenSymbols === null) {
    return false;
    } else return true;
    
    }
    
    function validatePass(username) {
    let regexp = /[^A-z^А-я\d\.\%\-\|\=\+\*\^\$\#\@\&]/;
    let forbiddenSymbols = username.match(regexp);
    if (forbiddenSymbols === null) {
    return false;
    } else return true;
    
    }

function RequestLogin(){
    if(document.querySelector(`#mail`).value.length > 2 && document.querySelector(`#password`).value.length > 2)
    {
    if (
        (validateUsr(document.querySelector(`#mail`).value) === false &&
        validatePass(document.querySelector(`#password`).value) === false)  ) {

        body = {
            login: document.querySelector(`#mail`).value,
            password: document.querySelector(`#password`).value,
            type: 2
        }


        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                if (data.login === true) {
                    alert("вход выполнен")
                    localStorage.setItem("login", "1");
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("user_name", data.nickname);
                    localStorage.setItem('token', data.token);
                    user();
                   document.location.href = "index.html";

                } else {
                    alert("Неправильный пароли или логин");
                }
            })
            .catch(console.error);
    }
    else {
        alert("логин или пароль могут состоять только из латинских букв, кириллицы и цифр.");
    }
    }
    else {
        alert("логин или пароль должны быть больше 3 и меньше 12");
    }
}

function RequestRegister(){
    if(document.querySelector(`#mail_register`).value.length > 2 && document.querySelector(`#password_register`).value.length > 2)
    {
    if (
        (validateUsr(document.querySelector(`#mail_register`).value ) === false &&
        validatePass(document.querySelector(`#password_register`).value ) === false)) {
        body = {
            login: document.querySelector(`#mail_register`).value,
            password: document.querySelector(`#password_register`).value,
            type: 3
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                if (data.login === true) {
                    alert("вход выполнен")
                    localStorage.setItem("login", "1");
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("user_name", data.nickname);
                    localStorage.setItem('token', data.token);
                    user();
                    document.location.href = "index.html";
                } else {
                    alert(data.error);
                }
            })
            .catch("data error, max lenght login or password = 50");
    }
    else {
        alert("логин или пароль могут состоять только из латинских букв, кириллицы и цифр.");
    }
    }
    else {
        alert("логин или пароль должны быть больше 3 и меньше 12");
    }
}

function login_exit() {

    localStorage.setItem("login","0");
    localStorage.removeItem('cart');
    localStorage.removeItem('user_name');
    document.location.href = ("/");
}

function nickname() {
    document.write(localStorage.getItem("user_name"))
}

function user() {
    if (login === undefined || localStorage.getItem("login")===null) {
        login=parseInt(localStorage.getItem("login"));
    }
    if (login === 1) {
        document.write(user_yes);
    }
    else {
        document.write(user_not);
        
    }

}

function qwerty_resorce() {
	let body = {
		token: localStorage.getItem("token"),
		type: 5
	}

	fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/text'
		}
	}).then(response => response.json())
		.then(data => {
			if (data.status == "Gabella") {
				localStorage.clear();
                alert("Повторите попытку авторизации");
                location = "/login.html"

			}
			else {
				localStorage.setItem("order", JSON.stringify(data));
			}
		}).catch(console.error);
}

function show_order() {

	qwerty_resorce();

	let object = JSON.parse(localStorage.getItem("order"));
	let html = "";


	for (let i = 0; i < object.status.length; i++) {
		html = html + "<tr>\n" +
			"<td class=\"price\">\n" +
			"<h5>" + object.id[i] + "</h5>\n" +
			"</td>\n" +
			"<td class=\"cart_product_desc\">\n" +
			"<h5>" + object.info[i] + "</h5>\n" +
			"</td>\n" +
			"<td class=\"cart_product_desc\">\n" +
			"<h5>$" + object.price[i] + "</h5>\n" +
			"</td>\n" +
			"<td class=\"cart_product_desc\">\n" +
			"<h5>" + object.date[i] + "</h5>\n" +
			"</td>\n" +
			"</tr>\n"
	}
	document.write(html)
}

document.addEventListener("DOMContentLoaded", function (event) {
    qwerty_resorce();
    loadStorage();
    });



var user_not = 
"<div class=\"login_user\"> \n"+
"<li><a href=\"#\">Пользователь<i class=\"ti-angle-down\"></i></a>\n" +
"<ul class=\"submenu\"> \n" +
"    <li><a href=\"login.html\">Вход</a></li> \n" +
"    <li><a href=\"register.html\">Регистрация</a></li> \n" +
"</ul> \n" +
"</div>\n";
 


var user_yes= 
"<div class=\"login_user\"> \n"+
"<li><a href=\"#\"><script type=\"text/javascript\"> nickname() </script><i class=\"ti-angle-down\"></i></a>\n" +
"<ul class=\"submenu\"> \n" +
"    <li><a href=\"basket.html\">Корзина</a></li> \n" +
"    <li><a href=\"history.html\">История</a></li> \n" +
"    <li><a onclick=\"login_exit()\">Выйти</a></li> \n" +
"</ul> \n" +
"</div>\n";


function loadStorage() {
	let body = {
		type: 1
	}


	

	fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		header: {
			'Content-Type': 'application/text'
		}
	}).then(response => response.json())
		.then(data => {
			localStorage.setItem("data", JSON.stringify(data));
		}).catch(console.error);
}

    function buy(cart){


        body = {
            token:  localStorage.getItem("token"),
            cart: cart,
            type:6
        }


        
       fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
           .then(data => {

            if (data === true) {
                localStorage.removeItem('cart');
                alert("Заказ принят")
               
              
			}
			else if (data.status == "Gabella") {
				localStorage.clear()
                alert("Повторите попытку авторизации")
                location = "/login.html"
               
            }else
            {
				localStorage.removeItem('cart');
                alert("Ошибка обработки заказа");
                
			}

          })
           .catch(console.error);
    }

