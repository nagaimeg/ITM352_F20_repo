var change = 1
if (change > 25) {
    var quarters = change/25
    var quarter_remainder = change%25
}
console.log(Math.floor(quarters))
if (quarter_remainder > 10) {
    var dimes= quarter_remainder/10
    var dime_remainder = quarter_remainder%10
}
console.log(Math.floor(dimes))