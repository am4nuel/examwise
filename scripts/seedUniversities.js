const { University, sequelize } = require('../models');

const governmentUniversities = [
  { name: 'Wolaita Sodo University (WSU)', location: 'Sodo' },
  { name: 'Jigjiga University (JJU)', location: 'Jigjiga' },
  { name: 'Ambo University (AU)', location: 'Ambo' },
  { name: 'Debre Berhan University (DBU)', location: 'Debre Berhan' },
  { name: 'Wollega University (WU)', location: 'Nekemte' },
  { name: 'Samara University (SU)', location: 'Samara' },
  { name: 'Mizan-Tepi University (MTU)', location: 'Mizan Teferi' },
  { name: 'Wachamo University (WCU)', location: 'Hossana' },
  { name: 'Aksum University (AKU)', location: 'Aksum' },
  { name: 'Wolkite University (WKU)', location: 'Wolkite' },
  { name: 'Debark University (DbU)', location: 'Debark' },
  { name: 'Debre Tabor University (DTU)', location: 'Debre Tabor' },
  { name: 'Woldia University (WDU)', location: 'Woldia' },
  { name: 'Injibara University (IU)', location: 'Injibara' },
  { name: 'Mettu University (MeU)', location: 'Mettu' },
  { name: 'Bonga University (BoU)', location: 'Bonga' },
  { name: 'Assosa University (ASU)', location: 'Assosa' },
  { name: 'Oda Bultum University (OBU)', location: 'Chiro' },
  { name: 'Selale University (SlU)', location: 'Fiche' },
  { name: 'Ethiopian Civil Service University (ECSU)', location: 'Addis Ababa' }
];

const privateInstitutions = [
  { name: "St. Mary's University (SMU)", location: "Addis Ababa" },
  { name: "Unity University", location: "Addis Ababa" },
  { name: "Rift Valley University (RVU)", location: "Multiple Campuses" },
  { name: "Admas University", location: "Multiple Campuses" },
  { name: "HiLCoE School of Computer Science and Technology", location: "Addis Ababa" },
  { name: "Alpha University College", location: "Addis Ababa" },
  { name: "CPU College", location: "Addis Ababa" },
  { name: "Hope University College", location: "Addis Ababa" },
  { name: "Leadstar University College", location: "Addis Ababa" },
  { name: "Royal College", location: "Addis Ababa" },
  { name: "New Generation University College", location: "Multiple Campuses" },
  { name: "Paradise Valley University College", location: "Multiple Campuses" },
  { name: "Africa Beza University College", location: "Addis Ababa" },
  { name: "International Leadership Institute (ILI)", location: "Addis Ababa" },
  { name: "Ethiopian Graduate School of Theology (EGST)", location: "Addis Ababa" },
  { name: "Kotebe Metropolitan University (KMU)", location: "Addis Ababa" },
  { name: "Microlink Information Technology College", location: "Addis Ababa" },
  { name: "Lion Ethiopia Tourism & Hotel College", location: "Addis Ababa" },
  { name: "Alkan University College", location: "Addis Ababa & other cities" },
  { name: "Abyssinia College", location: "Addis Ababa & other locations" },
  { name: "Addis Continental Institute of Public Health", location: "Addis Ababa" },
  { name: "Africa Health Sciences College", location: "Addis Ababa" },
  { name: "Alage College", location: "Alage" },
  { name: "Arsi University College of Medical Sciences", location: "Assela" },
  { name: "Atlas Health College", location: "Addis Ababa" },
  { name: "Axum College", location: "Addis Ababa" },
  { name: "Bethel Medical College", location: "Addis Ababa" },
  { name: "Central Health College", location: "Addis Ababa & other locations" },
  { name: "City University College of Addis Ababa (CUCAA)", location: "Addis Ababa" },
  { name: "Cyber Talent Computer Technology College", location: "Addis Ababa" },
  { name: "Dandii Boru College", location: "Addis Ababa" },
  { name: "Dashen College", location: "Gondar & other locations" },
  { name: "Defense University College of Engineering", location: "Debre Zeit" },
  { name: "Ethio-National College", location: "Addis Ababa" },
  { name: "Gambella College of Teachers Education", location: "Gambella" },
  { name: "Gibson Youth Academy College", location: "Addis Ababa" },
  { name: "Gigi College of Business & Technology", location: "Addis Ababa" },
  { name: "Grace College", location: "Addis Ababa" },
  { name: "Hawassa College of Health Sciences", location: "Hawassa" },
  { name: "Hayat Medical College", location: "Addis Ababa" },
  { name: "Health Link College", location: "Addis Ababa" },
  { name: "Infolink College", location: "Addis Ababa & other locations" },
  { name: "Jethro Leadership & Management Institute", location: "Addis Ababa" },
  { name: "KEA-MED Medical College", location: "Addis Ababa" },
  { name: "Lucy College", location: "Addis Ababa" },
  { name: "Medco Bio-Medical College", location: "Addis Ababa" },
  { name: "Medco Health College", location: "Addis Ababa" },
  { name: "Nile College", location: "Addis Ababa" },
  { name: "Noble Higher Education Institute", location: "Addis Ababa" },
  { name: "Omega Medical College", location: "Addis Ababa" },
  { name: "Pan African College", location: "Addis Ababa" },
  { name: "PESC Information Systems College", location: "Addis Ababa" },
  { name: "Rift Valley University College - Hawassa Campus", location: "Hawassa" },
  { name: "Scott Christian University College", location: "Addis Ababa" },
  { name: "Sheba College", location: "Mekelle & other locations" },
  { name: "Signal College", location: "Addis Ababa" },
  { name: "Softnet Computer Technology College", location: "Addis Ababa" },
  { name: "Tegbareid Polytechnic College", location: "Addis Ababa" },
  { name: "Universal Medical College", location: "Addis Ababa" },
  { name: "Yared Quality College", location: "Addis Ababa" },
  { name: "Zenith University College", location: "Addis Ababa" }
];

async function seedUniversities() {
  try {
    console.log('--- Seeding Universities ---');
    
    // Disable Foreign Key Checks to allow truncation (Be careful: this orphans related data like Exams)
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    
    // Clear existing
    await University.destroy({ where: {}, truncate: true });
    console.log('✓ Cleared existing universities');

    // Create Government
    for (const uni of governmentUniversities) {
      await University.create({
        name: uni.name,
        type: 'Government',
        location: uni.location
      });
    }
    console.log(`✓ Added ${governmentUniversities.length} Government Universities`);

    // Create Private
    // Filter duplicates first (some names appeared in both lists provided in prompt)
    const uniquePrivate = privateInstitutions.filter((uni, index, self) =>
      index === self.findIndex((t) => (
        t.name === uni.name
      ))
    );

    for (const uni of uniquePrivate) {
      await University.create({
        name: uni.name,
        type: 'Private',
        location: uni.location
      });
    }
    console.log(`✓ Added ${uniquePrivate.length} Private Institutions`);

    // Re-enable Foreign Key Checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedUniversities();
