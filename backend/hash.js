const bcrypt = require("bcrypt");

bcrypt.hash("pbks", 10).then(console.log);
