age_count = 1; //start the age count
age = 18;
while (age_count < age) {
    if (age_count == (parseInt(Math.sqrt(age)))) {
        console.log(`${age_count} is the integer square root of Meghan's age`);
        process.exit();
    } else {
        console.log(`age ${age_count}`);
    }  
    
    age_count++
}
console.log(`Meghan is ${age_count} years old`)