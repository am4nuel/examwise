const { Field, Department, UniversityField, sequelize } = require('../models');

const fields = [
  // Natural & Computational Sciences
  "Biology", "Chemistry", "Physics", "Mathematics", "Statistics", "Geology", "Meteorology", "Sport Science", 
  "Computer Science", "Information Technology", "Information Systems", "Data Science", "Cybersecurity", "Biotechnology",
  // Engineering & Technology
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Engineering", "Chemical Engineering", 
  "Industrial Engineering", "Textile Engineering", "Automotive Engineering", "Manufacturing Engineering", 
  "Hydraulic & Water Resources Engineering", "Surveying Engineering", "Geomatics Engineering", "Mining Engineering", 
  "Geological Engineering", "Metallurgical Engineering", "Environmental Engineering", "Software Engineering", 
  "Biomedical Engineering", "Aerospace Engineering (Avionics)", "Construction Technology & Management", 
  "Railway Engineering", "Water Supply & Sanitary Engineering",
  // Agriculture & Environmental Sciences
  "Plant Sciences", "Animal Sciences", "Horticulture", "Soil & Water Management", "Agricultural Economics", 
  "Agricultural Extension", "Agricultural Engineering", "Food Science & Technology", "Veterinary Medicine", 
  "Forestry", "Natural Resource Management", "Aquaculture & Fisheries", "Rural Development & Agricultural Extension", 
  "Wildlife & Ecotourism Management", "Climate Change & Development", "Environmental Science",
  // Business, Economics & Social Sciences
  "Accounting", "Finance", "Marketing", "Management", "Business Administration", "Economics", "Cooperative Studies", 
  "Tourism & Hospitality Management", "Public Administration", "Development Management", "Project Management", 
  "Procurement & Supplies Management", "Logistics & Supply Chain Management", "Banking & Insurance", 
  "Entrepreneurship", "Human Resource Management",
  // Medicine & Health Sciences
  "Medicine (MD)", "Nursing", "Midwifery", "Pharmacy", "Medical Laboratory Science", "Anesthesia", "Physiotherapy", 
  "Health Informatics", "Public Health", "Dentistry", "Psychiatry", "Radiology", "Optometry", "Environmental Health", 
  "Health Officer", "Health Economics & Management",
  // Social Sciences & Humanities
  "Sociology", "Social Work", "Anthropology", "Geography", "History", "Heritage Management", "Archeology", 
  "Philosophy", "Civics & Ethical Studies", "Political Science & International Relations", "Psychology", 
  "Governance & Development Studies", "Federal Studies", "Peace & Conflict Studies", "Security & Intelligence Studies", 
  "Ethiopian Languages & Literature (Amharic, Oromo, etc.)", "English Language & Literature", "Linguistics", 
  "Journalism & Communication", "Literature", "Theater Arts", "Music", "Fine Art & Design",
  // Law
  "Law (LLB)",
  // Education (Pedagogy)
  "Biology Education", "Chemistry Education", "Physics Education", "Mathematics Education", "English Language Education", 
  "Amharic Language Education", "Geography Education", "History Education", "Civics Education", "Sport Science Education", 
  "Educational Planning & Management", "Pedagogy (General)", "Special Needs Education", "Early Childhood Care & Education", 
  "Curriculum & Instruction", "Educational Psychology", "School Leadership",
  // Emerging & Interdisciplinary Fields
  "Development Studies", "Gender & Development Studies", "Urban & Regional Planning", "Real Estate Management", 
  "Disaster Risk Management & Sustainable Development", "Information Science", "Library Science", 
  "Archives & Records Management", "Aviation (Pilot, Maintenance, Management)", "Maritime Studies", "Energy Engineering & Management"
];

const departments = [
  "Biology", "Chemistry", "Physics", "Mathematics", "Statistics", "Sport Science", "Geology", "Meteorology",
  "Civil Engineering", "Mechanical Engineering", "Electrical & Computer Engineering", "Chemical Engineering", 
  "Industrial Engineering", "Textile Engineering", "Hydraulic & Water Resources Engineering", "Surveying Engineering", 
  "Mining Engineering", "Automotive Engineering", "Construction Technology & Management",
  "Plant Sciences", "Animal Sciences", "Horticulture", "Soil & Water Management", "Agricultural Economics", 
  "Natural Resource Management", "Forestry", "Food Science & Technology", "Agricultural Extension",
  "Accounting & Finance", "Management", "Marketing", "Economics", "Business Administration", 
  "Tourism & Hospitality Management", "Cooperative Studies",
  "Sociology", "Social Work", "Geography & Environmental Studies", "History & Heritage Management", 
  "Civic & Ethical Studies", "Political Science & International Relations", "Psychology", "Anthropology", "Philosophy",
  "Computer Science", "Information Technology", "Information Systems", "Software Engineering",
  "Medicine", "Nursing", "Midwifery", "Pharmacy", "Medical Laboratory Sciences", "Anesthesia", "Physiotherapy", "Public Health",
  "Veterinary Science", "Clinical Studies", "Paraclinical Studies",
  "Law", "Governance & Development Studies",
  "Teacher Education & Curriculum Studies", "Special Needs & Inclusive Education", "Educational Planning & Management", "Educational Psychology",
  "English Language & Literature", "Ethiopian Languages & Literature", "Linguistics", "Journalism & Communication"
];

const usedCodes = new Set();
const generateCode = (name) => {
  let base = name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
  let code = "D-" + base;
  let counter = 1;
  while (usedCodes.has(code)) {
    code = "D-" + base.substring(0, 4) + counter;
    counter++;
  }
  usedCodes.add(code);
  return code;
};

async function reseed() {
  const transaction = await sequelize.transaction();
  try {
    console.log("Clearing UniversityFields...");
    await UniversityField.destroy({ where: {}, transaction });
    
    console.log("Clearing Fields...");
    await Field.destroy({ where: {}, transaction });
    
    console.log("Clearing Departments...");
    await Department.destroy({ where: {}, transaction });

    console.log("Inserting Fields...");
    for (const name of fields) {
      await Field.create({ name }, { transaction });
    }

    console.log("Inserting Departments...");
    for (const name of departments) {
        const code = generateCode(name);
        await Department.create({ 
            name: `Department of ${name}`, 
            code,
            description: `Department focused on ${name}`
        }, { transaction });
    }

    await transaction.commit();
    console.log("Reseed successful!");
  } catch (error) {
    await transaction.rollback();
    console.error("Reseed failed:", error);
  } finally {
    process.exit();
  }
}

reseed();
