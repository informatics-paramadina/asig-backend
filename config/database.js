const env = process.env.NODE_ENV || 'development';
const knexfile = require('../knexfile');
const db = require('knex')(knexfile[env]);

// for testing purpose!

// db.select('*')
//   .from('project')
//   .then(rows => {
//     console.log(rows);
//   });

module.exports = db;