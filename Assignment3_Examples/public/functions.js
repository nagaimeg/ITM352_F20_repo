// This function asks the server for a "service" and converts the response to text. 
function loadJSON(service, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

// This function makes a navigation bar from a products_data object

function nav_bar(this_product_key, products_data) {
    // This makes a navigation bar to other product pages
    for (let products_key in products_data) {
        if (products_key == this_product_key) continue;
        document.write(`<a href='./display_products.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;`);
    }
}

function checkQuantityTextbox(theTextbox) {
    errs = isNonNegInt(theTextbox.value, true);
    document.getElementById(theTextbox.name + '_message').innerHTML = errs.join(", ");
  }

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
  }