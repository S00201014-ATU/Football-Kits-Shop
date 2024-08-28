const bcrypt = require('bcryptjs');

const storedHashedPassword = '$2a$10$OBMTAL2bqXvXWwrmapETr.cEk8s9Ukko0HZwiItk9GpiMdcj74V4i'; 
const enteredPassword = 'hhh';

bcrypt.compare(enteredPassword, storedHashedPassword, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
        return;
    }
    
    if (isMatch) {
        console.log('Password matches!');
    } else {
        console.log('Password does not match.');
    }
});
