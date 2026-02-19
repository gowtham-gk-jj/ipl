const bcrypt = require("bcrypt");

bcrypt.hash("host123", 10).then(console.log);
