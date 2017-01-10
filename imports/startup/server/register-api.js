
import '/imports/api/api/auth.js';
import '/imports/api/api/qiniu.js';

import '/imports/api/codes/methods.js';

// Import all Database API run at server

import '/imports/api/users/server/index.js';  // Include publications.js & hooks.js
import '/imports/api/users/methods.js';

import '/imports/api/notes/server/publications.js';
import '/imports/api/notes/methods.js';

import '/imports/api/images/server/publications.js';
import '/imports/api/images/methods.js';

import '/imports/api/collections/server/publications.js';
import '/imports/api/collections/methods.js';
