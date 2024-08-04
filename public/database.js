const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('./moviesite.sqlite3', (err) => { 
    if (err) {
      return console.error(err.message);
     } 
     console.log('Connected to the moviesite database.');
     }); 


function createTableIfNotExists(tableName, columns) {  // function to create a table if it doesn't exist
  db.serialize(() => {     
    db.get(`SELECT name FROM sqlite_master WHERE type="table" AND name="${tableName}"`, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if (!row) {
        db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
      } console.log(`Table ${tableName} created successfully`);
    });
  });
}

createTableIfNotExists('movies', 'id INTEGER PRIMARY KEY, title TEXT, director TEXT, year INTEGER, genre TEXT, plot TEXT, actors TEXT, poster TEXT');
createTableIfNotExists('packages', 'id INTEGER PRIMARY KEY, name TEXT, price INTEGER, description TEXT, features TEXT');
createTableIfNotExists('contacts', 'id INTEGER PRIMARY KEY, fullname TEXT, email TEXT, phone TEXT, message TEXT');

