
module.exports.ValidateEmail = (input) => {

    var validRegex = /^([\w]*[\w\.]*(?!\.)@gmail.com)/;
  
    if (input.match(validRegex)) {
      return true;
    }
      return false;
  
    }
