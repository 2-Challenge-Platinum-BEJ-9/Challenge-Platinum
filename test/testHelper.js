const db = require("../models");

module.exports = {
  flushTable: async () => {
    //just in case if someone run this on different environment
    require("assert").strictEqual(process.env.NODE_ENV, "test");
    console.log(`[Flushing all tables]`);
    console.time("FLUSH");
    for (const model of Object.values(db.sequelize.models)) {
      await model.sync({ force: true });
    }
  },
};
