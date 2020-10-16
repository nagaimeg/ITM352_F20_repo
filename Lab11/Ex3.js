name = 'Meghan';
age=18;
attributes  =  name + ";"+  age + ";" + (age + 0.5) + ";" + (0.5 - age) ;
parts = attributes.split(';');
console.log(parts)
for(part of parts) {
    console.log (`${part} is a ${typeof part}`)
};
console.log(typeof parts);