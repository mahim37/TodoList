module.exports = {getDate, getDay};

const now = new Date();

function getDate(){    
    const options = {
        weekday:"long",
        month:"long",
        day:"numeric",
        year:"numeric"
    }
    return  new Intl.DateTimeFormat("en-US", options).format(now);
 
}
function getDay(){
    const options = {
        weekday:"long",
    }
    return new Intl.DateTimeFormat("en-US", options).format(now);
 
}
