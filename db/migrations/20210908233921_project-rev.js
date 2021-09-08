
exports.up = function(knex) {
    return knex.schema
        .dropTable('project')
        .createTable('project', function(table) {
            table.increments('id').primary();
            table.string('nama_project', 255).notNullable();
            table.string('creator', 255).notNullable();
            table.text('description', 'longtext');
            table.string('thumbnail', 255);
            table.string('project_link', 255).notNullable();
            table.enu('type', ['animasi', 'game']).notNullable(); // bisa juga string, belom tau

            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("project");
};
