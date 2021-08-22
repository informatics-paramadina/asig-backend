
exports.up = function(knex) {
    return knex.schema.hasTable('schedule').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('schedule', function(table) {
                table.increments('id').primary();
                table.string('event_name', 200).notNullable();
                table.text('description', 'longtext').notNullable();
                table.timestamp('start_at');
                //ref
                table.integer('created_by').unsigned().notNullable();
                table.foreign('created_by').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("schedule");
};
