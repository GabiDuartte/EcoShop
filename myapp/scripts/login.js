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

// Set up our login function
function login() {
    // Get all our input fields
    var email = document.getElementById('txtEmail').value
    var password = document.getElementById('txtSenha').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Outta Line!!')
        return
        // Don't continue running the code
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            var user = auth.currentUser;
            //console.log(user)
            //alert('buyin time');
            // Add this user to Firebase Database
            var database_ref = database.ref()

            // Create User data
            var user_data = {
                last_login: Date.now()
            }

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).update(user_data)

            // DOne
            alert('Usuário logado!!');
            window.location.href = 'index.html';
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })    
}

// Validate Functions
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
    var addNovoPost = document.getElementById('botao-login');
    addNovoPost.addEventListener('click', login);
}
