var valor_total = 0

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



            loadCarrinho(user.uid);

        } else {
            // No user is signed in.
        }
    });
}

const loadCarrinho = async (id_carrinho) => {
    const response = await fetch(`http://localhost:3000/carrinho/${id_carrinho}`);
    var array_produtos = await response.json();

    const responseQuant = await fetch(`http://localhost:3000/carrinho/quantidade/${id_carrinho}`);
    var quantidade = await responseQuant.json();

    if (quantidade == 0) { window.location.href = "index.html"; }

    if (quantidade.length == 1) {
        document.getElementById('numero_carrinho').style.display = "none"
    } else {
        document.getElementById('numero_carrinho').style.display = "block";
        document.getElementById('numero_carrinho').innerHTML = `<small>${quantidade.reduce((partialSum, a) => partialSum + a, 0)}</small>`;
    }

    for (var i in array_produtos) {
        //console.log(array_produtos[i])
        if (i > 0) { appendProdutos(array_produtos[i], quantidade[i]); }
    }
}

const editarProdCarrinho = async (prod_id, operacao) => {
    if (operacao == 1) { // aumentar
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // User is signed in.
                uid = user.uid;

                const add_prod_carrinho = {
                    "id": uid,
                    "prod_id": prod_id
                }

                const config_add_prod_carrinho = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(add_prod_carrinho)
                }

                // Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/carrinho/${id}/${prod_id}`, config_add_prod_carrinho);
                //alert(uid, ' adicionado a ', prod_id);

            } else {
                // No user is signed in.
            }
        });
        document.location.reload(true);
    }

    if (operacao == 0) { // diminuir
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // User is signed in.
                uid = user.uid;

                const add_prod_carrinho = {
                    "id": uid,
                    "prod_id": prod_id
                }

                const config_add_prod_carrinho = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(add_prod_carrinho)
                }

                // Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/carrinho/remover/${id}/${prod_id}`, config_add_prod_carrinho);
                //alert(uid, ' adicionado a ', prod_id);

            } else {
                // No user is signed in.
            }
        });
        document.location.reload(true);
    }

    if (operacao == 2) { // remover
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // User is signed in.
                uid = user.uid;

                const add_prod_carrinho = {
                    "id": uid,
                    "prod_id": prod_id
                }

                const config_add_prod_carrinho = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(add_prod_carrinho)
                }

                // Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/carrinho/remover_tudo/${id}/${prod_id}`, config_add_prod_carrinho);
                //alert(uid, ' adicionado a ', prod_id);

            } else {
                // No user is signed in.
            }
        });
        document.location.reload(true);
    }
}

const appendProdutos = async (id_produto, quantidade) => {
    //console.log(id_produto);
    const response = await fetch(`http://localhost:3000/produtos/${id_produto}`);
    var produto = await response.json();

    //console.log(produto.imagem);

    const template = document.getElementById('produto-template');
    const prodElement = document.importNode(template.content, true);

    const prodItens = prodElement.querySelectorAll('p');
    prodItens[0].innerHTML += `<img class="img-thumbnail" src="${produto.imagem}">`;
    prodItens[1].innerText = produto.nome;
    prodItens[2].innerText = produto.descricao;
    prodItens[3].innerText += produto.valor;
    prodItens[4].innerHTML += `
    <div class="input-group">
                              <button onclick="editarProdCarrinho('${id_produto}', 0)" class="btn btn-outline-dark btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                  class="bi bi-caret-down" viewBox="0 0 16 16">
                                  <path
                                    d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
                                </svg>
                              </button>

                              <p class="form-control text-center" style="height: 35px; border: none">${quantidade}</p>

                              <button onclick="editarProdCarrinho('${id_produto}', 1)" class="btn btn-outline-dark btn-sm" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                  class="bi bi-caret-up" viewBox="0 0 16 16">
                                  <path
                                    d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z" />
                                </svg>
                              </button>

                              <button onclick="editarProdCarrinho('${id_produto}', 2)" class="btn btn-outline-danger border-dark btn-sm" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                  class="bi bi-trash" viewBox="0 0 16 16">
                                  <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                  <path fill-rule="evenodd"
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V 4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11 1h-11z" />
                                </svg>
                              </button>
                            </div>
    `

    document.getElementById('timeline').append(prodElement);

    valor_total += (produto.valor * quantidade)
    document.getElementById('valor-total').innerText = "Valor Total R$ " + valor_total
}

window.onload = () => {
    load_page()
}