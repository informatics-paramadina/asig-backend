
exports.up = function(knex) {
    return knex.schema.hasTable('users').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('users', function(table) {
                table.increments('id').primary();
                table.string('uuid', 100).unique().notNullable();
                table.string('email', 200).unique().notNullable();
                table.string('phone_number', 25).notNullable();
                table.string('name', 255).notNullable();
                table.string('password', 255).notNullable();
                table.enu('role', ['admin', 'user', 'player']).notNullable();
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("users");
};
