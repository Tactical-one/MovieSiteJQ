const express = require('express'); //create our Express server
const app = express();  //create a new express application
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public'))) //gives the server access to this folder's resources to load within our route
app.set('view engine', 'ejs'); //set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); //set the views directory to be in the views folder
app.use(expressLayouts); //use express layouts
app.set('layout', './layouts/layout'); //set the layout to be in the layouts folder


// Middleware for parsing form data
app.use(bodyParser.json()) //enable json use 
app.use(bodyParser.urlencoded({ extended: true }))

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
  res.render('catalog', { title: 'Movie Catalog Page', layout: 'layouts/layout' });  // route to load catalog.ejs
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));



// contact form handling
let contacts = [];

app.post('/submit', (req, res) => {
//Take what was sent from the req.body and send into the route
  const{fullname, email, phone, message} = req.body; //create variables from the data that was sent through the body of the request
  const newContact = {id: contacts.length + 1, fullname, email, phone, message};
  contacts.push(newContact); //add new contact to the contacts array
  res.json({message: 'Thank you for your message. We will get back to you shortly.'});  //print out messsage if success
});

app.get('/contacts', (req, res) => {
  res.json(contacts); //return all contacts
});

app.get('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id); //get the id from the url
  const contact = contacts.find(contact => contact.id === contactId); //find the contact with the id
  if(contact){
    res.json(contact); //return the contact
  } else {
    res.status(404).json({message: 'Contact not found'}); //return 404 if not found  
  }
});

// update (PUT) contact
app.put('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id); //get the id from the url
  const index = contacts.findIndex(contact => contact.id === contactId); //find the contact with the id
  if(index !== -1){
    //Creating an updated user with the same ID, and update the body (data)
    const updatedContact = {...contacts[index], ...req.body};
    contacts[index] = updatedContact; //update the contact
    res.json({message: 'Contact updated'}) //return the updated contact
  } else {
    res.status(404).json({message: 'Contact not found'}); //return 404 if not found  
  }
});

// delete (DELETE) contact
app.delete('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id); //get the id from the url
  const index = contacts.findIndex(contact => contact.id === contactId); //find the contact with the id
  //if user is above -1 (> 0)
  if(index !== -1){
    const deletedContact = contacts.splice(index, 1)[0]; //delete the contact
    res.json({message: 'Contact deleted', data: deletedContact}); //return success message
  } else {
    res.status(404).json({message: 'Contact not found'}); //return 404 if not found  
  }
});


