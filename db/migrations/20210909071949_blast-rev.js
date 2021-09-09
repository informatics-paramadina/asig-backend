
exports.up = function(knex) {
    return knex.schema
        .dropTable('blast')
        .createTable('blast', function(table) {
            table.increments('id').primary();
            table.text('message', 'longtext').notNullable();
            table.timestamp('message_time');
            table.enu('status', ['success', 'failed']).notNullable();
            table.enu('event', ['talkshow', 'game', 'minigame']).notNullable();
            //ref
            table.string('phone_number', 25).notNullable();
            table.foreign('phone_number').references('phone_number').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("blast");
};
