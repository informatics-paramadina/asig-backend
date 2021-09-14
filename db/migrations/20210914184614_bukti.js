
exports.up = function(knex) {
    return knex.schema.hasTable('bukti').then(function(exists) {
        if (exists) return;

        return knex.schema
            .createTable('bukti', function(table) {
                table.increments('id').primary();
                table.string('file_bukti', 255).notNullable();
                table.string('nama_rekening', 255);
                //ref
                table.integer('team_id').unsigned().notNullable();
                table.foreign('team_id').references('id').inTable('team').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamps(true, true);
            });
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("bukti");
};
