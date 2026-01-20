const { Department, Course, Topic, sequelize } = require('./models');

const rawData = `
A in Amharic Language, Literature and Folklore
UG
BA in Arabic Language and Communication
UG
BA in Chinese Language
UG
BA in Educational Planning & Management
UG
BA in English Language and Literature
UG
BA in Ethiopian Sign Language and Interpreting
UG
BA in Geography and Development Studies
UG
BA in History and Heritage Studies
UG
BA in Journalism and Communication (Broadcast Journalism) with Journalism and Communication (Multimedia)
UG
BA in Music
UG
BA in Oromo Literature and Communication
UG
BA in Political Science & International Relations
UG
BA in Psychology
UG
BA in Public Relations and Strategic Communication
UG
BA in Social Work
UG
BA in Theater Arts with Film Studies
UG
Bachelor of Arts in Accounting and Finance
UG
Bachelor of Arts in Business Administration and Information Systems
UG
Bachelor of Arts in Economics
UG
Bachelor of Arts in Logistics and Supply Chain Management
Bachelor of Arts in Management
UG
Bachelor of Arts in Marketing Management
UG
Bachelor of Arts in Public Administration & Development
UG
Bachelor of Degree in Veterinary Science (BVSc)
UG
Bachelor of Laws
UG
Bachelor of Science in Biology
UG
Bachelor of Science in Biomedical Engineering
UG
Bachelor of Science in Chemical Engineering
UG
Bachelor of Science in Chemistry
UG
Bachelor of Science in Civil Engineering
UG
Bachelor of Science in Civil Engineering
UG
Bachelor of Science in Computer Science
UG
Bachelor of Science in Electrical and Computer Engineering
UG
Bachelor of Science in Geology
UG
Bachelor of Science in Information Systems
UG
Bachelor of Science in Mathematics
UG
Bachelor of Science in Mechanical Engineering
UG
Bachelor of Science in Physics
UG
Bachelor of Science in Software Engineering and Computing Technology (Cyber security, artificial intelligence, Software Engineering, Information technology}
UG
Bachelor of Science in Statistics
UG
BEd in Civics and Ethical Education
UG
BEd in Physical Education
UG
BEd in Special Needs and Inclusive Education
UG
BFA in Fine Arts and Design
UG
BSc in Anesthesia
UG
BSc in Architecture and Design
UG
BSc in Construction Technology Management
UG
BSc in Exercise and Sport
UG
BSc in Medical Laboratory Sciences
UG
BSc in Medical Radiologic Technology
UG
BSc in Midwifery
UG
BSc in Nursing
UG
BSc in Pharmacy
UG
BSc in Urban and Regional Planning
UG
Doctor of Dental Medicine
UG
Doctor of Medicine
UG
Doctor of Philosophy in Law
PhD
Doctor of Veterinary Medicine (DVM)
UG
Executive Master's in Managing Peace and Security in Africa
MSc
MA in African studies
MSc
MA in Applied Developmental Psychology
MSc
MA in Archeology and Museum Studies
MSc
MA in Business Information Systems
MSc
MA in Business Leadership
MSc
MA in Counseling Psychology
MSc
MA in Early Childhood Care and Education
MSc
MA in Education leadership and Management (four concentration areas: Educational Planning and Project Management, Higher Education Management and Policy, Supervision, and Human
MSc
MA in English Language Teaching
MSc
MA in Ethiopian Literature and Folklore
MSc
MA in Ethnomusicology
MSc
MA in Film Production
MSc
MA in Fine Arts
MSc
MA in Global Studies focusing on Peace and Security in Africa (Joint)
MSc
MA in History
MSc
MA in Indigenous Knowledge Systems of Ethiopia
MSc
MA in Journalism and Communication with a specialty Broadcast Journalism
MSc
MA in Journalism and Communication with a specialty Multimedia Journalism
MSc
MA in Language Sciences
MSc
MA in Logistics and Supply Chain Management
MSc
MA in Marketing Management (Marketing Management Track and Digital Marketing and E-commerce Track)
MSc
MA in Multimedia Theatre
MSc
MA in Peace and Security Studies
MSc
MA in Philology
MSc
MA in Philosophy
MSc
MA in Political Science
MSc
MA in Project Management
MSc
MA in Public Relations and Strategic Communication
MSc
MA in Social Psychology
MSc
MA in Social Work
MSc
MA in Special Needs and Inclusive Education
MSc
MA in Speech and Language Therapy (A joint program)
MSc
MA in Teaching Afan Oromo
MSc
MA in Teaching Amharic
MSc
MA in Teaching Chinese to Speakers of Other Languages (MTCSOL)
MSc
MA in Teaching French as a Foreign Language
MSc
MA in Translation
MSc
MA in Urban and Regional Development and Planning
MSc
MA International Relations and Diplomacy
MSc
Master of Business Administration (MBA)
MSc
Master of Laws (LL.M) in Business and Property Law
MSc
Master of Laws (LL.M) in Criminal Justice
MSc
Master of Laws (LL.M) in Public International Law
MSc
Masters in Constitutional and Federalism Studies
MSc
Masters in Human Rights (with tracks LLM/MA)
MSc
Masters of Public Health (General)
MSc
MEd in Afan Oromo and Literature
MSc
MEd in Civics and Ethical Education
MSc
MEd in Geography and Environmental Education
MSc
MEd in Science and Mathematics Education (with four tracks: Biology, Chemistry, Physics, Mathematics)
MSc
MEd in Teaching Amharic
MSc
MPH in Environmental and Occupational Health
MSc
MPH in Epidemiology and Biostatistics
MSc
MPH in Field Epidemiology
MSc
MPH in Health Economics
MSc
MPH in Health Promotion and Health Education
MSc
MPH in Health Systems Management and Health Policy
MSc
MPH in Public Health Nutrition
MSc
MPH in Reproductive, Family and Population Health
MSc
MSc Advanced Nursing Practice
MSc
MSc in Accounting and Finance
MSc
MSc in Anesthesia
MSc
MSc in Animal Production
MSc
MSc in Applied Geoinformatics
MSc
MSc in Applied Microbiology
MSc
MSc in Aquatic Ecosystems Management
MSc
MSc in Bioinformatics
MSc
MSc in Cardio Cardiovascular Perfusion
MSc
MSc in Chemical Engineering (Environmental Engineering)
MSc
MSc in Chemical Engineering (Food Engineering)
MSc
MSc in Chemical Engineering (Industrial Biotechnology and Biochemical Engineering)
MSc
MSc in Chemical Engineering (Process Engineering)
MSc
MSc in Chemistry (Analytical, Organic, Inorganic and Physical)
MSc
MSc in Civil and Environmental Engineering (Dam and Hydropower Engineering)
MSc
MSc in Civil and Environmental Engineering (Hydraulics Engineering)
MSc
MSc in Civil and Environmental Engineering (Water Supply and Environmental Engineering)
MSc
MSc in Civil Engineering (Geotechnical Engineering)
MSc
MSc in Civil Engineering (Road and Transport Engineering) [with track in transport and traffic Engineering and traffic safety system track]
MSc
MSc in Civil Engineering (Structural Engineering)
MSc
MSc in Clinical Laboratory Sciences (Clinical Chemistry)
MSc
MSc in Clinical Laboratory Sciences (Diagnostic & Public Health Microbiology)
MSc
MSc in Clinical Laboratory Sciences (Hematology & Immunohematology
MSc
MSc in Clinical Pharmacy
MSc
MSc in Clinical Psychology
MSc
MSc in Clinical Trials
MSc
MSc in Communication Engineering
MSc
MSc in Community Nutrition and Dietetics
MSc
MSc in Computational Data Science
MSc
MSc in Computer Engineering
MSc
MSc in Computer Science
MSc
MSc in Conservation of Urban and Architectural Heritage
MSc
MSc in Control and Automation (Sugar Engineering)
MSc
MSc in Control Engineering
MSc
MSc in Cyber security (With Cybersecurity Governance and Management track, Network and Systems Security track, Cryptography, Cyber Intelligence and Warfare track, Digital Forensic and Cybercrime Investigation track)
MSc
MSc in Data Science
MSc
MSc in Development Studies (with Environment and Sustainable Development track & Rural Livelihoods Development track)
MSc
MSc in Economic Geology (with Mineral Resources track, Petroleum and Coal track, and Geothermal Energy track)
MSc
MSc in Economics
MSc
MSc in Electrical Power Engineering
MSc
MSc in Emergency Nursing
MSc
MSc in Environment and Natural Resource Management
MSc
MSc in Environmental Science
MSc
MSc in Financial Economics and Investment Management
MSc
MSc in Food Science and Nutrition
MSc
MSc in Food Security and Development
MSc
MSc in Gender Studies
MSc
MSc in Genetics and Molecular Biology
MSc
MSc in Geological Engineering (with Engineering Geology track & Environmental Geology and Geohazards track)
MSc
MSc in Geomatics Engineering
MSc
MSc in Geophysics (with tracks; Applied Geophysics and Solid Earth Geophysics
MSc
MSc in Geophysics (with tracks; Applied Geophysics and Solid Earth Geophysics)
MSc
MSc in Geosciences (with tracks; Geochemistry-Petrology, Paleontology-Paleoanthropology and Paleoenvironment, Stratigraphy and Sedimentology, and Structural Geology)
MSc
MSc in GIS and Remote Sensing and Digital Cartography
MSc
MSc in Health Informatics
MSc
MSc in Hydrogeology
MSc
MSc in Industrial Engineering (with Systems Engineering and Technology track and Innovation Management track)
MSc
MSc in Infection Biology
MSc
MSc in Information Science and Systems (with Information and Data Science track & Information Systems track)
MSc
MSc in Infrastructure Planning and Management
MSc
MSc in Integrated Architectural Design
MSc
MSc in International Business
MSc
MSc in Laboratory Management & Quality Assurance
MSc
MSc in Landscape Architecture
MSc
MSc in Language Technology
MSc
MSc in Management
MSc
MSc in Material Sciences and Engineering
MSc
MSc in Mathematics
MSc
MSc in Mechanical Engineering (Manufacturing Engineering)
MSc
MSc in Mechanical Engineering (Mechanical Design Engineering)
MSc
MSc in Mechanical Engineering (Thermal Engineering)
MSc
MSc in Medical Anatomy
MSc
MSc in Medical Biochemistry
MSc
MSc in Medical Microbiology
MSc
MSc in Medical Physiology
MSc
MSc in Medicinal Chemistry
MSc
MSc in Neonatal Nursing
MSc
MSc in Nursing
MSc
MSc in One Health
MSc
MSc in Pharmaceutical Analysis and Quality Assurance
MSc
MSc in Pharmaceuticals
MSc
MSc in Pharmacognosy
MSc
MSc in Pharmacology
MSc
MSc in Physics (Laser Spectroscopy, Space Physics, Polymer Physics, Atmospheric Physics, Condensed Matter Physics, Astronomy and Astrophysics, Nuclear Physics, Statistical Physics and Modelling, and Quantum Optics and Information)
MSc
MSc in Plant Biology & Biodiversity Management
MSc
MSc in Policy-Interface on Biodiversity and Ecosystem Service
MSc
MSc in Population Studies
MSc
MSc in Poultry Health and Management
MSc
MSc in Property Valuation and Management
MSc
MSc in Railway Engineering (Civil Infrastructure)
MSc
MSc in Railway Engineering (Rolling Stock Engineering)
MSc
MSc in Railway Engineering (Traction and Train Control)
MSc
MSc in Regional and Local Development Analysis and Planning
MSc
MSc in Regulatory Affairs (Medicine Regulation)
MSc
MSc in Renewable Energy Technology Engineering
MSc
MSc in Social and Administrative Pharmacy
MSc
MSc in Sport Science
MSc
MSc in Statistics
MSc
MSc in Sustainable Housing and Environment
MSc
MSc in Tourism Development and Management
MSc
MSc in Tropical Infectious Diseases, Vet Epidemiology and Public Health
MSc
MSc in Urban Planning and Design
MSc
MSc in Veterinary Biotechnology with focus on Animal Health
MSc
MSc in Veterinary Clinical Sciences
MSc
MSc in Veterinary Microbiology and Parasitology
MSc
MSc in Veterinary Pharmacology and Toxicology
MSc
MSc in Wastewater Management
MSc
MSc in Water Management (with Water and Development track, Water Quality Management track, Hydrology and Water Resources Management track)
MSc
MSc in Water Resources Engineering and Management
MSc
MSc in Water Sanitation and Health
MSc
MSc in Zoological Science (Aquatic Ecosystems and Environmental Management)
MSc
MSc in Zoological Science (Insect Science)
MSc
MSc in Zoological Sciences (Ecological and Systematic Zoology)
MSc
MSc/ MEng in Biomedical Engineering (Biomechanics and Rehabilitation)
MSc
MSc/ MEng in Biomedical Engineering (Instrumentation and Imaging)
MSc
MSc/MEng in Artificial Intelligence
MSc
PhD in Environmental Science
PhD
PhD in Accounting and Finance (Accounting track and Finance track
PhD
PhD in Afan Oromo and Folklore
PhD
PhD in African Studies
PhD
PhD in Animal Production
PhD
PhD in Applied Developmental Psychology
PhD
PhD in Applied Microbiology
PhD
PhD in Aquatic Ecosystems Management
PhD
PhD in Archeology and Heritage Management
PhD
PhD in Biomedical Engineering
PhD
PhD in Business Leadership
PhD
PhD in Chemical Engineering (Environmental Engineering)
PhD
PhD in Chemical Engineering (Food Engineering)
PhD
PhD in Chemical Engineering (Process Engineering)
PhD
PhD in Chemistry (Analytical, Organic, Inorganic and Physical)
PhD
PhD in Civil and Environmental Engineering (Hydraulics and Hydrology Engineering)
PhD
PhD in Civil and Environmental Engineering (Water Supply and Environmental Engineering)
PhD
PhD in Civil Engineering (Construction Engineering and Management)
PhD
PhD in Civil Engineering (Geotechnical Engineering)
PhD
PhD in Civil Engineering (Irrigation and Drainage Engineering)
PhD
PhD in Civil Engineering (Road and Transportation Engineering)
PhD
PhD in Civil Engineering (Structural Engineering)
PhD
PhD in Clinical Pharmacy
PhD
PhD in Communication Engineering
PhD
PhD in Computer Engineering
PhD
PhD in Control Engineering
PhD
PhD in Counseling Psychology
PhD
PhD in Curriculum Studies
PhD
PhD in Cyber security
PhD
PhD in Development Studies (with Rural Livelihoods and Development track & Environment and Development track)
PhD
PhD in Disaster Risk Management and Development
PhD
PhD in Early Childhood Education and Development
PhD
PhD in Economic Geology (Mineral Resources)
PhD
PhD in Economics
PhD
PhD in Educational Policy, Leadership and Management (with two concentration areas: Educational Policy and Leadership and Higher Education Leadership and Management)
PhD
PhD in Educational Psychology
PhD
PhD in Electrical Power Engineering
PhD
PhD in English Language Teaching
PhD
PhD in English Literature
PhD
PhD in Environment and Natural Resources Management
PhD
PhD in Environmental and Landscape Planning
PhD
PhD in Ethiopian Literature and Folklore
PhD
PhD in Ethiopian Philology
PhD
PhD in Federalism and Governance Studies
PhD
PhD in Food Science and Human Nutrition
PhD
PhD in Food Security and Development
PhD
PhD in Genetics and Biotechnology
PhD
PhD in Geophysics (with tracks; Applied Geophysics and Seismology)
PhD
PhD in Geophysics (with tracks; Applied Geophysics and Seismology)
PhD
PhD in Geospatial Sciences
PhD
PhD in Higher Education Studies
PhD
PhD in History
PhD
PhD in Human Rights
PhD
PhD in Hydrogeology
PhD
PhD in Industrial Engineering
PhD
PhD in Industrial Management
PhD
PhD in Infection Biology
PhD
PhD in Information Technology (with Information Systems track and Language Technology track)
PhD
PhD in International Business and Strategy
PhD
PhD in International Comparative Education
PhD
PhD in Language Sciences
PhD
PhD in Logistics and Supply Chain Management
PhD
PhD in Management
PhD
PhD in Material Sciences
PhD
PhD in Mathematics
PhD
PhD in Mechanical Engineering (Applied Mechanics)
PhD
PhD in Mechanical Engineering (Manufacturing Engineering)
PhD
PhD in Mechanical Engineering (Thermal Engineering)
PhD
PhD in Media and Communications Studies
PhD
PhD in Medical Anatomy
PhD
PhD in Medical Biochemistry
PhD
PhD in Medical Microbiology
PhD
PhD in Medical Physiology
PhD
PhD in Mental Health Epidemiology
PhD
PhD in Nursing
PhD
PhD in One Health
PhD
PhD in Peace and Security
PhD
PhD in Performing Arts
PhD
PhD in Pharmaceutics
PhD
PhD in Pharmacognosy
PhD
PhD in Pharmacology
PhD
PhD in Philosophy
PhD
PhD in Physics (Laser Spectroscopy, Space Physics, Polymer Physics, Atmospheric Physics, Condensed Matter Physics, Astronomy and Astrophysics, Nuclear Physics, Statistical Physics and Modelling, and Quantum Optics and Information)
PhD
PhD in Plant Biology & Biodiversity Management
PhD
PhD in Political Science
PhD
PhD in Population Studies
PhD
PhD in Public Health
PhD
PhD in Public Health Nutrition
PhD
PhD in Public Management and Policy
PhD
PhD in Railway Engineering and Management (Civil Infrastructure and Engineering)
PhD
PhD in Railway Engineering and Management (Railway System Management)
PhD
PhD in Railway Engineering and Management (Rolling Stock Engineering)
PhD
PhD in Railway Engineering and Management (Traction and Train Control Engineering)
PhD
PhD in Science and Mathematics Education (with four tracks: Biology, Chemistry, Physics, Mathematics)
PhD
PhD in Social and Administrative Pharmacy
PhD
PhD in Social Psychology
PhD
PhD in Social Work and Social Development
PhD
PhD in Special Needs Education
PhD
PhD in Sport Science
PhD
PhD in Statistics
PhD
PhD in Sustainable Development (Center)
PhD
PhD in Teaching Amharic
PhD
PhD in Translational Medicine
PhD
PhD in Urban and Regional Planning
PhD
PhD in Urban, Regional Development Planning and Governance
PhD
PhD in Veterinary Sciences
PhD
PhD in Water and Health (with Water and Wastewater treatment track & Water and Public Health track)
PhD
PhD in Water Management
PhD
PhD in Water Management
PhD
PhD in Water Resources Engineering and Management
PhD
PhD in Zoological Science (Aquatic Science, Fisheries & Aquaculture)
PhD
PhD in Zoological Science (Insect Science)
PhD
PhD in Zoological Science (Wildlife Ecology and Conservation)
Resources and Organizational Development (HROD)
Specialty in Anesthesiology Critical Care and Pain Medicine
SPECIALITY
Specialty in Clinical Oncology
SPECIALITY
Specialty in Dermatovenereology
SPECIALITY
Specialty in Emergency and Critical Care Medicine
SPECIALITY
Specialty in ENT (Otorhinolaryngology Head and Neck Surgery)
SPECIALITY
Specialty in Family Medicine
SPECIALITY
Specialty in General surgery
SPECIALITY
Specialty in Internal Medicine
SPECIALITY
Specialty in Neurology
SPECIALITY
Specialty in Neurosurgery
SPECIALITY
Specialty in Nuclear Medicine
SPECIALITY
Specialty in Obstetrics and Gynecology
SPECIALITY
Specialty in Ophthalmology
SPECIALITY
Specialty in Oral and Maxillofacial Surgery
SPECIALITY
Specialty in Orthopedics and Trauma Surgery
Specialty in Pathology
SPECIALITY
Specialty in Pediatric and Child Health
SPECIALITY
Specialty in Plastic and Reconstructive Surgery
SPECIALITY
Specialty in Psychiatry
SPECIALITY
Specialty in Radiology
SPECIALITY
Specialty in Thoracic Surgery
SPECIALITY
Specialty in Urology
SPECIALITY
Subspecialty in Adult Cardiology
SUB_SPECIALITY
Subspecialty in Adult Clinical Hematology
SPECIALITY
Subspecialty in Adult Nephrology
SUB_SPECIALITY
Subspecialty in Body Imaging
SUB_SPECIALITY
Subspecialty in Cardio Thoracic Anesthesia
SUB_SPECIALITY
Subspecialty in Cardiothoracic Radiology
SUB_SPECIALITY
Subspecialty in Cardiothoracic Surgery
SUB_SPECIALITY
Subspecialty in Child and Adolescent Psychiatry
SUB_SPECIALITY
Subspecialty in Clinical Pediatric Hematology & Oncology
SUB_SPECIALITY
Subspecialty in Colorectal Surgery
SUB_SPECIALITY
Subspecialty in Endocrine and Breast Surgery
SUB_SPECIALITY
Subspecialty in Endocrinology and Metabolism
SUB_SPECIALITY
Subspecialty in Gastroenterology and Hepatology (with two tracks Pediatrics and Adult)
SUB_SPECIALITY
Subspecialty in Glaucoma
SUB_SPECIALITY
Subspecialty in Gynecology Oncology
SUB_SPECIALITY
Subspecialty in Hepatobiliary Surgery
SUB_SPECIALITY
Subspecialty in Infectious Disease (Pediatric and Adult tracks)
SUB_SPECIALITY
Subspecialty in Maternal and Fetal Medicine
SUB_S
Subspecialty in Musculoskeletal Radiology
SUB_SPECIALITY
Subspecialty in Neonatology
SUB_SPECIALITY
Subspecialty in Neuroradiology
SUB_SPECIALITY
Subspecialty in Orthopedic Trauma Surgery
SUB_SPECIALITY
Subspecialty in Pediatric Emergency and Critical Care
SUB_SPECIALITY
Subspecialty in Pediatric Radiology
SUB_SPECIALITY
Subspecialty in Pediatrics Cardiology
SUB_SPECIALITY
Subspecialty in Pediatrics Nephrology
SUB_SPECIALITY
Subspecialty in Pediatrics Neurology
SUB_SPECIALITY
Subspecialty in Plastic and Constructive Surgery
SUB_SPECIALITY
Subspecialty in Plastic and Constructive Surgery
SUB_SPECIALITY
Subspecialty in Pulmonary and Critical Care Medicine (with two tracks: Pediatrics and Adult)
SUB_SPECIALITY
Subspecialty in Reproductive Endocrinology and Infertility
SUB_SPECIALITY
Subspecialty in Urogynecology and Pelvic Floor Reconstructive Surgery
SUB_SPECIALITY
Subspecialty in Vascular Surgery
SUB_SPECIALITY
`;

const cleaningPrefixes = [
    /^.+? in /i, // More aggressive: remove anything before " in " e.g. "BA in", "MA in", "A in"
    /^Bachelor of Arts in /i,
    /^Bachelor of Science in /i,
    /^BSc in /i,
    /^BEd in /i,
    /^BFA in /i,
    /^MA in /i,
    /^MSc in /i,
    /^PhD in /i,
    /^MPH in /i,
    /^MEd in /i,
    /^MSc\/ MEng in /i,
    /^Master of Business Administration \(/i,
    /^Master of Laws \(LL\.M\) in /i,
    /^Master of Laws \(LL\.M\)/i,
    /^Master of /i,
    /^Masters in /i,
    /^Masters of /i,
    /^Doctor of Philosophy in /i,
    /^Doctor of /i,
    /^Specialty in /i,
    /^Subspecialty in /i,
    /^Executive Master's in /i,
    /^Bachelor of Laws/i,
    /^Bachelor of Degree in /i
];

const degreeMarkers = new Set([
    'UG', 'MSc', 'PhD', 'SPECIALITY', 'SUB_SPECIALITY', 'SUB_S', 'SPECIALTY'
]);

const cleanName = (name) => {
    let clean = name.trim();
    if (!clean || degreeMarkers.has(clean)) return null;

    // Apply specific prefixes first
    cleaningPrefixes.forEach(p => {
        clean = clean.replace(p, '');
    });

    // Remove text like " (four concentration areas...)" or " (with tracks...)" to keep it pure
    clean = clean.replace(/\(.*?\)/g, '');
    clean = clean.replace(/\(.*?$/g, ''); // Unclosed parenthesis
    clean = clean.replace(/\[.*?\]/g, '');
    clean = clean.replace(/\{.*?\}/g, '');
    clean = clean.replace(/\s*with.*$/i, ''); // Remove "with Film Studies" etc.
    
    // Final trim and cleanup
    clean = clean.split('\n')[0].trim();
    
    // Remove "at" or "in" if it survived at the very beginning
    clean = clean.replace(/^in /i, '');
    
    if (clean.length < 2) return null;

    // Normalize case to Title Case
    return clean.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const runSeeding = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');

        const lines = rawData.split('\n');
        const departments = new Set();
        
        lines.forEach(line => {
            const cleaned = cleanName(line);
            if (cleaned && cleaned.length > 2) {
                departments.add(cleaned);
            }
        });

        console.log(`📊 Found ${departments.size} unique departments after cleaning.`);

        console.log('⚠️  Truncating existing tables...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Topic.truncate({ cascade: true });
        await Course.truncate({ cascade: true });
        await Department.truncate({ cascade: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('📚 Seeding new pure AAU Departments...');
        let count = 0;
        for (const name of departments) {
            const code = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4) + (count + 100);
            await Department.create({
                name: name,
                code: code,
                description: `AAU Program: ${name}`
            });
            count++;
        }

        console.log(`✨ Re-seeding Complete! Created ${count} departments.`);
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        process.exit(1);
    }
};

runSeeding();
