//copied from Lab13 Ex4  and heavily adapted to display the invoice. Referenced Assignment 1 Example for inspiration, help from Professor Port
var data = require('./public/products_data.js');//loads the product.json
var products_array = data.products_array;//sets the products_array variables
var express = require('express');//enabling the usage of the express module
var app = express();//setting the express module as app
var myParser = require("body-parser");//loading and enabling the body parser module
var fs = require('fs');// references fs module to read the file path to invoice template
var quantity_data;//create a universal variable (from Assignment2 Workshop! thank you to jojo for asking the question)
const user_registration_info = 'user_registration_info.json';//store user_registration_info.json as a variable

//writes the request message
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
//telling to run the display_invoice function when data is posted assuming not undefined (copied from Lab 13)

//processing the products the user wants to purchase
app.post("/process_form", function (request, response) {
    //check if data is valid display invoice or don't respond
    let POST = request.body;
    //assme no error
    haserrors = false;
    //assume no quantities
    hasquantities = false;
    //check if no errors if error true, check if has quantities if there are, then true
    for (i in products_array) {
        qty = request.body[`quantity${i}`];
        if (qty > 0) {
            hasquantities = true;
        }
        if (isNonNegInt(qty) == false) {
            haserrors = true;
        }
    }

    //if there are quantities and there are no error display the invoice if not then alert
    if (haserrors == false && hasquantities == true) {//if there are no errors
        //set the quantity data variable to POST
        quantity_data = POST;
        //load login page
        var contents = fs.readFileSync('./views/login_page.template', 'utf8');//uses the login page
        response.send(eval('`' + contents + '`'));

    } else {//if there are errors then show error
        response_string = "<script> alert('Error! One or more of your values are invalid! Please go back and put valid qunatities');window.history.go(-1);</script>";
        response.send(response_string);
    }
});


//computes the values needed to display the invoice
function display_invoice(POST, response) {
    if (typeof POST['submit_button'] != 'undefined') {

        invoice_rows = '';
        subtotal = 0;
        for (i in products_array) {
            qty = quantity_data[`quantity${i}`];
            //sets the quantity amount for each product
            if (qty > 0) {
                // displays the product rows of items ordered. Copied from WOD Invoice4 invoice.html
                extended_price = qty * products_array[i].price
                subtotal = subtotal + extended_price;
                invoice_rows += (`
                <tr>
                <td style="text-align: left;">${products_array[i].brand} ${products_array[i].product_name}</td>
                <td align="center">${qty}</td>
                <td style="text-align: center">\$${products_array[i].price}</td>
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


//copied and adapted from Lab14 Ex4.js


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

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(quantity_data);
    var POST = request.body;

    //if username exists, get password
    if (typeof users_reg_data[request.body.username] != 'undefined') {//if user inputted data
        if (request.body.password == users_reg_data[request.body.username].password) {//if password and username is correct
            //response.send(`Thank you ${request.body.username} for logging in!`);
            //Load template and send invoice
            quantity_data = POST;
            display_invoice(POST, response);
        } else {
            //response.send(`Hey! ${request.body.password} does not match the password we have for you!`)       
            incorrect_password = "<script> alert('password input does not match the password we have for you! Please try again!');window.history.go(-1);</script>";
            response.send(incorrect_password);


        }
    } else {
        incorrect_username = "<script> alert('Username does not exist! Please check your username');window.history.go(-1);</script>";
        response.send(incorrect_username)
    }

});
// Display login page from the registration
app.get("/login", function (request, response) {
    var contents = fs.readFileSync('./views/login_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

// Display registration page from the login
app.get("/register", function (request, response) {
    var contents = fs.readFileSync('./views/registration_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

app.post("/process_register", function (request, response) {
    // process a simple register form
    var registration_errs = [];
    //validate the reg info

    //Validating Full Name
    if (request.body.name == "") { //check if Full Name is empty
        registration_errs.push('Please enter your full name');//show error
    }
    //make sure that full name has no more than 30 characters
    if ((request.body.fullname.length > 30)) { //set maximum characters to be 30
        errors.push('max fullname characters is 30');
    }
    //check is all letters: https://stackoverflow.com/questions/11431154/regular-expression-for-username-start-with-letter-and-end-with-letter-or-number
    if (/^[A-Za-z]+$/.test(request.body.fullname) == false) { //if there are only letters and numbers, do nothing
        registration_errs.push('Full name can only be letters');
    }
    //Validating User Name
    var reg_username = request.body.username.toLowerCase();//make registered username lowercase
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        registration_errs.push('This username is not available. Choose another');
    }
    // check for numbers& letters from: https://stackoverflow.com/questions/11431154/regular-expression-for-username-start-with-letter-and-end-with-letter-or-number
    if ((/^[0-9a-zA-Z]+$/).test(request.body.username) == false) {
        registration_errs.push('Username must be numbers or letters. Please go back and change your username');
    }
    if (request.body.username.length < 4 || request.body.username.length > 10) {
        registration_errs.push('Username can must be between 4 or 10 characters long. Please go back and change your username');
    }

    //Validating Password
    if ((request.body.password.length < 6)) { //if password length is less than 6 characters
        registration_errs.push('Password must be more than 6 characters long'); //push to registration errors
    }
    //check if password entered equals to the repeat password entered
    if (request.body.password !== request.body.repeat_password) { // if password equals confirm password
        registration_errs.push('Password does not match! Please re-enter correct password'); //push error to array
    }

    //Validating email
    var registration_email = request.body.email.toLowerCase(); //make email case insensitive
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registration_email) == false) {
        //if email doesn't follow above criteria
        registration_errs.push('Email is invalid'); //push to errors array
    }

    if (registration_errs.length == 0) {
        //if all data is valid write to the users_data_filename and send to invoice
        //add an example of new user info
        username = request.body.username;
        users_reg_data[username] = {};
        users_reg_data[username].fullname = request.body.fullname;
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        console.log(`saved`)

    } else {
        console.log(registration_errs);
        reg_error = "<script> alert(`ERROR! Can not register. Please chack your registration form`);window.history.go(-1);</script>";
        response.send(reg_error);
    }

})




app.use(express.static('./public')); //references the public folder where the products is displayed
app.listen(8080, () => console.log('listening on port 8080')); //checks that server is running 