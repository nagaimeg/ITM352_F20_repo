function isNonNegInt(q) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    
    return (errors.length == 0);
}

attributes  =  "Meghan;18;18.5;-17.5" ;
pieces = attributes.split(';');

for(i in pieces) {
    console.log(`${pieces} is non neg int ${isNonNegInt(pieces[i])}`);

}
console.log(isNonNegInt('5.00'));