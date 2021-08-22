
exports.up = function(knex) {
    return knex.schema.hasTable('member').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('member', function(table) {
                table.increments('id').primary();
                table.string('name', 255).notNullable();
                table.string('phone_number', 25).notNullable();
                table.string('name_ingame', 200).notNullable();
                //ref
                table.integer('team_id').unsigned().notNullable();
                table.foreign('team_id').references('id').inTable('team').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("member");
};
