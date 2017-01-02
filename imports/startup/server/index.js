// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// This defines routes only for RESTful API
// import './routes.js';

// Set up some rate limiting and other important security settings.
import './security.js';

// This defines all the collections, publications and methods
// that the application provides as an API to the client.
import './register-api.js';

// This defines all DataBase Migrations history
import './migrations.js';
