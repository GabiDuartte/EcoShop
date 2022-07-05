
var admin = require("./node_modules/firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecolshop-972a6-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

db.collection("produtos").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().descricao);
    });
});

db.collection("carrinho").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
});