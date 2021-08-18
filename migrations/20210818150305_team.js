
exports.up = function(knex) {
    return knex.schema.hasTable('team').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('team', function(table) {
                table.increments('id').primary();
                table.string('team_name', 255).notNullable();
                //ref
                table.integer('leader_id').unsigned().notNullable();
                table.foreign('leader_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("team");
};
