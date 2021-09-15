
exports.up = function(knex) {
    return knex.schema.hasTable('talkshow-rev').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('talkshow-rev', function(table) {
                table.increments('id').primary();
                table.string('email', 200).unique().notNullable();
                table.string('phone_number', 25).unique().notNullable();
                table.string('name', 255).notNullable();
                table.string('id_pendaftaran', 100).unique().notNullable();
                table.string('instansi', 255).notNullable();
                table.string('pekerjaan', 255).notNullable();
                table.string('nim', 50).unique();
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("talkshow-rev");
};
