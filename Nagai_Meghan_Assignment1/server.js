//copied from Lab13 and heavily adapted. Looked at the Assignemnt1 Example
var data = require('./products.json');//loads the product.json
var products = data.products;//sets the products_array variables
var express = require('express');//enabling the usage of the express module
var app = express();//setting the express module as app
var myParser = require("body-parser");//loading and enabling the body parser module
var fs = require('fs');// references fs module to read the file path to invoice template


//writes the request message
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
//telling to run the display_invoice function when data is posted assuming not undefines
app.post("/process_form", function (request, response, next) {
    let POST = request.body;
    if(typeof POST['submit_button'] != 'undefined') {
        display_invoice(request.body, response);
    } 
    var contents = fs.readFileSync('./views/invoice.template', 'utf8');//uses the invoice template which was adapted from invoice4
    response.send(eval('`' + contents + '`')); // render template string

    //computes the values needed to display the invoice
    function display_invoice() {
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            qty = 0; //set starting quantity to 0
            if(typeof POST[`quantity${i}`] != 'undefined') {
                qty = POST[`quantity${i}`];
            } //sets the quantity amount for each product
            if (qty > 0) {
                // displays the product row copites from WOD Invoice4 invoice.html
                extended_price =qty * products[i].price
                subtotal += extended_price;
                str += (`
                <tr>
                <td width="43%">${products[i].brand} ${products[i].product_name}</td>
                <td align="center" width="11%">${qty}</td>
                <td width="13%">\$${products[i].price}</td>
                <td width="54%">\$${extended_price}</td>
              </tr>
      `);
            }
        }
        // Compute tax
        //From WOD Invoice4 Invoice.html 
        tax_rate = 0.0575;
        sales_tax = tax_rate * subtotal;

        // Compute shipping
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

        // Compute grand total
        //From WOD Invoice4  Invoice.html
        total = subtotal + sales_tax + shipping_cost;
        
        return str;
    }

});


function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); //references the public folder where the products is displayed
app.listen(8080, () => console.log('listening on port 8080')); //checks that server is running 