
exports.up = function(knex) {
    return knex.schema.hasTable('minigame-rev').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('minigame-rev', function(table) {
                table.increments('id').primary();
                table.string('email', 200).unique().notNullable();
                table.string('phone_number', 25).unique().notNullable();
                table.string('name', 255).notNullable();
                table.string('name_ingame', 200);
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("minigame-rev");
};
