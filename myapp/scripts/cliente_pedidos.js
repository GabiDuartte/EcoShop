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
    //firebase.initializeApp(firebaseConfig);
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

            if (quantidade.length == 1) {
                document.getElementById('numero_carrinho').style.display = "none"
            } else {
                document.getElementById('numero_carrinho').style.display = "block";
                document.getElementById('numero_carrinho').innerHTML = `<small>${quantidade.reduce((partialSum, a) => partialSum + a, 0)}</small>`;
            }

            const response2 = await fetch(`http://localhost:3000/pedidos/${id}`);
            var pedidos = await response2.json();

            document.getElementById('lista-pedidos').innerHTML = ""

            for (var i in pedidos.cartao) {
                if (i > 0) {
                    var id_pedido = pedidos.id_pedido[i];
                    var valor = pedidos.valor[i];
                    var data = pedidos.data[i];
                    var cartao = pedidos.cartao[i];
                    document.getElementById('lista-pedidos').innerHTML += `
                <button onclick=" " class="list-group-item list-group-item-action">

                  <b>Código do pedido:</b> <p style="color: green"><b>${id_pedido}</b></p> 
                  <b>Data:</b> <p style="color: green"><b>${data}</b></p>
                  <b>Cartão:</b> <p style="color: green"><b>${cartao}</b></p>
                  <b>Valor:</b> <p style="color: green"><b>${valor}</b></p>

                </button>
                <br>
                `}
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

    var log = document.getElementById('select-pedidos');
    log.addEventListener('click', load_page);
}