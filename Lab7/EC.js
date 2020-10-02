var month = -1;
var num_days = 2
switch (month){
    case 0:
        month ="January";
        num_day = 31;
        break;
    case 1:
        month = "February";
        num_day = 28;
        break;
    case 2:
        month= "March";
        num_day = 31;
        break;
    case 3:
        month = "April";
        num_day = 30;
        break;
    case 4: 
        month = "May";
        num_day = 31;
        break;
    case 5:
        month = "June";
        num_day = 30;
        break;
    case 6:
        month = "July";
        num_day = 31;
        break;
    case 7:
        month = "August";
        num_day = 31;
        break;
    case 8:
        month = "September";
        num_day = 30;
        break;
    case 9:
        month = "October";
        num_day = 31;
        break;
    case 10:
        month = "November";
        num_day = 30;
        break;
    case 11:
        month= "December"
        num_day = 31;
        break;
    default: 
        month = "not a valid month";
        num_day = "unknown";
        console.log("Error: not a valid month");
}

    console.log(`${month} has ${num_day} days`)