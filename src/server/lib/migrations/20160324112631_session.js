
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTableIfNotExists('sessions', (table) => {
      table.string('id').primary();
      table.boolean('isAdmin').defaultTo(false);
      table.integer('userID').references('id').inTable('users').notNullable();
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('sessions'),
  ]);
};
