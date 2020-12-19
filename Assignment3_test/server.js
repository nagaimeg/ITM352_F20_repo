//Author: Meghan Nagai
//Referenced from Lab13 Ex4 and Lab14 Ex 4 Lab 15
//Copied from Assignment 1 and 2 
//Code was heavily adapted to use multiple pages, sessions and cookies
//Reference: 

var data = require('./public/products_data.js');//loads the product data
var allProducts = data.allProducts; //set variable 'allProducts' to the products_data.js file
const queryString = require('query-string'); // so it'll load querystring
var express = require('express');//enabling the usage of the express module
var app = express();//setting the express module as app
var myParser = require("body-parser");//loading and enabling the body parser module
var fs = require('fs');// references fs module to read the file path to invoice template
var quantity_data;//create a universal variable (from Assignment2 Workshop! thank you to jojo for asking the question)
const user_registration_info = 'user_registration_info.json';//store user_registration_info.json as a variable
const nodemailer = require('nodemailer');//load nodemailer

//Lab 15
//load cookie
var cookieParser = require('cookie-parser'); // assigns cookieParser variable to require cookie-parser 
app.use(cookieParser());

//load session
var session = require('express-session'); // assigns session variable to require express-session 
app.use(session({ secret: "ITM352 rocks!" }));


//writes the request message
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
//telling to run the functions when data is posted assuming not undefined (copied from Lab 13)

//processing the products the user wants to purchase
app.post("/display_cart", function (request, response) { // posts data from the display_cart form, with action named "display_cart"
    if (typeof session.username != "undefined") {
        response.redirect('invoice.html'); //changed
    } else {
        response.redirect('loginPage.html'); //changed

    }
});

app.post("/process_form", function (request, response) {
    let POST = request.body;

    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is not undefined
        var validAmount = true; // creates variable 'validAmount' and assumes it will be true
        var amount = false; // create variable 'amount' and assuming it will be false

        for (i = 0; i < `${(products_array[`jewelry`][i])}`.length; i++) { //for all products check if the input
            qty = POST[`quantity${i}`]; 

            if (qty > 0) {
                amount = true; // is there an amount?
            }

            if (isNonNegInt(qty) == false) { //if it is not a nonnegative integer
                validAmount = false; //show that it is not a valid quantity
            }

        }

        const stringified = queryString.stringify(POST); //converts the data in POST to a JSON string and sets it to variable 'stringified'

        if (validAmount && amount) { //if it is both a quantity over 0 and is valid
            var contents = fs.readFileSync('./views/login_page.template', 'utf8');
            response.send(eval('`' + contents + '`' + stringified));// redirect the page to the login page
            return; //stops function
        }

        else { response_string = "<script> alert('Error! One or more of your values are invalid! Please go back and put valid qunatities');window.history.go(-1);</script>";
        response.send(response_string);}

    }

});



//computes the values needed to display the invoice
function display_invoice(POST, response) {
    invoice_rows = '';
    subtotal = 0;
    for (i in all_products) {
        qty = quantity_data[`quantity${i}`];
        //sets the quantity amount for each product
        if (qty > 0) {
            // displays the product rows of items ordered. Copied from WOD Invoice4 invoice.html
            extended_price = qty * all_products[i].price
            subtotal = subtotal + extended_price;
            invoice_rows += (`
                <tr>
                <td style="text-align: left;">${all_products[i].brand} ${all_products[i].product_name}</td>
                <td align="center">${qty}</td>
                <td style="text-align: center">\$${all_products[i].price}</td>
                <td style="text-align: right;">\$${extended_price.toFixed(2)}</td>
              </tr>
      `);
        }
    }

    // Tax
    //From WOD Invoice4 Invoice.html 
    tax_rate = 0.0575;
    sales_tax = tax_rate * subtotal;

    // Shipping Costs
    //From WOD Invoice4  Invoice.html
    if (subtotal <= 50) {
        shipping_cost = 2;
    }
    else if (subtotal <= 100) {
        shipping_cost = 5;
    }
    else {
        shipping_cost = 0.05 * subtotal; // 5% of subtotal
    }

    // Total Amount
    //From WOD Invoice4  Invoice.html
    total = subtotal + sales_tax + shipping_cost;
    var invoice = fs.readFileSync('./views/invoice.template', 'utf8');//uses the invoice template which was adapted from invoice4
    response.send(eval('`' + invoice + '`'));

}
//copied from Lab13 Ex4
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') { q = 0; }//Check if there is a blank. If there is, it is a zero
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}



/*Login and Registration 
copied and adapted from Lab14 Ex4.js*/

//check if file exists before reading it
if (fs.existsSync(user_registration_info)) {

    stats = fs.statSync(user_registration_info);
    console.log(`user_data.json has ${stats['size']} characters`);

    var data = fs.readFileSync(user_registration_info, 'utf-8');
    users_reg_data = JSON.parse(data);


} else {
    console.log(`ERR: ${user_registration_info} does not exist`)
}

app.use(myParser.urlencoded({ extended: true }));

// Display login page from the registration
// Display login page from the registration
app.get("/login", function (request, response) {
    //assume no errors before loading
    var incorrect_login = [];
    var incorrect_password = [];
    var incorrect_username = [];
    var contents = fs.readFileSync('./views/login_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

//proecess the login form
app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    var POST = request.body;
    //assume no errors at first
    var incorrect_login = [];
    var incorrect_password = [];
    var incorrect_username = [];
    //make the inputted username lowercase
    var username_lowercase = request.body.username.toLowerCase();
    //if username exists, get password
    if (typeof users_reg_data[username_lowercase] != 'undefined') {//if user inputted data

        console.log(request.body.password)
        console.log(request.body.username)

        if (request.body.password == users_reg_data[username_lowercase].password) {
            //if password and username is correct display the invoice

            //create cookie for username
            response.cookie('username', `${request.body.username}`, { maxAge: 6000 * 1000 })
            var user = users_reg_data[request.body.username];
            console.log(user.email)
            //create cookie for email
            response.cookie('email', `${user.email}`)

            //redirect to cart
            response.redirect('./cart.html?');
        } else {
            //if the password is not correct display that password is not correct
            incorrect_password.push('password input does not match the password we have for you! Please try again!');
            //alert user that the login could not go through and redirect to login page
            incorrect_login = "alert(`ERROR! Can not login. Please check your login`);";
            var contents = fs.readFileSync('./views/login_page.template', 'utf8');
            response.send(eval('`' + contents + '`'));
            console.log('password was incorrect');

        }
    } else {
        //if the username is not correct display that the username does not match 
        incorrect_username.push('Username does not exist! Please check your username');
        //alert user that the login did not go through
        incorrect_login = "alert(`ERROR! Can not login. Please check your login`);";
        var contents = fs.readFileSync('./views/login_page.template', 'utf8');
        response.send(eval('`' + contents + '`'));
        console.log('username was incorrect');
    }

});

//log user out
app.get("/logout", function (request, response) {
    var username = request.cookies.username;
    response.clearCookie('username');
    response.send(`logged out ${username}`);
});


// Display registration page from the login
app.get("/register", function (request, response) {
    //assume no errors at first
    var fullname_registration_errs = [];
    var username_registration_errs = [];
    var password_registration_errs = [];
    var password_repeat_errs = [];
    var email_registration_errs = [];
    var reg_error = "";
    var contents = fs.readFileSync('./views/registration_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

//process registration
app.post("/process_register", function (request, response) {
    // process a simple register form
    var fullname_registration_errs = [];
    var username_registration_errs = [];
    var password_registration_errs = [];
    var password_repeat_errs = [];
    var email_registration_errs = [];

    //Validate the registration info
    //Validating Full Name
    function validate_fullname(name_input) {
        //if no value in the name input
        if (name_input == "") {
            //push error that full name was not inputted
            fullname_registration_errs.push('Please enter your full name');
        }
        //if full name has more than 30 characters
        if ((name_input.length > 30)) {
            //push an error that the full name needs to be under 30 characters
            fullname_registration_errs.push('max fullname characters is 30');
        }
        //if the full name was not all letters: https://stackoverflow.com/questions/9289451/regular-expression-for-alphabets-with-spaces
        if (/^[A-Za-z ]+$/.test(name_input) == false) {
            //push an error that the full name needs to all letters
            fullname_registration_errs.push('Full name can only be letters');
        }
    }
    //Checking if a valid name was inputted
    validate_fullname(request.body.fullname);

    //Validating User Name
    function validate_username(username_input) {
        //if the username already exists
        if (typeof users_reg_data[username_input] != 'undefined') {
            //push error that username is not available
            username_registration_errs.push('This username is not available. Choose another');
        }
        //if username is not letters or numbers modified from: https://stackoverflow.com/questions/11431154/regular-expression-for-username-start-with-letter-and-end-with-letter-or-number
        if ((/^[0-9a-zA-Z]+$/).test(username_input) == false) {
            //push error that username must be numbers or letters
            username_registration_errs.push('Username must be numbers or letters');
        }
        //if user name is not between 4 and 10 characters
        if (username_input.length < 4 || username_input.length > 10) {
            //push error that username must be netween 4 and 10 characters
            username_registration_errs.push('Username must be between 4 or 10 characters long');
        }
    }
    //Checking if a valid username was inputted
    var reg_username = request.body.username.toLowerCase();//make username lowercase
    validate_username(reg_username);



    //Validating Password
    function validate_password(password_input) {
        password_repeat = request.body.repeat_password
        //if password length is less than 6 characters
        if ((password_input.length < 6)) {
            //push password must be mroe than 6 characters
            password_registration_errs.push('Password must be more than 6 characters long');
        }
        //check if password entered equals to the repeat password entered
        if (password_input !== password_repeat) {
            //push error that passwords do not match
            password_repeat_errs.push('Password does not match! Please re-enter correct password');
        }
    }
    //Checking if a valid password was inputted
    validate_password(request.body.password);


    //Validating email modified from https://www.tutorialspoint.com/validate-email-address-in-java
    function validate_email(email_input) {
        //if email doesn't follow a
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_input) == false) {
            //push error that email is invalid
            email_registration_errs.push('Email is invalid');
        }
    }
    //Checking if valid email was inputted
    var registration_email = request.body.email.toLowerCase(); //make email lowercase
    validate_email(registration_email);

    //if all data is valid write to the users_data_filename and send to invoice
    if ((fullname_registration_errs.length == 0) && (username_registration_errs.length == 0) && (password_registration_errs.length == 0) && (password_repeat_errs.length == 0) && (email_registration_errs.length == 0)) {

        //format entered data so it can be added to user_registration_info.json
        users_reg_data[reg_username] = {};
        users_reg_data[reg_username].fullname = request.body.fullname;
        users_reg_data[reg_username].password = request.body.password;
        users_reg_data[reg_username].email = request.body.email.toLowerCase();

        //write updated object to user_registration_info
        reg_info_str = JSON.stringify(users_reg_data);
        fs.writeFileSync(user_registration_info, reg_info_str);
        console.log(`saved`)
        
        response.cookie('username', `${request.body.username}`, { maxAge: 6000 * 1000 }).

        response.cookie('email', `${users_reg_data[reg_username].email}`)
        response.redirect('./cart.html?');

    } else {
        //if user data is not valid, alert user and display errors in the console
        console.log(fullname_registration_errs);
        console.log(username_registration_errs);
        console.log(password_registration_errs);
        console.log(password_repeat_errs);
        console.log(email_registration_errs);
        reg_error = "alert(`ERROR! Can not register. Please check your registration form`);";
        var contents = fs.readFileSync('./views/registration_page.template', 'utf8');
        response.send(eval('`' + contents + '`'));
    }

})


app.use(express.static('./public')); //references the public folder where the products is displayed
app.listen(8080, () => console.log('listening on port 8080')); //checks that server is running 