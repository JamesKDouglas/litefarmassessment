const { mapFarmsToCountryId } = require('../../src/jobs/station_sync/countrySync');
exports.up = function (knex) {
  if (['integration', 'production'].includes(process.env.NODE_ENV)) {
    return mapFarmsToCountryId(knex);
  }
};

exports.down = function () {};
