var admin = require("./node_modules/firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

db = admin.firestore()

let Loja = class {

    constructor() {
        this.produtos = []
    }

    add_usuario(email, username, cpf, dt_nasc, telefone, cep, numero, complemento, referencia, uid) {
        db.collection('usuario').doc(uid).set({
            email: email,
            username: username,
            cpf: cpf,
            dt_nasc: dt_nasc,
            telefone: telefone,
            cep: cep,
            numero: numero,
            complemento: complemento,
            referencia: referencia
        });
        console.log('chegou na add_usuario');
    }

    criar_carrinho(uid) {
        db.collection('carrinho').doc(uid).set({
            lista_carrinho: ['default'],
            quantidades: [0]
        });
    }

    criar_cartoes(uid) {
        db.collection('cartoes').doc(uid).set({
            codigo: ["000"],
            nome: ["default nome"],
            numero: ["0000000000000000"],
            validade: ["01-01-1970"]
        });
    }

    criar_pedidos(uid) {
        db.collection('pedidos').doc(uid).set({
            cartao: ["0000000000000000"],
            data: ["01-01-1970"],
            id_pedido: ["000"],
            itens: ["default item"],
            valor: [0]
        });
    }

    async add_produto_carrinho(uid, id_produto) {

        var lista_carrinho = await this.retrieveCarrinho(uid);
        var quantidades = await this.retrieveQuantCarrinho(uid);

        var ja_adicionado = false;


        //console.log('quantidades: ', quantidades)

        for (var i in lista_carrinho) {
            if (lista_carrinho[i] == id_produto) {
                quantidades[i] += 1;
                ja_adicionado = true;
            }
        }

        if (ja_adicionado == false) {
            lista_carrinho.push(id_produto);
            quantidades.push(1);
        }

        //console.log('quantidades: ', quantidades)

        db.collection('carrinho').doc(uid).set({
            lista_carrinho: lista_carrinho,
            quantidades: quantidades
        });

        //console.log(id_produto + ' adicionado a ' + uid)
    }

    async remover_produto_carrinho(uid, id_produto) {

        var lista_carrinho = await this.retrieveCarrinho(uid);
        var quantidades = await this.retrieveQuantCarrinho(uid);

        for (var i in lista_carrinho) {
            if (lista_carrinho[i] == id_produto) {
                quantidades[i] -= 1;

                if (quantidades[i] == 0) {
                    lista_carrinho.splice(i, 1);
                    quantidades.splice(i, 1);
                }
            }
        }

        console.log('produtos: ', lista_carrinho);
        console.log('quantidades: ', quantidades);

        db.collection('carrinho').doc(uid).set({
            lista_carrinho: lista_carrinho,
            quantidades: quantidades
        });
    }

    async remover_todos_produto_carrinho(uid, id_produto) {

        var lista_carrinho = await this.retrieveCarrinho(uid);
        var quantidades = await this.retrieveQuantCarrinho(uid);

        for (var i in lista_carrinho) {
            if (lista_carrinho[i] == id_produto) {
                quantidades[i] = 0;

                if (quantidades[i] == 0) {
                    lista_carrinho.splice(i, 1);
                    quantidades.splice(i, 1);
                }
            }
        }

        console.log('produtos: ', lista_carrinho);
        console.log('quantidades: ', quantidades);

        db.collection('carrinho').doc(uid).set({
            lista_carrinho: lista_carrinho,
            quantidades: quantidades
        });
    }

    async zerar_carrinho(uid) {

        var lista_carrinho = ['default'];
        var quantidades = [0];

        db.collection('carrinho').doc(uid).set({
            lista_carrinho: lista_carrinho,
            quantidades: quantidades
        });
    }

    add_favoritos(uid) {
        db.collection('favoritos').doc(uid).set({
            produtos: ['default']
        });
    }

    async removerFavorito(uid, id_produto) {
        var produtos = await this.retrieveFavoritos(uid);

        for (var i in produtos) {
            if (produtos[i] == id_produto){
                produtos.splice(i,1);
            }
        }

        db.collection('favoritos').doc(uid).set({
            produtos: produtos
        });
    }

    async add_produto_favoritos(uid, id_produto) {

        var produtos = await this.retrieveFavoritos(uid)

        for (var i in produtos) {
            if (produtos[i] == id_produto) {
                return;
            }
        }

        produtos.push(id_produto)

        db.collection('favoritos').doc(uid).set({
            produtos: produtos
        });
    }

    async retrieveUsuarioId(id) {
        const userRef = db.collection('usuario').doc(id);
        const doc = await userRef.get();
        // console.log('id: ' + id_procurando);
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            return doc.data();
        }
    }

    async retrieveUsuario(email) {
        console.log('email: ' + email)
        const userRef = db.collection('usuario');
        const snapshot = await userRef.where('email', '==', email).get();

        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        var id_procurando

        snapshot.forEach(snap => {
            id_procurando = snap.id;
        });

        const userRef2 = db.collection('usuario').doc(id_procurando);
        const doc = await userRef2.get();
        // console.log('id: ' + id_procurando);
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            return doc.data();
        }
    }

    async retrieveCarrinho(id_procurando) {
        const prodsRef = db.collection('carrinho').doc(id_procurando);
        const doc = await prodsRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            var res = doc.data().lista_carrinho;
            return res;
        }
    }

    async retrieveQuantCarrinho(id_procurando) {
        const prodsRef = db.collection('carrinho').doc(id_procurando);
        const doc = await prodsRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            var res = doc.data().quantidades;
            return res;
        }
    }

    async retrieveValorCarrinho(id_procurando) {
        const prodsRef = db.collection('carrinho').doc(id_procurando);
        const doc = await prodsRef.get();

        var prods_carrinho = doc.data().lista_carrinho;
        var quantidades = doc.data().quantidades;
        quantidades.splice(0, 1);

        var valores = []
        var valor_total = 0

        for (var i in prods_carrinho) {
            if (i > 0) {
                const prodsRef2 = db.collection('produtos').doc(prods_carrinho[i]);
                const doc2 = await prodsRef2.get();

                valores.push(doc2.data().valor);
            }
        }

        for (var i in valores) {
            valor_total += valores[i] * quantidades[i];
        }


        return valor_total;
    }

    async retrieveProduto(id_procurando) {
        id_procurando = id_procurando.replace(/\s/g, '');
        const prodsRef = db.collection('produtos').doc(id_procurando);
        const doc = await prodsRef.get();
        //console.log(id_procurando);
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            return doc.data();
        }
    }

    async retrieveAllCartoes(uid) {
        const prodsRef = db.collection('cartoes').doc(uid);
        const doc = await prodsRef.get();

        if (!doc.exists) {
            console.log('No such document!');
        } else {
            //console.log(doc.data())
            return doc.data()
        }
    }

    async deleteCartao(uid, num) {
        const cardsRef = db.collection('cartoes').doc(uid);
        const doc = await cardsRef.get();

        var cartoes = doc.data()

        var nomes = cartoes.nome;
        var numeros = cartoes.numero;
        var validades = cartoes.validade;
        var codigos = cartoes.codigo;

        for (var i in nomes) {
            if (numeros[i] == num) {
                nomes.splice(i, 1);
                numeros.splice(i, 1);
                validades.splice(i, 1);
                codigos.splice(i, 1);
            }
        }

        db.collection('cartoes').doc(uid).set({
            nome: nomes,
            numero: numeros,
            validade: validades,
            codigo: codigos
        });
    }

    async add_cartao(uid, nome, numero, validade, codigo) {
        const prodsRef = db.collection('cartoes').doc(uid);
        const doc = await prodsRef.get();

        var numeros = doc.data().numero;
        var nomes = doc.data().nome;
        var validades = doc.data().validade;
        var codigos = doc.data().codigo;

        numeros.push(numero);
        nomes.push(nome);
        validades.push(validade);
        codigos.push(codigo)

        //console.log(numeros, nomes, validades, codigos)

        db.collection('cartoes').doc(uid).set({
            nome: nomes,
            numero: numeros,
            validade: validades,
            codigo: codigos
        });
    }

    async retrieveAllProdutos(uid) {
        const postsRef = db.collection('produtos').doc(uid);
        const snapshot = await postsRef.get();
        const produtos = [];
        snapshot.forEach(doc => {
            produtos.push(doc.data());
        });
        return produtos
    }

    async retrieveFavoritos(id_procurando) {
        const prodsRef = db.collection('favoritos').doc(id_procurando);
        const doc = await prodsRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            var res = doc.data().produtos;
            return res;
        }
    }

    async retrievePedidos(id_procurando) {
        const prodsRef = db.collection('pedidos').doc(id_procurando);
        const doc = await prodsRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            return doc.data();
        }
    }

    async addPedido(uid, data, id_pedido, itens, valor, cartao) {
        const prodsRef = db.collection('pedidos').doc(uid);
        const doc = await prodsRef.get();

        var id_pedido_novo = doc.data().id_pedido;
        var data_novo = doc.data().data;
        var itens_novo = doc.data().itens;
        var valor_novo = doc.data().valor;
        var cartao_novo = doc.data().cartao;

        id_pedido_novo.push(id_pedido);
        data_novo.push(data);
        itens_novo.push(itens);
        valor_novo.push(valor);
        cartao_novo.push(cartao);

        //console.log(id_pedido_novo, data_novo, itens_novo, valor_novo)

        db.collection('pedidos').doc(uid).set({
            id_pedido: id_pedido_novo,
            data: data_novo,
            itens: itens_novo,
            valor: valor_novo,
            cartao: cartao_novo
        });

        return
    }
}

module.exports = Loja