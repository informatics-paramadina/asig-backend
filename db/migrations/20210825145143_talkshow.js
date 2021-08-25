
exports.up = function(knex) {
    return knex.schema.hasTable('talkshow').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('talkshow', function(table) {
                table.increments('id').primary();
                table.string('uuid', 100).unique().notNullable();
                table.string('instansi', 255).notNullable();
                table.string('pekerjaan', 255).notNullable();
                table.string('nim', 50).unique();
                table.timestamps(true, true);
                //ref
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("talkshow");
};
