
exports.up = function(knex) {
    return knex.schema.hasTable('otp').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('otp', function(table) {
                table.increments('id').primary();
                table.string('token', 255).notNullable(); // atau defaultTo(0)
                table.timestamp('expired_at');
                //ref
                table.integer('user_id').unsigned().notNullable();
                table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("otp");
};
