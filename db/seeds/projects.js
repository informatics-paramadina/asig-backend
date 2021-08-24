
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('project').del()
    .then(function () {
      // Inserts seed entries
      return knex('project').insert([
        {
          nama_project: 'project1',
          creator: 'tes',
          project_link: 'https://paramadina.ac.id/',
          type: 'animasi'
        },
        {
          nama_project: 'project2',
          creator: 'tes',
          project_link: 'https://paramadina.ac.id/',
          type: 'game'
        },
        {
          nama_project: 'project3',
          creator: 'tes',
          project_link: 'https://paramadina.ac.id/',
          type: 'animasi'
        }
      ]);
    })
    .catch(e => console.error("error " + e));
};
