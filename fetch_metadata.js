const { Department, Field } = require('./models');

async function main() {
  try {
    const departments = await Department.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Field,
        as: 'fields',
        attributes: ['id', 'name']
      }]
    });
    console.log(JSON.stringify(departments, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
