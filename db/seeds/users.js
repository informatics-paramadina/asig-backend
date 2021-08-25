const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          email: 'alex@gmail.com',
          phone_number: '08722221123',
          name: 'alex',
          password: bcrypt.hashSync('alexalex123', 10),
          role: 'admin'
        },
        {
          email: 'alex1@gmail.com',
          phone_number: '08722221124',
          name: 'alex1',
          password: bcrypt.hashSync('alexalex123', 10),
          role: 'user'
        },
      ]);
    })
    .catch(e => console.error("error " + e));
};
