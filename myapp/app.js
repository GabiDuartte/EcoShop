const express = require('express')
const app = express()
const Loja = require('./classe.js')
const { response } = require('express');
const { request: req } = require('express');
const res = require('express/lib/response');
const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const port = 3000
let lj = new Loja()

app.listen(port, () => {
    console.log(`Aplicação escutando na porta ${port}`)
})

app.get('/produtos', async (req, res) => {
    mensagem = await lj.retrieveAllProdutos()
    res.json(mensagem)
});

app.get('/pedidos/:uid', async (req, res) => {
    uid = req.params.uid
    mensagem = await lj.retrievePedidos(uid)
    res.json(mensagem)
});

app.get('/favoritos/:uid', async (req, res) => {
    uid = req.params.uid
    mensagem = await lj.retrieveFavoritos(uid)
    res.json(mensagem)
});

app.get('/produtos/:id', async (req, res) => {
    id = req.params.id
    mensagem = await lj.retrieveProduto(id)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/cartoes/:uid', async (req, res) => {
    uid = req.params.uid
    num = req.params.num
    mensagem = await lj.retrieveAllCartoes(uid)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/carrinho/:id', async (req, res) => {
    id = req.params.id
    mensagem = await lj.retrieveCarrinho(id)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/carrinho/quantidade/:id', async (req, res) => {
    id = req.params.id
    mensagem = await lj.retrieveQuantCarrinho(id)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/carrinho/valor/:id', async (req, res) => {
    id = req.params.id
    mensagem = await lj.retrieveValorCarrinho(id)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/usuario/:email', async (req, res) => {
    email = req.params.email;
    mensagem = await lj.retrieveUsuario(email);
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.get('/usuario/1/:id', async (req, res) => {
    id = req.params.id;
    mensagem = await lj.retrieveUsuarioId(id);
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.post('/usuario', async (req, res) => {
    var user = {
        "email": req.body.email,
        "username": req.body.username,
        "cpf": req.body.cpf,
        "dt_nasc": req.body.dt_nasc,
        "tel": req.body.tel,
        "cep": req.body.cep,
        "numero": req.body.numero,
        "complemento": req.body.complemento,
        "referencia": req.body.referencia,
        "id": req.body.id
    }
    lj.add_usuario(user['email'], user['username'], user['cpf'], user['dt_nasc'], user['tel'],
        user['cep'], user['numero'], user['complemento'], user['referencia'], user['id']);
    res.status(201).send('Usuario cadastrado.');

    console.log('fez o app.post')
});

app.post('/pedidos', async (req, res) => {
    var user = {
        "id": req.body.id
    }
    lj.criar_pedidos(user['id']);
    res.status(201).send('Pedidos cadastrado.');
});

app.post('/cartoes', async (req, res) => {
    var user = {
        "id": req.body.id
    }
    lj.criar_cartoes(user['id']);
    res.status(201).send('Cartoes cadastrado.');
});

app.post('/carrinho', async (req, res) => {
    var user = {
        "id": req.body.id
    }
    lj.criar_carrinho(user['id']);
    res.status(201).send('Carrinho cadastrado.');
});

app.post('/cartoes/:uid', async (req, res) => {
    var card = {
        "uid": req.body.uid,
        "nome": req.body.nome,
        "numero": req.body.numero,
        "validade": req.body.validade,
        "codigo": req.body.codigo
    }
    lj.add_cartao(card['uid'], card['nome'], card['numero'], card['validade'], card['codigo']);
    res.status(201).send('Carrinho cadastrado.');
});

app.post('/carrinho/:uid/:id_produto', async (req, res) => {
    var uid = req.params.uid
    var id_produto = req.params.id_produto

    lj.add_produto_carrinho(uid, id_produto);
    res.status(201).send('Produto cadastrado no carrinho');
});

app.post('/carrinho/remover/:uid/:id_produto', async (req, res) => {
    var uid = req.params.uid
    var id_produto = req.params.id_produto

    lj.remover_produto_carrinho(uid, id_produto);
    res.status(201).send('Produto cadastrado no carrinho');
});

app.post('/carrinho/remover_tudo/:uid/:id_produto', async (req, res) => {
    var uid = req.params.uid
    var id_produto = req.params.id_produto

    lj.remover_todos_produto_carrinho(uid, id_produto);
    res.status(201).send('Produto cadastrado no carrinho');
});

app.post('/carrinho/remover_tudo_tudo/1/:uid', async (req, res) => {
    var uid = req.params.uid;

    lj.zerar_carrinho(uid);
    res.status(201).send('Carrinho zerado');
});

app.post('/favoritos/remover/:uid/:id_produto', async (req, res) => {
    var uid = req.params.uid
    var id_produto = req.params.id_produto

    lj.removerFavorito(uid, id_produto);
    res.status(201).send('Produto removido dos favoritos');
});

app.post('/favoritos', async (req, res) => {
    var user = {
        "id": req.body.id
    }
    lj.add_favoritos(user['id']);
    res.status(201).send('Favoritos cadastrado.');
});

app.post('/favoritos/:uid/:id_produto', async (req, res) => {
    var uid = req.params.uid
    var id_produto = req.params.id_produto

    lj.add_produto_favoritos(uid, id_produto);
    res.status(201).send('Produto cadastrado nos favoritos');
});

app.post('/cartoes/remover/:uid/:num', async (req, res) => {
    uid = req.params.uid
    num = req.params.num
    mensagem = await lj.deleteCartao(uid, num)
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});

app.post('/pedidos/:uid', async (req, res) => {
    uid = req.params.uid

    var pedido = {
        "data": req.body.data,
        "id_pedido": req.body.id_pedido,
        "itens": req.body.itens,
        "valor": req.body.valor,
        "cartao": req.body.cartao
    }

    mensagem = await lj.addPedido(uid, pedido["data"], pedido["id_pedido"], pedido["itens"], pedido["valor"], pedido["cartao"]);
    if (mensagem == -1) { res.status(404).send('Não encontrado'); }
    res.json(mensagem)
});