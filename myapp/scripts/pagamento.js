var max_cartoes = 3
var numero_cartoes
var cartao_selecionado

async function load_page() {
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

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            id = user.uid;
            //console.log(id)
            const response = await fetch(`http://localhost:3000/usuario/1/${id}`);
            var usuario = await response.json();
            //console.log(usuario)

            document.getElementById('btn_entrar_cadastrar').style.display = "none"
            document.getElementById('btn_entrar_cadastrar').innerHTML = `
            <li class="nav-item">
                <a href="cliente_dados.html" class="nav-link text-white">Logado como <b>${usuario.username}</b></a>
            </li>
            `;
            document.getElementById('SAIR').innerHTML = `
            <li class="nav-item">
                <a href="login.html" class="nav-link text-white">Sair</a>
            </li>
            `
            document.getElementById('btn_entrar_cadastrar').style.display = "block"

            const responseQuant = await fetch(`http://localhost:3000/carrinho/quantidade/${user.uid}`);
            var quantidade = await responseQuant.json();

            if (quantidade == 0) { window.location.href = "index.html"; }

            if (quantidade.length == 1) {
                document.getElementById('numero_carrinho').style.display = "none"
            } else {
                document.getElementById('numero_carrinho').style.display = "block";
                document.getElementById('numero_carrinho').innerHTML = `<small>${quantidade.reduce((partialSum, a) => partialSum + a, 0)}</small>`;
            }

            const response2 = await fetch(`http://localhost:3000/carrinho/valor/${id}`);
            var valor_total = await response2.json();

            document.getElementById('valor-total').innerHTML += valor_total

            const response3 = await fetch(`http://localhost:3000/cartoes/${id}`);
            var cartoes = await response3.json();

            numero_cartoes = cartoes.numero.length - 1

            for (var i in cartoes.numero) {
                if (i > 0) {
                    var num = cartoes.numero[i];
                    num_final = num.slice(12, 16);
                    document.getElementById('lista-cartoes').innerHTML += `
                <button onclick="document.getElementById('botao-cartao').innerHTML = 'Selecionado: **** ${num_final}'; 
               cartao_select('${num}');" 
                class="list-group-item list-group-item-action">Cartão terminado em **** ${num_final}</button>
                
                <button onclick="remover_cartao('${id}', '${num}')" class="list-group-item list-group-item-action end-0 p-2 text-danger text-center">
                    <b class="bi-x" style="font-size: 16px; line-height: 12px;">Remover cartão</b>
                </button>
                <br>
                `}
            }

            console.log('Numero de cartoes: ', numero_cartoes);

        } else {
            // No user is signed in.
        }
    });
}

function cartao_select(num) { cartao_selecionado = num; console.log(cartao_selecionado) };

async function remover_cartao(uid, num_cartao) {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;

            const remover_cartao = {
                "uid": uid,
                "num_cartao": num_cartao
            }

            const config_remover_cartao = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(remover_cartao)
            }

            let confirmar_remover = confirm("Remover o cartão de final *** " + num_final + "?");

            if (confirmar_remover == true) {// Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/cartoes/remover/${uid}/${num_cartao}`, config_remover_cartao);
                //alert(uid, ' adicionado a ', prod_id);

                document.location.reload(true);
            } else { return }

        } else {
            // No user is signed in.
        }
    });

}

async function add_cartao() {
    if (numero_cartoes < max_cartoes) {// Your web app's Firebase configuration
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
        //firebase.initializeApp(firebaseConfig);
        // Initialize variables
        const auth = firebase.auth()
        const database = firebase.database()

        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // User is signed in.
                id = user.uid;

                var nome = document.getElementById('txtNome').value;
                var numero = document.getElementById('txtNumero').value
                var validade = document.getElementById('txtValidade').value
                var codigo = document.getElementById('txtCodigo').value

                if (nome.length == 0) { alert("Insira o nome impresso no cartão."); return; }
                if (numero.length < 16) { alert("Número de cartão inválido"); return; }
                if (codigo.length < 3) { alert("Código de segurança inválido"); return; }

                const newCartao = {
                    "uid": id,
                    "nome": nome,
                    "numero": numero,
                    "validade": validade,
                    "codigo": codigo
                }

                const configCartao = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCartao)
                }

                // Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/cartoes/${id}`, configCartao);
                numero_cartoes += 1; console.log('Numero de cartoes: ', numero_cartoes);
                document.location.reload(true);

            } else {
                // No user is signed in.
            }

        });
    } else { alert("Numero maximo de cartoes atingido!") }
}

function mudar_pagina() {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            if (cartao_selecionado == undefined) {
                alert("Selecione um cartão!");
                return;
            }
            
            // User is signed in.
            uid = user.uid;

            //todo: zerar carrinho

            //generates random id;
            let id_aleatorio = () => {
                let s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            var id_pedido = id_aleatorio();

            const response = await fetch(`http://localhost:3000/carrinho/valor/${uid}`);
            var valor_total = await response.json();

            var hoje = new Date();
            var dd = String(hoje.getDate()).padStart(2, '0');
            var mm = String(hoje.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = hoje.getFullYear();

            hoje = dd + '-' + mm + '-' + yyyy;

            const response2 = await fetch(`http://localhost:3000/carrinho/${uid}`);
            var array_produtos = await response2.json();

            var str_produtos = ""
            for (var i in array_produtos) {
                str_produtos += array_produtos[i] + ";"
            }

            //console.log(str_produtos)

            const newPedido = {
                data: hoje,
                id_pedido: id_pedido,
                itens: str_produtos,
                valor: valor_total,
                cartao: cartao_selecionado
            }

            const configPedido = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPedido)
            }

            // Push na Firebase Firestore
            let response3 = await fetch(`http://localhost:3000/pedidos/${uid}`, configPedido);

            // apagando o carrinho
            const zerar_carrinho = {
                "id": uid,
            }

            const config_zerar_carrinho = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(zerar_carrinho)
            }

            // Push na Firebase Firestore
            let response4 = await fetch(`http://localhost:3000/carrinho/remover_tudo_tudo/1/${id}`, config_zerar_carrinho);
            //alert(uid, ' adicionado a ', prod_id);

            document.getElementById('numero_carrinho').style.display = "none"

            document.getElementById('main').innerHTML = `
    
    <div class="container text-center">
      <h1>Obrigado!</h1>
      <hr>
      <h3>Anote o código de seu pedido:</h3>
      <h2 class="text-success"><b>${id_pedido}</b></h2>
      <p>Em até dois dias, seu pedido será entregue. Qualquer dúvida sobre este pedido, entre em contato conosco e informe o número do pedido para que possamos te ajudar.</p>
      <p>Tenha um ótimo dia!</p>
      <p>
          Atenciosamente,<br>
          Equipe Ecoshop Online
      </p>
      <p>
          <a href="index.html" class="btn btn-success btn-lg">Voltar à Página Principal</a>
      </p>
  </div>

    `

        } else {
            // No user is signed in.
        }
    });
}

function logOut() {
    firebase.auth().signOut().then(function () {
        alert('Signed Out');
        //window.location.href = 'login.html'
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}

window.onload = () => {
    load_page();
    var log = document.getElementById('SAIR');
    log.addEventListener('click', logOut);

    var log = document.getElementById('reg-cartao');
    log.addEventListener('click', add_cartao);

    var log = document.getElementById('finalizar');
    log.addEventListener('click', mudar_pagina);

}
