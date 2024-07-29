const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('./moviesite.sqlite3', (err) => { 
  if (err) {
    return console.error(err.message);
   } 
   console.log('Connected to the moviesite database.');
   });


   