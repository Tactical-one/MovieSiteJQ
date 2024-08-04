const express = require('express'); //create our Express server
const app = express();  //create a new express application
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

app.use(express.static(path.join(__dirname, 'public'))) //gives the server access to this folder's resources to load within our route
app.set('view engine', 'ejs'); //set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); //set the views summaryy to be in the views folder
app.use(expressLayouts); //use express layouts
app.set('layout', './layouts/layout'); //set the layout to be in the layouts folder


// Middleware for parsing form data
app.use(bodyParser.json()) //enable json use 
app.use(bodyParser.urlencoded({ extended: true }))

//******************** Connect to the database ********************
let db = new sqlite3.Database('./moviesite.sqlite3', (err) => { 
  if (err) {
    return console.error(err.message);
   } 
   console.log('\x1b[32m Connected to the moviesite database. \x1b[0m'); //prints green
   }); 

// close the database connection after the server is closed
app.on('close', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
    app.exit();
  });
});


//********************** database queries & functions   ********************

function createTableIfNotExists(tableName, columns) {  // function to create a table if it doesn't exist
  db.serialize(() => {     
    db.run(`SELECT name FROM sqlite_master WHERE type="table" AND name="${tableName}"`, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if (!row) {
        db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
      } console.log(` \x1b[32m Table ${tableName} created successfully \x1b[0m`);
    });
  });
}

createTableIfNotExists('movies', 'id INTEGER PRIMARY KEY, title TEXT, summary TEXT, year INTEGER, alttext TEXT, poster TEXT');
createTableIfNotExists('packages', 'id INTEGER PRIMARY KEY, name TEXT, price INTEGER, description TEXT, features TEXT');
createTableIfNotExists('contacts', 'id INTEGER PRIMARY KEY, fullname TEXT, email TEXT, phone TEXT, message TEXT');
createTableIfNotExists('users', 'id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT');

// function to update a table with data
function insertData(tableName, data) {
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  db.serialize(() => {
    const query = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${placeholders})`;
    db.run(query, values, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Data inserted successfully into table ${tableName}`);
    });
  });
}

// insert example data into the movies table
insertData('movies', { title: 'Civil War', summary: 'A journey across a dystopian future America, following a team of military-embedded journalists as they race against time to reach DC before rebel factions descend upon the White House.', year: 2024, alttext: 'Civil War', poster: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F669e71fe-0f5c-48b8-987b-be8d0bde14f1_1280x720.jpeg' });

 
// Route to search a movie by title
app.get('/search-movie', (req, res) => {
  const movieTitle = req.query.title;
  if (!movieTitle) {
      return res.status(400).json({ error: 'Movie title is required' });
  }
  db.get("SELECT * FROM movies WHERE title = ?", [movieTitle], (err, row) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
          res.json(row);
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  });
});

// Route to update a movie by ID
app.post('/update-movie/:id', (req, res) => {
  const movieId = req.params.id;
  const { title, summary, year } = req.body;
  if (!title || !summary || !year) {
      return res.status(400).json({ error: 'All fields are required' });
  }
  db.run("UPDATE movies SET title = ?, summary = ?, year = ? WHERE id = ?", [title, summary, year, movieId], function(err) {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes > 0) {
          res.json({ id: movieId, title, summary, year });
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  });
});

// Route to delete a movie by title
app.post('/delete-movie-by-title', (req, res) => {
  const { title } = req.body;
  if (!title) {
      return res.status(400).json({ error: 'Movie title is required' });
  }
  db.run("DELETE FROM movies WHERE title = ?", [title], function(err) {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes > 0) {
          res.json({ message: 'Movie deleted successfully' });
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  });
});



// *****************     ROUTES     ********************************

app.get('/', async function(req, res) {
  res.render('index', { title: 'HomePage', layout: 'layouts/layout' });  // route to load index.ejs
});

app.get('/index', async function(req, res) {
  res.render('index', { title: 'HomePage', layout: 'layouts/layout' });  // route to load index.ejs
});

app.get('/inspiration', async function(req, res) {
  res.render('inspiration', { title: 'Inspiration Page', layout: 'layouts/layout' });  // route to load inspiration.ejs
});

app.get('/contact', async function(req, res) {
  res.render('contact', { title: 'Contact Page', layout: 'layouts/layout' });  // route to load contact.ejs
});

app.get('/packages', async function(req, res) {
  res.render('packages', { title: 'Account Packages Page', layout: 'layouts/layout' });  // route to load packages.ejs
});

app.get('/catalog', async function(req, res) {
  res.render('catalog', { title: 'Movie Catalog Page', layout: 'layouts/layout', articles: articles });  // route to load catalog.ejs
});

app.get('/dashboard', async function(req, res) {
  db.all('SELECT * FROM movies ORDER BY year DESC', [], (err, movies) => {
    if (err) {
      console.error('Error fetching movies:', err);
      movies = [];
    }
    res.render('dashboard', { 
      title: 'Dashboard Page', 
      layout: 'layouts/layout',
      movies: movies
    });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));


// array of catalog objects on catalog page
const articles = [
  {
    imageSrc: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F669e71fe-0f5c-48b8-987b-be8d0bde14f1_1280x720.jpeg",
    altText: "Civil War",
    date: "25 Dec 2024",
    title: "Civil War",
    summary: "Good spokes will give the entire wheelset more tension, accuracy, and rigidity, allowing the rider to accelerate satisfactorily."
  },
  {
    imageSrc: "https://i1.wp.com/cornellsun.com/wp-content/uploads/2023/06/bridgerton-scaled.jpg?fit=1170%2C658&ssl=1",
    altText: "Bridgerton",
    date: "11 Nov 2024",
    title: "Bridgerton",
    summary: "A romantic drama series set in the Regency era."
  },
  {
    imageSrc: "https://www.sky.at/static/img/serienhighlights/sky_22-11_house-of-the-dragon_sub_s.jpg",
    altText: "House of the Dragon",
    date: "5 Oct 2024",
    title: "House of the Dragon",
    summary: "A prequel to Game of Thrones, focusing on the Targaryen family."
  },
  {
    imageSrc: "https://lumiere-a.akamaihd.net/v1/images/the-acolyte-cast-article-feature_e52a6450.jpeg?region=0,50,1600,800",
    altText: "The Acolyte",
    date: "29 Sep 2024",
    title: "The Acolyte",
    summary: "A Star Wars series exploring the dark side of the Force."
  },
  {
    imageSrc: "https://flixchatter.net/wp-content/uploads/2020/10/enolaholmes-poster.jpg",
    altText: "Enola Holmes",
    date: "5 Aug 2024",
    title: "Enola Holmes",
    summary: "A mystery adventure featuring Sherlock Holmes' younger sister."
  },
  {
    imageSrc: "https://i.ytimg.com/vi/N70NfvtOINI/maxresdefault.jpg",
    altText: "The Crown",
    date: "5 Oct 2024",
    title: "The Crown",
    summary: "A historical drama about the reign of Queen Elizabeth II."
  }
  // ... add more articles as needed
];


// contact form handling
let contacts = [];

app.post('/submit', (req, res) => {
//Take what was sent from the req.body and send into the route
  const{fullname, email, phone, message} = req.body; //create variables from the data that was sent through the body of the request
  const newContact = {id: contacts.length + 1, fullname, email, phone, message};
  contacts.push(newContact); //add new contact to the contacts array
  res.json({message: 'Thank you for your message. We will get back to you shortly.', data: newContact});  //print out messsage if success and display the submitted information
});

app.get('/contacts', (req, res) => {
  res.json(contacts); //return all contacts
});





// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', layout: 'layouts/layout' });
});