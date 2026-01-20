const { Department, Course, sequelize } = require('./models');

const data = `
## **Social Sciences & Humanities**

### **Sociology**
* Introduction to Sociology
* Sociological Theory
* Social Research Methods
* Social Statistics
* Sociology of Development
* Rural Sociology
* Urban Sociology
* Sociology of Education
* Medical Sociology
* Industrial Sociology
* Political Sociology
* Sociology of Religion
* Gender & Society
* Population Studies
* Social Problems
* Senior Research Project

### **Social Work**
* Introduction to Social Work
* Social Work Theories
* Human Behavior & Social Environment
* Social Work Practice with Individuals & Families
* Social Work Practice with Groups
* Community Organization
* Social Policy
* Social Welfare Administration
* Child Protection
* Disability Studies
* Gerontological Social Work
* Counseling Skills
* Field Practicum I, II & III
* Research Methods
* Senior Project

### **Anthropology**
* Introduction to Anthropology
* Physical Anthropology
* Socio-Cultural Anthropology
* Archaeological Anthropology
* Anthropological Theory
* Ethnographic Methods
* Anthropology of Development
* Medical Anthropology
* Anthropology of Religion
* Linguistic Anthropology
* Ethiopian Cultures & Societies
* Heritage Management
* Applied Anthropology
* Field Research
* Senior Thesis

### **Geography**
* Physical Geography
* Human Geography
* Geography of Ethiopia
* Climatology
* Biogeography
* Geomorphology
- Population Geography
* Economic Geography
* Political Geography
* Urban Geography
* Rural Geography
* Cartography
* Remote Sensing
* GIS Applications
* Research Methods
* Field Work & Senior Project

### **History**
* Introduction to History
* Historiography
* History of Ethiopia & the Horn
* African History
* World History
* Economic History
* Social History
* Political History
* Diplomatic History
* Ancient & Medieval History
* Modern History
* Oral History
* Historical Research Methods
* Archives Management
* Senior Thesis

### **Heritage Management**
* Introduction to Heritage
* Cultural Heritage
* Natural Heritage
* Museum Studies
* Archaeology
* Conservation Science
* Heritage Tourism
* Heritage Law & Ethics
* Site Management
* Exhibition Design
* Documentation Methods
* Field Techniques
* Community Engagement
* Research Project

### **Archeology**
* Introduction to Archaeology
* Prehistoric Archaeology
* Historical Archaeology
* Archaeological Theory
* Field Methods (Survey & Excavation)
* Laboratory Analysis
* Ceramic Analysis
* Lithic Analysis
* Zooarchaeology
* Bioarchaeology
* Ethnoarchaeology
* Cultural Resource Management
* Archaeological Ethics
* Field School
* Senior Research

### **Philosophy**
* Introduction to Philosophy
* Logic
* Ethics
* Ancient Philosophy
* Medieval Philosophy
* Modern Philosophy
* African Philosophy
* Political Philosophy
* Philosophy of Science
* Philosophy of Religion
* Aesthetics
* Existentialism
* Critical Thinking
* Research Methods
* Senior Essay

### **Civics & Ethical Studies**
* Introduction to Civics
* State, Governance & Citizenship
* Democracy & Human Rights
* Ethiopian Constitution
* Federalism
* Ethics & Morality
* Professional Ethics
* Global Affairs
* Peace & Conflict Resolution
* Research Methods
* Community Service
* Senior Paper

### **Political Science & International Relations**
* Introduction to Political Science
* Political Theory
* Comparative Politics
* International Relations Theory
* Foreign Policy Analysis
* International Law
* International Organizations
* Political Economy
* Public Administration
* Ethiopian Politics
* African Politics
* Conflict & Security Studies
* Diplomacy
* Research Methods
* Senior Thesis

### **Psychology**
* Introduction to Psychology
* Developmental Psychology
* Social Psychology
* Cognitive Psychology
* Abnormal Psychology
* Personality Theories
* Biological Psychology
* Psychological Testing
* Counseling Psychology
* Health Psychology
* Industrial/Organizational Psychology
* Research Methods & Statistics
* Experimental Psychology
* Practicum
* Senior Project

### **Governance & Development Studies**
* Governance Theories
* Development Theories
* Public Policy Analysis
* Decentralization & Local Governance
* Human Rights & Development
* Gender & Governance
* Project Planning & Management
* Monitoring & Evaluation
* Research Methods
* Field Attachment
* Capstone Project

### **Federal Studies**
* Theories of Federalism
* Comparative Federal Systems
* Ethiopian Federalism
* Intergovernmental Relations
* Fiscal Federalism
* Constitutional Law in Federations
* Conflict Management in Federations
* Research Seminar
* Policy Analysis Project

### **Peace & Conflict Studies**
* Peace & Conflict Theories
* Conflict Analysis
* Conflict Resolution
* Conflict Transformation
* Peacebuilding
* Negotiation & Mediation
* Human Security
* Gender, Peace & Security
* Research Methods
* Field Work/Simulation
* Capstone Project

### **Security & Intelligence Studies**
* Introduction to Security Studies
* Intelligence Analysis
* National Security Policy
* Cyber Security
* Terrorism & Counterterrorism
* Border Security
* Criminal Intelligence
* Research Methods
* Case Studies
* Simulation Exercises

### **Ethiopian Languages & Literature (e.g., Amharic, Oromo)**
* Grammar (Advanced)
* Phonetics & Phonology
* Morphology & Syntax
* Literature (Traditional & Modern)
* Poetry
* Prose (Fiction & Non-fiction)
* Drama
* Folklore & Oral Traditions
* Literary Criticism
* Translation Theory & Practice
* Language Teaching Methods
* Research Methods
* Creative Writing Project

### **English Language & Literature**
* English Grammar
* Phonetics & Phonology
* Advanced Writing
* Introduction to Literature
* Poetry
* Drama
* Novel
* Literary Theory & Criticism
* World Literature in English
* African Literature
* American Literature
* English Language Teaching (ELT)
* Research Methods
* Senior Thesis/Creative Project

### **Linguistics**
* Introduction to Linguistics
* Phonetics & Phonology
* Morphology
* Syntax
* Semantics
* Pragmatics
* Sociolinguistics
* Psycholinguistics
* Historical Linguistics
* Applied Linguistics
* Field Methods
* Language Documentation
* Research Project

### **Journalism & Communication**
* Introduction to Mass Communication
* News Writing & Reporting
* Editing
* Media Law & Ethics
* Broadcast Journalism
* Photojournalism
* Feature Writing
* Public Relations
* Advertising
* Development Communication
* Media Management
* Research Methods
* Internship
* Senior Production/Thesis

### **Literature** (as a standalone field)
* Literary Theory
* Comparative Literature
* Genre Studies
* Critical Approaches
* Major Authors
* Literary Movements
* Research Seminar
* Thesis

### **Theater Arts**
* Acting I, II & III
* Directing
* Stagecraft
* Playwriting
* Theater History
* Ethiopian Traditional Theater
* Costume & Makeup
* Lighting & Sound Design
* Theater Management
* Production Workshop
* Senior Production

### **Music**
* Music Theory I, II & III
* Sight Singing & Ear Training
* Ethiopian Music History
* Western Music History
* Music Composition
* Conducting
* Instrument/Voice Major
* Ensemble
* Music Technology
* Music Education
* Senior Recital/Project

### **Fine Art & Design**
* Drawing I, II & III
* Painting I & II
* Sculpture
* Graphic Design
* Color Theory
* Art History
* Ethiopian Traditional Arts
* Digital Arts
* Photography
* Exhibition Design
* Portfolio Development
* Senior Exhibition

---

## **Law**

### **Law (LLB)**
* Introduction to Law
* Constitutional Law
* Criminal Law I & II
* Law of Contract I & II
* Property Law
* Administrative Law
* Commercial Law
* Labor Law
* Family Law
* Succession Law
* Law of Evidence
* Civil Procedure
* Criminal Procedure
* International Law
* Human Rights Law
* Environmental Law
* Tax Law
* Legal Research & Writing
* Moot Court
* Legal Ethics
* Internship

---

## **Education (Pedagogy)**

### **Professional Education Core Courses**
* Foundations of Education
* Educational Psychology
* Curriculum Studies
* Instructional Methods & Strategies
* Educational Technology
* Classroom Management
* Assessment & Evaluation
* Special Needs/Inclusive Education
* Action Research in Education
* Practicum I, II & III (Teaching Practice)

### **Subject-Specific Pedagogy Courses**
* Methods of Teaching Biology
* Methods of Teaching Chemistry
* Methods of Teaching English as a Foreign Language (TEFL)
* Methods of Teaching Geography

### **Educational Planning & Management**
* Educational Planning
* Educational Economics & Finance
* Human Resource Management in Education
* Educational Supervision
* School Leadership
* Project Planning in Education
* Policy Analysis
* Research Methods
* Internship in Educational Administration

### **Special Needs Education**
* Introduction to Special Needs
* Assessment in Special Education
* Inclusive Education Strategies
* Teaching Students with Learning Disabilities
* Teaching Students with Intellectual Disabilities
* Sensory Impairments (Visual & Hearing)
* Physical & Health Impairments
* Behavior Management
* Assistive Technology
* Practicum in Special Education Settings

### **Early Childhood Care & Education**
* Child Development
* Early Childhood Curriculum
* Play & Learning
* Health, Nutrition & Safety
* Language Development in Early Years
* Creative Arts for Young Children
* Working with Families
* Administration of ECCE Centers
* Practicum in ECCE

### **Curriculum & Instruction**
* Curriculum Theory
* Curriculum Design & Development
* Instructional Design
* Textbook Analysis
* Curriculum Evaluation
* Teacher Education
* Comparative Curriculum Studies
* Research in Curriculum
* Project

### **Educational Psychology**
* Learning Theories
* Cognitive Development
* Social & Emotional Development
* Motivation in Education
* Measurement of Mental Abilities
* Counseling in Schools
* Adolescent Psychology
* Research Methods in Educational Psychology
* Practicum

### **School Leadership**
* Principles of Educational Leadership
* School Improvement
* Instructional Leadership
* School-Community Relations
* Financial Management in Schools
* Legal Aspects of Education
* Data-Driven Decision Making
* Internship for School Leaders

---

## **Emerging & Interdisciplinary Fields**

### **Development Studies**
* Theories of Development
* Poverty Analysis
* Rural Development
* Urban Development
* Gender & Development
* Sustainable Development
* Project Planning & Management
* Monitoring & Evaluation
* Research Methods
* Field Work
* Capstone Project

### **Gender & Development Studies**
* Feminist Theories
* Gender Analysis
* Gender Mainstreaming
* Women's Rights
* Masculinity Studies
* Gender, Conflict & Peace
* Gender Policy
* Research Methods
* Advocacy Project

### **Urban & Regional Planning**
* Introduction to Planning
* Planning Theory
* Urban Design
* Land Use Planning
* Transportation Planning
* Housing Planning
* Environmental Planning
* GIS for Planning
* Planning Law
* Studio I, II & III (Practical Projects)
* Internship

### **Real Estate Management**
* Property Law
* Real Estate Economics
* Property Valuation
* Real Estate Finance
* Property Management
* Real Estate Development
* Urban Economics
* Case Studies
* Internship

### **Disaster Risk Management & Sustainable Development**
* Hazards & Vulnerability
* Disaster Risk Reduction
* Emergency Management
* Climate Change Adaptation
* Recovery & Reconstruction
* Community-Based DRR
* Research Methods
* Field Simulation/Project

### **Information Science**
* Information Organization
* Knowledge Management
* Information Retrieval
* Digital Libraries
* Database Management
* Information Policy
* Research Methods
* Practicum

### **Library Science**
* Collection Development
* Cataloging & Classification
* Reference Services
* Library Management
* Children's Librarianship
* Academic Libraries
* Digital Librarianship
* Practicum

### **Archives & Records Management**
* Archival Principles
* Records Lifecycle
* Preservation & Conservation
* Digital Archives
* Archives Administration
* Legal & Ethical Issues
* Practicum

### **Aviation**
* Pilot Aerodynamics
* Flight Operations
* Navigation
* Meteorology
* Aircraft Systems
* Simulator Training
* Flight Training
* Aircraft Structures
* Propulsion Systems
* Maintenance Procedures
* Regulations
* Airport Operations
* Airline Management
* Aviation Safety
* Aviation Law
* Aviation Economics

### **Maritime Studies**
* Nautical Science
* Marine Engineering
* Port Management
* Maritime Law
* Shipping Logistics
* Navigation
* Safety at Sea
* Simulator Training/Sea Time
`;

const generateDeptCode = (name) => {
  return name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
};

const generateCourseCode = (deptCode, index) => {
  return deptCode + (index + 201).toString(); // Start from 201 to avoid most overlaps with Batch 1 if codes match
};

const seedBatch2Data = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected for Batch 2 seeding.');

        const lines = data.split('\n');
        let currentCategory = '';
        let currentDepartment = null;
        let courseIndex = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('## ')) {
                currentCategory = line.replace(/## |\*\*|/g, '').trim();
                console.log('--- Category: ' + currentCategory + ' ---');
            } else if (line.startsWith('### ')) {
                const deptName = line.replace(/### |\*\*|/g, '').trim();
                const deptCode = generateDeptCode(deptName);
                
                let dept = await Department.findOne({ where: { code: deptCode } });
                if (!dept) {
                    dept = await Department.create({
                        name: deptName,
                        code: deptCode,
                        description: 'Department of ' + deptName + ' under ' + currentCategory
                    });
                    console.log('  Created Department: ' + deptName + ' (' + deptCode + ')');
                } else {
                    console.log('  Found Department: ' + deptName + ' (' + deptCode + ')');
                }
                
                currentDepartment = dept;
                courseIndex = 0;
            } else if (line.startsWith('* ') || line.startsWith('- ')) {
                if (!currentDepartment) continue;
                
                const courseName = line.substring(2).trim();
                const courseCode = generateCourseCode(currentDepartment.code, courseIndex);
                
                let course = await Course.findOne({ where: { code: courseCode } });
                if (!course) {
                    try {
                        await Course.create({
                            name: courseName,
                            code: courseCode,
                            description: 'Comprehensive course for ' + courseName,
                            credits: 3,
                            departmentId: currentDepartment.id
                        });
                        console.log('    + ' + courseName + ' (' + courseCode + ')');
                    } catch (err) {
                        console.error('    x Failed to create ' + courseName + ': ' + err.message);
                    }
                } else {
                    console.log('    . ' + courseName + ' already exists');
                }
                
                courseIndex++;
            }
        }

        console.log('✓ Batch 2 seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Major error in Batch 2 seeding:', error);
        process.exit(1);
    }
};

seedBatch2Data();
