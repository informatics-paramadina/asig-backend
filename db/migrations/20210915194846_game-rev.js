
exports.up = function(knex) {
    return knex.schema.hasTable('game-rev').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('game-rev', function(table) {
                table.increments('id').primary();
                table.string('leader_email', 200).unique().notNullable();
                table.string('leader_phone_number', 25).unique().notNullable();
                table.string('leader_name', 255).notNullable();
                table.string('leader_name_ingame', 200).notNullable();
                table.string('team_name', 255).notNullable();
                table.string('team_logo', 255).notNullable();
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("game-rev");
};
