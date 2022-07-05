async function load_page() {
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
