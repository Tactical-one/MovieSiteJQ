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
  res.rnder('contact', { title: 'Contact Page', layout: 'layouts/layout' });  // route to load contact.ejs
});

app.get('/packages', async function(req, res) {
  res.render('packages', { title: 'Account Packages Page', layout: 'layouts/layout' });  // route to load packages.ejs
});

app.get('/catalog', async function(req, res) {
  res.render('catalog', { title: 'Movie Catalog Page', layout: 'layouts/layout', articles: articles });  // route to load catalog.ejs
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
    summary: "Replacing worn chains with the same model from the same brand is easy, but even this is fraught with complications."
  },
  {
    imageSrc: "https://www.sky.at/static/img/serienhighlights/sky_22-11_house-of-the-dragon_sub_s.jpg",
    altText: "House of the Dragon",
    date: "5 Oct 2024",
    title: "House of the Dragon",
    summary: "Different riding styles call for purpose-built bike seats. These expert-approved saddles earned our recommendation."
  },
  {
    imageSrc: "https://lumiere-a.akamaihd.net/v1/images/the-acolyte-cast-article-feature_e52a6450.jpeg?region=0,50,1600,800",
    altText: "The Acolyte",
    date: "29 Sep 2024",
    title: "The Acolyte",
    summary: "Different riding styles call for purpose-built bike seats. These expert-approved saddles earned our recommendation."
  },
  {
    imageSrc: "https://flixchatter.net/wp-content/uploads/2020/10/enolaholmes-poster.jpg",
    altText: "Enola Holmes",
    date: "5 Aug 2024",
    title: "Enola Holmes",
    summary: "Different riding styles call for purpose-built bike seats. These expert-approved saddles earned our recommendation."
  },
  {
    imageSrc: "https://i.ytimg.com/vi/N70NfvtOINI/maxresdefault.jpg",
    altText: "The Crown",
    date: "5 Oct 2024",
    title: "The Crown",
    summary: "Different riding styles call for purpose-built bike seats. These expert-approved saddles earned our recommendation."
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

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', layout: 'layouts/layout' });
});


