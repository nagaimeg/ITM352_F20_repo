const fs = require('fs');

const user_data_filename = 'user_data.json';

var data = fs.readFileSync(user_data_filename, 'utf-8') ;

users_reg_data = JSON.parse(data);

//if username exists, get password
if (typeof users_reg_data['itm352'] != 'undefined') {
    console.log(users_reg_data['itm352']['password']=='grader')
}

//console.log(users_reg_data['dport']['password']);