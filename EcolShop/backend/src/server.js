import express from 'express';

const app = express();

const PORT = process.env.PORT || '3000';

app.get('/', (request, response) => {
    response.json('Minha primeira rota');
});

app.listen(PORT, () => {
    console.log(`app sendo executado na porta: http://localhost:${PORT}`);
});
