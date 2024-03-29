exports.up = function (knex) {
  return Promise.all([
    knex.raw(
      'ALTER TABLE notification ALTER COLUMN notification_id SET DEFAULT uuid_generate_v4();',
    ),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.raw('ALTER TABLE notification ALTER COLUMN notification_id DROP DEFAULT;'),
  ]);
};
