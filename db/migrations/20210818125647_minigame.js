
exports.up = function(knex) {
    return knex.schema.hasTable('minigame').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('minigame', function(table) {
                table.increments('id').primary();
                table.string('name_ingame', 200).notNullable();
                //ref
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("minigame");
};
