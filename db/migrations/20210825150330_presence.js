
exports.up = function(knex) {
    return knex.schema.hasTable('presence').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('presence', function(table) {
                table.increments('id').primary();
                table.boolean('is_present').defaultTo(false); // atau defaultTo(0)
                table.timestamp('present_at');
                //ref
                table.string('user_uuid', 100).notNullable();
                table.foreign('user_uuid').references('uuid').inTable('talkshow').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("presence");
};
