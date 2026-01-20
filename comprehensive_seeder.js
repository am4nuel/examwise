const { Department, Course, sequelize } = require('./models');

const data = `
## **Natural & Computational Sciences**

### **Biology**
* General Biology I & II
* Cell Biology
* Genetics
* Molecular Biology
* Microbiology
* Immunology
* Biochemistry
* Biostatistics
* Botany
* Zoology
* Plant Physiology
* Animal Physiology
* Ecology
* Evolutionary Biology
* Developmental Biology
* Parasitology
* Mycology
* Virology
* Biotechnology
* Research Methods in Biology
* Field Biology
* Senior Research Project

### **Chemistry**
* General Chemistry I & II
* Analytical Chemistry
* Organic Chemistry I & II
* Inorganic Chemistry I & II
* Physical Chemistry I & II
* Biochemistry
* Instrumental Analysis
* Industrial Chemistry
* Environmental Chemistry
* Polymer Chemistry
* Food Chemistry
* Pharmaceutical Chemistry
* Computational Chemistry
* Laboratory Safety & Management
* Research Methods in Chemistry
* Senior Research Project

### **Physics**
* General Physics I & II
* Mechanics
* Electricity & Magnetism
* Thermodynamics
* Modern Physics
* Quantum Mechanics
* Solid State Physics
* Nuclear Physics
* Electronics
* Optics
* Mathematical Methods in Physics
* Computational Physics
* Statistical Physics
* Astrophysics
* Geophysics
* Laboratory Techniques
* Research Methods in Physics
* Senior Research Project

### **Mathematics**
* Calculus I, II & III
* Linear Algebra I & II
* Differential Equations
* Real Analysis
* Complex Analysis
* Abstract Algebra
* Number Theory
* Numerical Analysis
* Probability Theory
* Mathematical Statistics
* Operations Research
* Topology
* Geometry
* Discrete Mathematics
* Mathematical Modeling
* History of Mathematics
* Research Seminar
* Senior Project

### **Statistics**
* Probability Theory I & II
* Mathematical Statistics I & II
* Statistical Methods I & II
* Applied Regression Analysis
* Design of Experiments
* Sampling Techniques
* Multivariate Analysis
* Time Series Analysis
* Statistical Computing (R/SAS/SPSS)
* Biostatistics
* Econometrics
* Statistical Quality Control
* Nonparametric Statistics
* Survey Methodology
* Demography
* Operations Research
* Statistical Consulting
* Capstone Project

### **Geology**
* Physical Geology
* Historical Geology
* Mineralogy
* Petrology
* Structural Geology
* Sedimentology
* Stratigraphy
* Paleontology
* Geochemistry
* Geophysics
* Hydrogeology
* Engineering Geology
* Economic Geology
* Field Geology & Mapping
* Remote Sensing & GIS
* Petroleum Geology
* Mining Geology
* Environmental Geology
* Research Methods in Geology
* Senior Field Project

### **Meteorology**
* Introduction to Atmospheric Science
* Climatology
* Dynamic Meteorology
* Synoptic Meteorology
* Physical Meteorology
* Agricultural Meteorology
* Hydrometeorology
* Atmospheric Physics
* Atmospheric Chemistry
* Weather Analysis & Forecasting
* Climate Change Science
* Remote Sensing in Meteorology
* Numerical Weather Prediction
* Air Pollution Meteorology
* Meteorological Instruments
* Tropical Meteorology
* Research Methods
* Weather Forecasting Practicum

### **Sport Science**
* Human Anatomy & Physiology
* Exercise Physiology
* Biomechanics
* Sports Psychology
* Sports Nutrition
* Motor Learning & Control
* Sports Sociology
* Sports Management
* Coaching Theory & Methods
* Training Methodology
* Sports Medicine
* First Aid & Injury Prevention
* Fitness Assessment
* Adapted Physical Education
* Measurement & Evaluation in Sports
* Research Methods in Sport Science
* Practical Coaching
* Internship

### **Computer Science**
* Fundamentals of Computing
* Introduction to Computer Programming
* Object-Oriented Programming
* Data Structures and Algorithms
* Advanced Programming
* Discrete Mathematics I & II
* Calculus I & II
* Linear Algebra
* Probability and Statistics
* Numerical Methods
* Digital Logic Design
* Computer Organization and Architecture
* Database Systems I & II
* Data Communication and Computer Networks I & II
* Operating Systems
* Design and Analysis of Algorithms
* Software Engineering
* Object-Oriented Analysis and Design
* Systems Programming
* Computer Graphics
* Web Programming
* Mobile Application Development
* Compiler Design
* Formal Languages and Automata Theory
* Artificial Intelligence
* Network Administration and Security
* Distributed Systems
* Management Information Systems
* Human-Computer Interaction
* Cloud Computing
* Parallel and Concurrent Programming
* Research Methods in Computer Science
* Professional Ethics in Computing
* Project Management
* Entrepreneurship
* Senior Project / Thesis
* Machine Learning
* Data Mining
* Advanced Databases
* Information Security & Cryptography
* Network Programming
* Image Processing
* Natural Language Processing
* Wireless and Mobile Networks
* Internet of Things (IoT)
* Game Development
* Big Data Analytics

### **Information Technology**
* Introduction to Information Technology
* Programming Fundamentals
* Web Development
* Database Management Systems
* Data Structures
* Computer Networks
* System Analysis & Design
* Information Security
* Multimedia Systems
* E-Commerce Technologies
* Mobile Computing
* Cloud Computing
* IT Project Management
* Human-Computer Interaction
* IT Infrastructure Management
* Software Quality Assurance
* Emerging Technologies
* IT Ethics & Professional Practice
* Capstone Project

### **Information Systems**
* Introduction to Information Systems
* Business Processes
* Database Management
* Systems Analysis & Design
* Enterprise Architecture
* Business Intelligence
* IT Project Management
* ERP Systems
* Decision Support Systems
* Knowledge Management
* E-Business Systems
* Information Systems Security
* IT Governance
* Systems Implementation
* Human Factors in IS
* Research Methods in IS
* Strategic IT Management
* IS Capstone Project

### **Data Science**
* Programming for Data Science
* Statistics for Data Science
* Data Management
* Machine Learning
* Data Visualization
* Big Data Analytics
* Data Mining
* Statistical Learning
* Database Systems
* Cloud Computing for Data Science
* Natural Language Processing
* Time Series Analysis
* Deep Learning
* Data Ethics & Privacy
* Business Intelligence
* Research Methods
* Capstone Data Project
* Internship

### **Cybersecurity**
* Introduction to Cybersecurity
* Network Security
* Cryptography
* Ethical Hacking
* Digital Forensics
* Security Risk Management
* Web Security
* Mobile Security
* Cloud Security
* Security Operations
* Incident Response
* Malware Analysis
* Security Policies & Governance
* Law & Ethics in Cybersecurity
* Penetration Testing
* Secure Software Development
* Capstone Security Project
* Internship

### **Biotechnology**
* Cell Biology
* Molecular Biology
* Genetics
* Microbiology
* Biochemistry
* Immunology
* Genetic Engineering
* Protein Engineering
* Enzyme Technology
* Bioprocess Engineering
* Plant Biotechnology
* Animal Biotechnology
* Environmental Biotechnology
* Pharmaceutical Biotechnology
* Bioinformatics
* Biosafety & Bioethics
* Research Methods
* Industrial Training
* Senior Project

---

## **Engineering & Technology**

### **Civil Engineering**
* Engineering Mechanics I & II
* Engineering Drawing
* Surveying I & II
* Construction Materials
* Fluid Mechanics
* Strength of Materials
* Structural Analysis I & II
* Reinforced Concrete Design I & II
* Steel Structure Design
* Soil Mechanics
* Foundation Engineering
* Highway Engineering
* Hydrology
* Water Resources Engineering
* Environmental Engineering
* Construction Management
* Engineering Economics
* Project Design I & II
* Internship

### **Mechanical Engineering**
* Engineering Drawing
* Workshop Technology
* Engineering Mechanics
* Thermodynamics I & II
* Fluid Mechanics
* Strength of Materials
* Manufacturing Processes
* Machine Design I & II
* Heat Transfer
* Internal Combustion Engines
* Refrigeration & Air Conditioning
* Power Plant Engineering
* CAD/CAM
* Finite Element Analysis
* Control Engineering
* Mechatronics
* Maintenance Engineering
* Project Design I & II
* Internship

### **Electrical Engineering**
* Circuit Theory I & II
* Electromagnetics
* Signals & Systems
* Digital Logic Design
* Electronics I & II
* Electrical Machines I & II
* Power Systems I & II
* Control Systems
* Power Electronics
* Microprocessors
* Communication Systems
* Measurements & Instrumentation
* High Voltage Engineering
* Renewable Energy Systems
* Electrical Installation Design
* Protection & Switchgear
* Project Design I & II
* Internship

### **Computer Engineering**
* Digital Logic Design
* Computer Organization
* Microprocessors
* Data Structures
* Computer Architecture
* Operating Systems
* Embedded Systems
* Computer Networks
* VLSI Design
* Digital Signal Processing
* Hardware-Software Co-design
* Real-Time Systems
* Robotics
* Computer Security
* FPGA Design
* System Programming
* Project Design I & II
* Internship

### **Chemical Engineering**
* Material & Energy Balance
* Fluid Mechanics
* Heat Transfer
* Mass Transfer
* Thermodynamics
* Chemical Reaction Engineering
* Process Control
* Process Equipment Design
* Transport Phenomena
* Separation Processes
* Petroleum Engineering
* Polymer Engineering
* Biochemical Engineering
* Environmental Chemical Engineering
* Process Safety
* Plant Design
* Project Design I & II
* Internship

### **Industrial Engineering**
* Engineering Economy
* Work Study & Ergonomics
* Operations Research I & II
* Production Planning & Control
* Quality Control
* Facility Planning & Design
* Supply Chain Management
* Systems Simulation
* Human Factors Engineering
* Project Management
* Maintenance Engineering
* Cost Analysis
* Information Systems
* Safety Engineering
* Lean Manufacturing
* Production Systems
* Project Design I & II
* Internship

### **Textile Engineering**
* Textile Fibers
* Yarn Manufacturing
* Fabric Manufacturing
* Chemical Processing
* Textile Testing
* Textile Chemistry
* Knitting Technology
* Nonwoven Technology
* Textile Machinery
* Garment Manufacturing
* Textile Design
* Technical Textiles
* Textile Management
* Quality Control
* Environmental Aspects
* Project Design I & II
* Internship

### **Automotive Engineering**
* Automotive Engines
* Vehicle Dynamics
* Automotive Electronics
* Transmission Systems
* Chassis Design
* Automotive Materials
* Vehicle Maintenance
* Alternative Fuel Vehicles
* Automotive Aerodynamics
* Automotive Safety
* Engine Design
* Automotive Manufacturing
* Vehicle Testing
* Automotive Control Systems
* Hybrid Vehicles
* Project Design I & II
* Internship

### **Manufacturing Engineering**
* Manufacturing Processes
* CNC Technology
* CAD/CAM
* Quality Engineering
* Metrology
* Tool Design
* Production Systems
* Robotics in Manufacturing
* Rapid Prototyping
* Composite Materials
* Lean Manufacturing
* Maintenance Engineering
* Manufacturing Automation
* Plant Layout
* Project Design I & II
* Internship

### **Hydraulic & Water Resources Engineering**
* Fluid Mechanics
* Hydrology
* Hydraulics
* Open Channel Flow
* Groundwater Hydrology
* Water Resources Planning
* Irrigation Engineering
* Drainage Engineering
* Dam Engineering
* River Engineering
* Coastal Engineering
* Water Quality
* Hydropower Engineering
* Watershed Management
* Remote Sensing Applications
* Project Design I & II
* Internship

### **Surveying Engineering**
* Plane Surveying
* Geodetic Surveying
* Photogrammetry
* Remote Sensing
* Cartography
* GIS
* GPS Surveying
* Cadastral Surveying
* Engineering Surveys
* Adjustment Computations
* Land Administration
* Hydrographic Surveying
* Mining Surveying
* Survey Law & Ethics
* Project Design I & II
* Field Practice
* Internship

### **Geomatics Engineering**
* Fundamentals of Geomatics
* Geodesy
* Digital Photogrammetry
* Remote Sensing
* GIS
* Land Information Systems
* Cadastral Studies
* Spatial Databases
* Web GIS
* Digital Cartography
* GPS Technology
* Land Management
* Project Design I & II
* Field Work
* Internship

### **Mining Engineering**
* Mining Geology
* Rock Mechanics
* Mine Surveying
* Surface Mining
* Underground Mining
* Mine Ventilation
* Mine Safety
* Mineral Processing
* Mine Economics
* Drilling & Blasting
* Mine Planning
* Environmental Management
* Mine Legislation
* Project Design I & II
* Field Training
* Internship

### **Geological Engineering**
* Engineering Geology
* Rock Mechanics
* Soil Mechanics
* Hydrogeology
* Geotechnical Engineering
* Site Investigation
* Slope Stability
* Foundation Engineering
* Geological Mapping
* Remote Sensing
* Environmental Geology
* Natural Hazards
* Project Design I & II
* Field Camp
* Internship

### **Metallurgical Engineering**
* Thermodynamics
* Transport Phenomena
* Mineral Processing
* Extractive Metallurgy
* Physical Metallurgy
* Mechanical Metallurgy
* Corrosion Engineering
* Foundry Technology
* Welding Technology
* Materials Characterization
* Process Control
* Project Design I & II
* Laboratory Work
* Internship

### **Environmental Engineering**
* Environmental Chemistry
* Water Supply Engineering
* Wastewater Engineering
* Solid Waste Management
* Air Pollution Control
* Environmental Impact Assessment
* Environmental Microbiology
* Environmental Law
* Water Quality Management
* Environmental Systems
* Industrial Waste Treatment
* Project Design I & II
* Laboratory Work
* Internship

### **Software Engineering**
* Programming Fundamentals
* Data Structures
* Object-Oriented Programming
* Software Requirements
* Software Design
* Software Construction
* Software Testing
* Software Maintenance
* Software Project Management
* Software Quality Assurance
* Software Architecture
* Human-Computer Interaction
* Database Systems
* Web Engineering
* Mobile Development
* Capstone Project
* Internship

### **Biomedical Engineering**
* Human Anatomy & Physiology
* Medical Instrumentation
* Biomedical Sensors
* Medical Imaging
* Biomechanics
* Biomaterials
* Rehabilitation Engineering
* Biomedical Signal Processing
* Hospital Engineering
* Medical Equipment Maintenance
* Clinical Engineering
* Regulatory Affairs
* Project Design I & II
* Clinical Rotation
* Internship

### **Aerospace Engineering (Avionics)**
* Aircraft Systems
* Avionics Systems
* Navigation Systems
* Communication Systems
* Flight Control Systems
* Radar Systems
* Aircraft Instruments
* Digital Electronics
* Microprocessors
* Project Design I & II
* Laboratory Work
* Internship

### **Construction Technology & Management**
* Construction Materials
* Construction Methods
* Construction Equipment
* Estimating & Costing
* Construction Planning
* Construction Safety
* Contract Administration
* Project Management
* Quality Management
* Sustainable Construction
* Project Design I & II
* Field Practice
* Internship

### **Railway Engineering**
* Railway Track Engineering
* Railway Signaling
* Railway Operations
* Rolling Stock
* Railway Electrification
* Railway Planning
* Railway Safety
* Project Design I & II
* Laboratory Work
* Internship

### **Water Supply & Sanitary Engineering**
* Water Chemistry
* Water Treatment
* Water Distribution
* Sanitary Engineering
* Plumbing Design
* Water Quality
* Small Water Systems
* Project Design I & II
* Laboratory Work
* Internship

---

## **Agriculture & Environmental Sciences**

### **Plant Sciences**
* General Botany
* Plant Physiology
* Plant Taxonomy
* Genetics & Plant Breeding
* Crop Production
* Plant Pathology
* Weed Science
* Seed Science
* Horticulture
* Pasture & Range Management
* Medicinal Plants
* Research Methods
* Senior Project
* Internship

### **Animal Sciences**
* Animal Anatomy & Physiology
* Animal Nutrition
* Animal Breeding
* Animal Production
* Poultry Science
* Dairy Science
* Meat Science
* Forage Production
* Animal Health
* Biotechnology in Animal Science
* Research Methods
* Senior Project
* Internship

### **Horticulture**
* Pomology
* Olericulture
* Floriculture
* Landscape Design
* Plant Propagation
* Greenhouse Management
* Postharvest Technology
* Fruit Production
* Vegetable Production
* Ornamental Plants
* Research Methods
* Senior Project
* Internship

### **Soil & Water Management**
* Soil Physics
* Soil Chemistry
* Soil Fertility
* Soil Conservation
* Irrigation Principles
* Drainage Engineering
* Watershed Management
* Remote Sensing Applications
* Research Methods
* Senior Project
* Field Practice

### **Agricultural Economics**
* Principles of Economics
* Agricultural Marketing
* Farm Management
* Agricultural Policy
* Agricultural Finance
* Agribusiness Management
* Resource Economics
* Econometrics
* Research Methods
* Senior Project
* Internship

### **Agricultural Extension**
* Extension Methods
* Communication Skills
* Program Planning
* Rural Sociology
* Adult Education
* Gender in Agriculture
* Extension Management
* Monitoring & Evaluation
* Research Methods
* Senior Project
* Field Practice

### **Agricultural Engineering**
* Farm Power & Machinery
* Soil & Water Engineering
* Postharvest Engineering
* Renewable Energy
* Irrigation Engineering
* Farm Structures
* CAD in Agriculture
* Research Methods
* Project Design
* Internship

### **Food Science & Technology**
* Food Chemistry
* Food Microbiology
* Food Processing
* Food Engineering
* Food Preservation
* Food Quality Control
* Dairy Technology
* Meat Technology
* Cereal Technology
* Research Methods
* Senior Project
* Internship

### **Veterinary Medicine**
* Veterinary Anatomy
* Veterinary Physiology
* Veterinary Biochemistry
* Veterinary Pharmacology
* Veterinary Pathology
* Veterinary Microbiology
* Parasitology
* Surgery
* Medicine
* Theriogenology
* Public Health
* Clinical Rotation
* Internship

### **Forestry**
* Dendrology
* Silviculture
* Forest Management
* Forest Protection
* Agroforestry
* Forest Economics
* Forest Policy
* Wildlife Management
* Forest Measurement
* Research Methods
* Field Practice
* Internship

### **Natural Resource Management**
* Ecology
* Conservation Biology
* Land Use Planning
* Environmental Economics
* Resource Assessment
* Community Based Management
* Policy & Governance
* Research Methods
* Field Work
* Senior Project

### **Aquaculture & Fisheries**
* Fish Biology
* Aquaculture Systems
* Fish Nutrition
* Fish Health
* Hatchery Management
* Fishery Management
* Aquatic Ecology
* Processing Technology
* Research Methods
* Field Practice
* Internship

### **Rural Development & Agricultural Extension**
* Rural Sociology
* Development Theories
* Project Planning
* Community Development
* Gender & Development
* Monitoring & Evaluation
* Research Methods
* Field Work
* Senior Project

### **Wildlife & Ecotourism Management**
* Wildlife Ecology
* Wildlife Management
* Protected Area Management
* Ecotourism Principles
* Tour Guiding
* Conservation Education
* Wildlife Law
* Research Methods
* Field Practice
* Internship

### **Climate Change & Development**
* Climate Science
* Climate Policy
* Adaptation Strategies
* Mitigation Technologies
* Carbon Finance
* Vulnerability Assessment
* Research Methods
* Case Studies
* Senior Project

### **Environmental Science**
* Environmental Chemistry
* Ecology
* Environmental Pollution
* Environmental Impact Assessment
* Waste Management
* Environmental Law
* Sustainability
* Research Methods
* Field Work
* Senior Project

---

## **Business, Economics & Social Sciences**

### **Accounting**
* Principles of Accounting I & II
* Cost Accounting
* Managerial Accounting
* Financial Accounting I, II & III
* Auditing I & II
* Taxation
* Accounting Information Systems
* Public Sector Accounting
* Advanced Accounting
* Accounting Theory
* International Accounting
* Research Methods
* Accounting Practicum
* Internship

### **Finance**
* Financial Management
* Corporate Finance
* Investment Analysis
* International Finance
* Financial Markets
* Portfolio Management
* Risk Management
* Financial Institutions
* Behavioral Finance
* Financial Modeling
* Research Methods
* Case Studies
* Internship

### **Marketing**
* Principles of Marketing
* Consumer Behavior
* Marketing Research
* Advertising
* Sales Management
* Retail Marketing
* Services Marketing
* International Marketing
* Digital Marketing
* Brand Management
* Strategic Marketing
* Marketing Ethics
* Marketing Plan Development
* Internship

### **Management**
* Principles of Management
* Organizational Behavior
* Human Resource Management
* Strategic Management
* Operations Management
* Leadership
* Change Management
* Entrepreneurship
* Business Ethics
* International Management
* Research Methods
* Case Analysis
* Internship

### **Business Administration**
* All courses from Management, Marketing, Finance, Accounting
* Business Communication
* Business Law
* Business Statistics
* Operations Research
* Management Information Systems
* Business Strategy
* Integrated Business Project
* Internship

### **Economics**
* Microeconomics I & II
* Macroeconomics I & II
* Mathematical Economics
* Econometrics I & II
* Development Economics
* International Economics
* Monetary Economics
* Public Finance
* Labor Economics
* Agricultural Economics
* Health Economics
* Research Methods
* Senior Thesis
* Internship

### **Cooperative Studies**
* Cooperative Principles
* Cooperative Management
* Cooperative Accounting
* Cooperative Law
* Marketing Cooperatives
* Credit Cooperatives
* Agricultural Cooperatives
* Cooperative Auditing
* Research Methods
* Field Work
* Internship

### **Tourism & Hospitality Management**
* Introduction to Tourism
* Tourism Geography
* Hospitality Management
* Food & Beverage Management
* Tour Operations
* Tourism Marketing
* Hotel Operations
* Event Management
* Sustainable Tourism
* Tourism Policy
* Cultural Heritage
* Research Methods
* Field Work
* Internship

### **Public Administration**
* Introduction to Public Administration
* Public Policy
* Administrative Law
* Public Finance
* Human Resource Management
* Development Administration
* Local Government
* Ethics in Public Service
* Project Management
* Research Methods
* Case Studies
* Internship

### **Development Management**
* Development Theories
* Project Planning
* Program Management
* Monitoring & Evaluation
* Community Development
* NGO Management
* Resource Mobilization
* Leadership in Development
* Research Methods
* Field Project
* Internship

### **Project Management**
* Project Planning
* Project Scheduling
* Cost Estimation
* Risk Management
* Procurement Management
* Quality Management
* Project Leadership
* Monitoring & Evaluation
* Software Applications
* Case Studies
* Capstone Project
* Internship

### **Procurement & Supplies Management**
* Purchasing Principles
* Inventory Management
* Warehouse Management
* Supply Chain Management
* Procurement Law
* Contract Management
* Logistics
* International Procurement
* E-Procurement
* Ethics in Procurement
* Case Studies
* Internship

### **Logistics & Supply Chain Management**
* Logistics Management
* Transportation Management
* Distribution Management
* Inventory Control
* Supply Chain Strategy
* Global Logistics
* Warehousing
* Port Management
* Research Methods
* Case Studies
* Internship

### **Banking & Insurance**
* Banking Operations
* Credit Management
* Risk Management in Banking
* Insurance Principles
* Life Insurance
* General Insurance
* Actuarial Science
* Financial Regulations
* Investment Banking
* Case Studies
* Internship

### **Entrepreneurship**
* Opportunity Recognition
* Business Plan Development
* Small Business Management
* Venture Capital
* Innovation Management
* Family Business
* Social Entrepreneurship
* Entrepreneurial Marketing
* Entrepreneurial Finance
* Legal Issues
* Startup Project
* Internship

### **Human Resource Management**
* Recruitment & Selection
* Training & Development
* Performance Management
* Compensation Management
* Labor Relations
* Organizational Development
* HR Analytics
* Strategic HRM
* International HRM
* HR Information Systems
* Case Studies
* Internship

---

## **Medicine & Health Sciences**

### **Medicine (MD)**
* Human Anatomy
* Human Physiology
* Biochemistry
* Pathology
* Pharmacology
* Microbiology
* Parasitology
* Community Medicine
* Internal Medicine
* Surgery
* Pediatrics
* Obstetrics & Gynecology
* Psychiatry
* Radiology
* Dermatology
* Ophthalmology
* ENT
* Anesthesia
* Orthopedics
* Clinical Rotations
* Internship

### **Nursing**
* Fundamentals of Nursing
* Medical Surgical Nursing I & II
* Pediatric Nursing
* Maternal Health Nursing
* Psychiatric Nursing
* Community Health Nursing
* Nursing Research
* Nursing Ethics
* Nursing Leadership
* Pharmacology for Nurses
* Nutrition
* Health Assessment
* Clinical Practice
* Internship

### **Midwifery**
* Reproductive Anatomy
* Antenatal Care
* Intranatal Care
* Postnatal Care
* Neonatal Care
* Family Planning
* Gynecological Care
* Community Midwifery
* Midwifery Research
* Emergency Obstetric Care
* Clinical Practice
* Internship

### **Pharmacy**
* Pharmaceutical Chemistry
* Pharmacognosy
* Pharmacology
* Pharmacy Practice
* Clinical Pharmacy
* Pharmaceutical Analysis
* Pharmacotherapy
* Pharmacy Management
* Pharmaceutical Biotechnology
* Medicinal Chemistry
* Industrial Pharmacy
* Community Pharmacy
* Hospital Pharmacy
* Internship

### **Medical Laboratory Science**
* Clinical Chemistry
* Hematology
* Immunology
* Microbiology
* Parasitology
* Histopathology
* Blood Banking
* Laboratory Management
* Quality Assurance
* Research Methods
* Clinical Practice
* Internship

### **Anesthesia**
* Principles of Anesthesia
* Pharmacology for Anesthesia
* Anesthesia Equipment
* Clinical Anesthesia
* Regional Anesthesia
* Pain Management
* Intensive Care
* Research Methods
* Clinical Practice
* Internship

### **Physiotherapy**
* Human Anatomy
* Physiology
* Biomechanics
* Exercise Therapy
* Electrotherapy
* Manual Therapy
* Neurological Rehabilitation
* Orthopedic Rehabilitation
* Cardiopulmonary Rehabilitation
* Pediatric Physiotherapy
* Geriatric Physiotherapy
* Clinical Practice
* Internship

### **Health Informatics**
* Medical Terminology
* Database Management
* Health Information Systems
* Medical Statistics
* Healthcare Data Standards
* E-Health
* Telemedicine
* Systems Analysis
* Project Management
* Research Methods
* Practicum
* Internship

### **Public Health**
* Epidemiology
* Biostatistics
* Environmental Health
* Occupational Health
* Health Promotion
* Health Economics
* Health Policy
* Reproductive Health
* Nutrition
* Disaster Management
* Research Methods
* Field Practice
* Internship

### **Dentistry**
* Dental Anatomy
* Oral Pathology
* Periodontology
* Prosthodontics
* Orthodontics
* Oral Surgery
* Conservative Dentistry
* Pediatric Dentistry
* Community Dentistry
* Clinical Practice
* Internship

### **Psychiatry**
* General Psychology
* Abnormal Psychology
* Psychopharmacology
* Psychiatric Assessment
* Psychotherapy
* Community Psychiatry
* Child Psychiatry
* Research Methods
* Clinical Rotation
* Internship

### **Radiology**
* Radiation Physics
* Radiographic Techniques
* Radiation Protection
* Diagnostic Radiology
* Ultrasound
* CT & MRI
* Interventional Radiology
* Radiation Therapy
* Clinical Practice
* Internship

### **Optometry**
* Geometric Optics
* Ocular Anatomy
* Visual Optics
* Optometric Instruments
* Ocular Disease
* Contact Lenses
* Low Vision
* Pediatric Optometry
* Clinical Practice
* Internship

### **Environmental Health**
* Environmental Chemistry
* Sanitation
* Food Safety
* Water Quality
* Waste Management
* Vector Control
* Occupational Health
* Environmental Health
* Risk Assessment
* Field Practice
* Internship

### **Health Officer**
* Comprehensive Health Care
* Epidemiology
* Disease Prevention
* Health Management
* Community Diagnosis
* Health Planning
* Primary Health Care
* Clinical Skills
* Field Practice
* Internship

### **Health Economics & Management**
* Health Economics
* Healthcare Financing
* Health Policy Analysis
* Hospital Management
* Health Insurance
* Resource Allocation
* Economic Evaluation
* Strategic Planning
* Research Methods
* Internship
`;

const generateDeptCode = (name) => {
  return name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
};

const generateCourseCode = (deptCode, index) => {
  return deptCode + (index + 101).toString();
};

const seedComprehensiveData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected for comprehensive seeding.');

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
                    currentDepartment = dept;
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

        console.log('✓ Comprehensive seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Major error in comprehensive seeding:', error);
        process.exit(1);
    }
};

seedComprehensiveData();
