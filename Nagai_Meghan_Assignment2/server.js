//copied from Lab13 Ex4  and heavily adapted to display the invoice. Referenced Assignment 1 Example for inspiration, help from Professor Port
var data = require('./public/products_data.js');//loads the product.json
var products_array = data.products_array;//sets the products_array variables
var express = require('express');//enabling the usage of the express module
var app = express();//setting the express module as app
var myParser = require("body-parser");//loading and enabling the body parser module
var fs = require('fs');// references fs module to read the file path to invoice template
//const { response } = require('express');

const user_registration_info = 'user_registration_info.json';

//writes the request message
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
//telling to run the display_invoice function when data is posted assuming not undefined (copied from Lab 13)
app.post("/process_form", function (request, response) {
    //check if data is valid display invoice or don't respond
    //assme no error
    haserrors = false;
    //assume no quantities
    hasquantities= false;
    //check if no errors if error true, check if has quantities if there are, then true
    for (i in products_array) {
        qty = request.body[`quantity${i}`];
        if(qty>0) {
            hasquantities=true;
        }
        if (isNonNegInt(qty) == false) {
            haserrors = true;
        }
    }
    //if there are quantities and there are no error display the invoice if not then alert
    if (haserrors == false && hasquantities ==true) {
        display_invoice(request.body, response);
    } else{
        response_string="<script> alert('Error! please go back and put valid qunatities');window.history.go(-1);</script>";
        response.send(response_string);
    }
});


//computes the values needed to display the invoice
function display_invoice(POST, response) {
    if (typeof POST['submit_button'] != 'undefined') {

        invoice_rows = '';
        subtotal = 0;
        for (i in products_array) {
            qty = POST[`quantity${i}`];
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

        //Load template and send invoice
        var contents = fs.readFileSync('./views/invoice.template', 'utf8');//uses the invoice template which was adapted from invoice4
        response.send(eval('`' + contents + '`'));


    }
}
//copied from Lab13 Ex4
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(q=='') {q=0;}//Check if there is a blank. If there is, it is a zero
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

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./login_registration_style.css">
    <title>Registration Page</title>

</head>
<body>
<h1>Please Register an Account to Purchase Items</h1>

<div>
<h2>Please fill in this form to create an account.</h2>
<form action="process_register" method="POST">
<ul>
<li><label for="username"><b>Username</b></label></li><br>
<li><input type="text" name="username" size="40" placeholder="enter username" ></li><br>
<li><label for="password"><b>Password</b></label></li><br>
<li><input type="password" name="password" size="40" placeholder="enter password"></li><br>
<li><label for="psw-repeat"><b>Repeat Password</b></label></li><br>
<li><input type="password" name="repeat_password" size="40" placeholder="enter password again"></li><br>
<li><label for="email"><b>Email</b></label></li><br>
<li><input type="email" name="email" size="40" placeholder="enter email"></li><br>

</ul>
</form>
</div>

<input type="submit" value="Submit"
style="height:100px; width:300px; margin:auto 0; text-align: center; background-color: palevioletred; font-size: 35px;  font-weight: 700;"
name="submit_button">


<input type="submit" value="Register!" id="submit">
</body>
<div class="container signin">
<p>Already have an account? <a href="#">Sign in</a>.</p>
</div>
</body>
</html>
    `;
    response.send(str);
 });

 app.post("/process_register", function (request, response) {
    // process a simple register form
    //validate the reg info

    //if all data is valid write to the users_data_filename and send to invoice
    //add an example of new user info
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    //write updated object to user_registration_info
    reg_info_str = JSON.stringify(users_reg_data);
    fs.writeFileSync(user_registration_info, reg_info_str);
 });


app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./login_registration_style.css">
        <title>Login Page</title>
    </head>
    
    <body>
        <h1>Before continuing with your purchase, please login!</h1>
        <div>
        <form action="process_login" method="POST">
           <h2>Please enter your username and password in the boxes below</h2> 
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" id="username" required>
            <br>
            <br>
            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" id="psw" required>
            <input type="submit" value="Submit" id="submit">
        </form>
        <h3>Don't have account? Please click the button below to register!</h3>
    </div>
    </body>
    
    </html>
    `;
    response.send(str);
});

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);

    //if username exists, get password
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (request.body.password == users_reg_data[request.body.username].password) {
            response.send(`Thank you ${request.body.username} for logging in!`);
        } else {
            response.send(`Hey! ${request.body.password} does not match the password we have for you!`);

        }
    } else { response.send(`Hey! ${request.body.username} does not exist!`) }

});


app.use(express.static('./public')); //references the public folder where the products is displayed
app.listen(8080, () => console.log('listening on port 8080')); //checks that server is running 