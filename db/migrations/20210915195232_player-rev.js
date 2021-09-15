
exports.up = function(knex) {
    return knex.schema.hasTable('player-rev').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('player-rev', function(table) {
                table.increments('id').primary();
                table.string('name', 255).notNullable();
                table.string('phone_number', 25).notNullable();
                table.string('name_ingame', 200).notNullable();
                //ref
                table.integer('team_id').unsigned().notNullable();
                table.foreign('team_id').references('id').inTable('game-rev').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("player-rev");
};
