function isNonNegIntString(string_to_check, returnErrors=false) {
    /*this function returns ture if string_to_check is a non-negative integer.If returnErrors=true it will return the array of reaons it is non-negative integer
    errors = []; // assume no errors at first
    */
    if (Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    
    return returnErrors ? errors : (errors.length == 0);
}

attributes  =  "Meghan;18;18.5;-17.5" ;
pieces = attributes.split(';');

for(i in pieces) {
    console.log(`${pieces[i]} is non neg int ${isNonNegIntString(pieces[i], true).join("***")}`);

}
console.log(isNonNegIntString('5.00'));