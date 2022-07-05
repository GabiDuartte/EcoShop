const add_prod_carrinho = (prod_id) => {
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

async function remover_favorito(id_produto) {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;

            const remover_favorito = {
                "uid": uid,
                "id_produto": id_produto
            }

            const config_remover_favorito = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(remover_favorito)
            }

            let confirmar_remover = confirm("Remover o produto dos favoritos?");

            if (confirmar_remover == true) {// Push na Firebase Firestore
                let response = await fetch(`http://localhost:3000/favoritos/remover/${uid}/${id_produto}`, config_remover_favorito);
                //alert(uid, ' adicionado a ', prod_id);

                document.location.reload(true);
            } else { return }

        } else {
            // No user is signed in.
        }
    });
}

async function load_page() {
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

            if (quantidade.length == 1) {
                document.getElementById('numero_carrinho').style.display = "none"
            } else {
                document.getElementById('numero_carrinho').style.display = "block";
                document.getElementById('numero_carrinho').innerHTML = `<small>${quantidade.reduce((partialSum, a) => partialSum + a, 0)}</small>`;
            }

            const response2 = await fetch(`http://localhost:3000/favoritos/${id}`);
            var favoritos_ids = await response2.json();

            for (var i in favoritos_ids) {
                if (i > 0) {
                    const response3 = await fetch(`http://localhost:3000/produtos/${favoritos_ids[i]}`);
                    var favoritos_produtos = await response3.json();

                    document.getElementById("produto_favorito").innerHTML +=
                        `    
                <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                  <button onclick="remover_favorito('${favoritos_ids[i]}')" class="end-0 p-2 text-danger" style="border:none; background-color: Transparent;" title="Remover dos favoritos">
                    <i class="bi-x" style="font-size: 24px; line-height: 24px;"></i>
                  </button>
                  <img src=${favoritos_produtos.imagem}
                    class="card-img-top">
                  <div class="card-header">
                   
                  </div>
                  <div class="card-body">
                    <h5 class="card-title"> ${favoritos_produtos.nome}</h5>
                    <p class="card-text truncar-3l">
                    ${favoritos_produtos.descricao}
                    </p>
                  </div>
                  <div class="card-footer">
                  <button onclick="add_prod_carrinho('${favoritos_ids[i]}')" class="btn btn-success mt-2 d-block">Adicionar ao Carrinho</button>
                    <small class="text-success"> ${favoritos_produtos.quantidade} em estoque</small>
                  </div>
                </div>   
        `
                }
            }
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
}