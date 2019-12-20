// takes in a passwordHash and an array of password strings, compares the input hash to the hash of each string in the array, and returns an object with a match value of true and a correct password string if there is a match or an object with a match value of false and a null correct password field if there is no match

const bcrypt = require('bcryptjs');

const bruteforce = (passwordHash, passwordStringArray) => {
  const returnObj = {
    match: false,
    password: null
  };

  for(let i = 0; i < passwordStringArray.length; i++) {
    if(bcrypt.compareSync(passwordStringArray[i], passwordHash)) {
      returnObj.match = true;
      returnObj.password = passwordStringArray[i];
      break;
    }
  }

  return returnObj;
};

module.exports = { bruteforce };
