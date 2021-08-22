
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('project').del()
    .then(function () {
      // Inserts seed entries
      return knex('project').insert([
        {
          nama_project: 'project1',
          creator: 'alex1',
          project_link: 'https://knexjs.org/',
          type: 'animasi'
        },
        {
          nama_project: 'project2',
          creator: 'alex2',
          project_link: 'https://knexjs.org/',
          type: 'game'
        },
        {
          nama_project: 'project3',
          creator: 'alex3',
          project_link: 'https://knexjs.org/',
          type: 'animasi'
        }
      ]);
    })
    .catch(e => console.error("error " + e));
};
