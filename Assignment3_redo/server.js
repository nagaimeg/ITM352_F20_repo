var express = require('express');
var app = express();
var myParser = require("body-parser");
var session = require('express-session');
var products_data = require('./products.json');
var fs = require('fs');// references fs module to read the file path to invoice template
const user_registration_info = 'user_registration_info.json';//store user_registration_info.json as a variable
var cookieParser = require('cookie-parser');


app.use(myParser.urlencoded({ extended: true }));
app.use(session({ secret: "ITM352 rocks!" }));

app.all('*', function (request, response, next) {
  // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
  // anytime it's used
  if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
  next();
});

app.get("/get_products_data", function (request, response) {
  response.json(products_data);
});

app.get("/add_to_cart", function (request, response) {
  var products_key = request.query['products_key']; // get the product key sent from the form post
  var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
  request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
  response.redirect('./cart.html');
});

app.get("/get_cart", function (request, response) {
  response.json(request.session.cart);
});

app.get("/checkout", function (request, response) {
  // Generate HTML invoice string
  var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
  var shopping_cart = request.session.cart;
  for (product_key in products_data) {
    for (i = 0; i < products_data[product_key].length; i++) {
      if (typeof shopping_cart[product_key] == 'undefined') continue;
      qty = shopping_cart[product_key][i];
      if (qty > 0) {
        invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
      }
    }
  }
  invoice_str += '</table>';
  // Set up mail server. Only will work on UH Network due to security restrictions
  var transporter = nodemailer.createTransport({
    host: "mail.hawaii.edu",
    port: 25,
    secure: false, // use TLS
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  var user_email = 'phoney@mt2015.com';
  var mailOptions = {
    from: 'phoney_store@bogus.com',
    to: user_email,
    subject: 'Your phoney invoice',
    html: invoice_str
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      invoice_str += '<br>There was an error and your invoice could not be emailed :(';
    } else {
      invoice_str += `<br>Your invoice was mailed to ${user_email}`;
    }
    response.send(invoice_str);
  });

});
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
      if (request.body.password == users_reg_data[username_lowercase].password) {
          //if password and username is correct display the invoice
          response.cookie('username', 'Meghan', { maxAge: 6000 * 1000 }).redirect('./cart.html?');
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
  response.clearCookie('username')
  response.redirect('./index.html');
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
     response.send(`registered!`);

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



app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
