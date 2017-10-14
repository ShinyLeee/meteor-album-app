
import '/imports/api/api';

import '/imports/api/codes/methods';

// Import all Database API run at server

import '/imports/api/collections/server/publications';
import '/imports/api/collections/methods';

import '/imports/api/comments/server/publications';
import '/imports/api/comments/methods';

import '/imports/api/diarys/server/publications';
import '/imports/api/diarys/methods';

import '/imports/api/images/server/publications';
import '/imports/api/images/methods';

import '/imports/api/notes/server/publications';
import '/imports/api/notes/methods';

import '/imports/api/users/server/index'; // Include publications.js & hooks.js
import '/imports/api/users/methods';
