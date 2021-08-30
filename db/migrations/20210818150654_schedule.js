
exports.up = function(knex) {
    return knex.schema.hasTable('schedule').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('schedule', function(table) {
                table.increments('id').primary();
                table.string('event_name', 200).notNullable();
                table.text('description', 'longtext').notNullable();
                table.enu('event', ['minigame', 'game']).notNullable();
                table.timestamp('start_at');
                //ref
                table.integer('created_by').unsigned().notNullable();
                table.integer('team_id_1').unsigned();
                table.integer('team_id_2').unsigned();
                table.integer('player_id_1').unsigned();
                table.integer('player_id_2').unsigned();
                table.foreign('created_by').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('team_id_1').references('id').inTable('team').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('team_id_2').references('id').inTable('team').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('player_id_1').references('id').inTable('minigame').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('player_id_2').references('id').inTable('minigame').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("schedule");
};
