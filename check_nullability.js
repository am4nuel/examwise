const { sequelize } = require('./models');

async function check() {
  try {
    const [filesInfo] = await sequelize.query("DESCRIBE files");
    console.log("Files table:");
    console.table(filesInfo.map(i => ({ Field: i.Field, Null: i.Null })));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
