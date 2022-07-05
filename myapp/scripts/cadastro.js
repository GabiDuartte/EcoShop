// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA8e9J8fVDDJEPhiqSshQ6ZRE7JEGXXQl0",
    authDomain: "ecolshop-972a6.firebaseapp.com",
    databaseURL: "https://ecolshop-972a6-default-rtdb.firebaseio.com",
    projectId: "ecolshop-972a6",
    storageBucket: "ecolshop-972a6.appspot.com",
    messagingSenderId: "76103641047",
    appId: "1:76103641047:web:9746580fa86e40912a8d92"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function
function register() {
    // Get all our input fields
    var email = document.getElementById('txtEmail').value
    var senha = document.getElementById('txtSenha').value
    var confirmarSenha = document.getElementById('txtConfirmacaoSenha').value
    var nome_de_usuario = document.getElementById('txtNome').value
    var cpf = document.getElementById('txtCPF').value
    var dt_nasc = document.getElementById('txtDataNascimento').value
    var telefone = document.getElementById('txtTelefone').value
    var cep = document.getElementById('txtCEP').value
    var numero = document.getElementById('txtNumero').value
    var complemento = document.getElementById('txtComplemento').value
    var referencia = document.getElementById('txtReferencia').value

    // todo: verificar CPF, CEP, Senha == confirmar senha

    // Validate input fields

    if (senha != confirmarSenha) {
        alert("Confirmação da senha errada!");
        return;
    }

    if (validate_email(email) == false || validate_password(senha) == false) {
        alert('Email ou senha inválidos!')
        return
        // Don't continue running the code
    }

    if (validate_field(nome_de_usuario) == false || validate_field(cpf) == false
        || validate_field(dt_nasc) == false || validate_field(email) == false
        || validate_field(telefone) == false || validate_field(cep) == false
        || validate_field(numero) == false || validate_field(senha) == false) {
        alert('Um ou mais campos obrigatórios não foram preenchidos!!')
        return
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, senha)
        .then(async function () {
            // Declare user variable
            var user = auth.currentUser

            // Add this user to Firebase Database
            var database_ref = database.ref()

            // Create User data
            var user_data = {
                email: email,
                password: senha,
                username: nome_de_usuario,
                cpf: cpf,
                dt_nasc: dt_nasc,
                telefone: telefone,
                cep: cep,
                numero: numero,
                complemento: complemento,
                referencia: referencia,
                last_login: Date.now()
            }

            // Push na Firebase Database
            database_ref.child('users/' + user.uid).set(user_data)

            const newUsuario = {
                "email": email,
                "username": nome_de_usuario,
                "cpf": cpf,
                "dt_nasc": dt_nasc,
                "tel": telefone,
                "cep": cep,
                "numero": numero,
                "complemento": complemento,
                "referencia": referencia,
                "id": user.uid
            }

            const newCarrinho = {
                "id": user.uid
            }

            const newFavoritos = {
                "id": user.uid
            }

            const newCartoes = {
                "id": user.uid
            }

            const newPedidos = {
                "id": user.uid
            }

            const configUsuario = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUsuario)
            }

            const configCarrinho = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCarrinho)
            }

            const configFavoritos = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFavoritos)
            }

            const configCartoes = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCartoes)
            }

            const configPedidos = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPedidos)
            }

            // Push na Firebase Firestore
            let response1 = await fetch('http://localhost:3000/usuario', configUsuario);
            alert('Usuario cadastrado!')

            let response2 = await fetch('http://localhost:3000/carrinho', configCarrinho);
            alert('Carrinho criado!')

            let response3 = await fetch('http://localhost:3000/favoritos', configFavoritos);
            alert('Favoritos criado!')

            let response4 = await fetch('http://localhost:3000/cartoes', configCartoes);
            alert('Cartoes criado!')

            let response5 = await fetch('http://localhost:3000/pedidos', configPedidos);
            alert('Pedidos criado!')

            window.location.href = 'login.html'
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })


}

function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
        return false
    } else {
        return true
    }
}

// marca campo obrigatorio
function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}

window.onload = () => {
    var botato_cadastro = document.getElementById('btn-cadastro');
    botato_cadastro.addEventListener('click', register);
}