'use strict';

class Verification {
    checkEmailLength(email) {
        const emailLength = email.length;
        return emailLength >= 8 && emailLength <= 30;
    }

    checkPasswordLength(password) {
        const passwordLength = password.length;
        return passwordLength >= 8 && passwordLength <= 20;
    }

    isEmailValid(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    isIdNumber(id) {
        return !isNaN(parseFloat(id)) && !isNaN(id - 0);
    }
}

module.exports = new Verification();
