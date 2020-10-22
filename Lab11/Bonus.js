monthly_sales = [100, 250, 390];
var tax_rate = 0.0575;
tax_owing = [];
function find_tax_owed (array_of_sales) {
  
  for (i = 0; i < (monthly_sales.length); i++){
      tax_owing.push (monthly_sales[i]*tax_rate);
  };
};
find_tax_owed(monthly_sales);
console.log(tax_owing);