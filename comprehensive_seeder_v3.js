const { Department, Course, sequelize } = require('./models');

const data = `
## **Specialized & Technical Programs**

### **1. Water Technology & Sanitation**
* Water Chemistry
* Water Treatment Technology
* Water Quality Monitoring
* Sanitary Engineering
* Small Water System Management
* Water Supply Operation
* Wastewater Treatment
* Plumbing Technology
* Field Testing Methods
* Utility Management

### **2. Energy Engineering & Management**
* Energy Resources
* Renewable Energy Technology
* Energy Conversion
* Energy Efficiency
* Energy Policy & Economics
* Power Plant Technology
* Solar Energy Systems
* Wind Energy Technology
* Bioenergy
* Energy Project Management

### **3. Building Technology/Construction Science**
* Building Materials
* Construction Techniques
* Building Services (Plumbing, Electrical)
* Quantity Surveying
* Building Codes & Standards
* Construction Safety
* Building Information Modeling (BIM)
* Site Supervision
* Maintenance Technology

### **4. Railway Engineering Technology**
* Track Technology
* Signaling Systems
* Railway Operations
* Rolling Stock Maintenance
* Station Management
* Safety Systems
* Electrical Systems for Railways
* Practical Workshop Training

### **5. Automotive Technology**
* Engine Technology
* Transmission Systems
* Electrical Systems
* Diagnosis & Repair
* Automotive Electronics
* Service Management
* Parts Management
* Workshop Practice

### **6. Textile Technology**
* Fiber Science
* Weaving Technology
* Knitting Technology
* Dyeing & Printing
* Textile Testing Lab
* Quality Control
* Machine Maintenance
* Apparel Manufacturing

### **7. Chemical Technology**
* Process Operations
* Instrumentation
* Plant Safety
* Quality Control Lab
* Chemical Analysis
* Process Control
* Environmental Monitoring
* Plant Maintenance

### **8. Leather Technology**
* Raw Material Science
* Tanning Chemistry
* Leather Processing
* Finishing Technology
* Leather Goods Manufacturing
* Quality Testing
* Environmental Management in Tanneries
* Product Design

### **9. Food Technology/Processing**
* Food Preservation
* Dairy Processing
* Meat Processing
* Cereal Processing
* Quality Assurance
* Food Packaging
* Plant Operations
* Safety & Sanitation

### **10. Printing Technology**
* Prepress Technology
* Press Operations
* Binding & Finishing
* Digital Printing
* Color Management
* Materials Science
* Equipment Maintenance
* Print Business Management

### **11. Ceramic Engineering/Technology**
* Clay Science
* Forming Processes
* Kiln Technology
* Glazing
* Refractories
* Quality Control
* Plant Design
* Product Development

### **12. Building Electricity/Electrical Installation**
* Wiring Systems
* Lighting Design
* Electrical Installation
* Protection Systems
* Estimation & Costing
* Building Codes
* Maintenance
* Smart Building Systems

### **13. Surveying Technology**
* Basic Surveying
* Construction Surveying
* GPS Operation
* CAD for Surveying
* Field Data Collection
* Survey Calculation
* Equipment Maintenance
* Legal Aspects

### **14. Drafting Technology (Mechanical/Architectural)**
* Technical Drawing
* CAD I, II & III
* 3D Modeling
* Blueprint Reading
* Standards & Codes
* Geometric Dimensioning
* Shop Drawing Preparation
* Portfolio Development

### **15. Laboratory Technology (Medical/Chemical)**
* Lab Safety
* Instrument Operation
* Sample Handling
* Quality Control Procedures
* Maintenance & Calibration
* Data Recording
* Report Writing
* Specialized Testing Methods

### **16. Banking & Finance Technology**
* Core Banking Systems
* Digital Banking
* Payment Systems
* Financial Technology (FinTech)
* Banking Operations
* Risk Management Systems
* Compliance Technology
* Cybersecurity in Banking

### **17. Insurance Technology**
* Insurance Information Systems
* Claims Processing Systems
* Underwriting Technology
* Digital Insurance Platforms
* Actuarial Software
* Regulatory Technology
* Customer Management Systems

### **18. Hospitality Technology**
* Property Management Systems
* Point of Sale Systems
* Revenue Management Technology
* Digital Marketing for Hospitality
* Event Management Software
* Customer Relationship Systems
* Hotel Automation

### **19. Media Technology**
* Audio Production
* Video Production
* Broadcast Technology
* Studio Operations
* Post-Production Software
* Transmission Systems
* Multimedia Technology
* Live Event Technology

### **20. Ecotourism & Wildlife Management**
* Nature Interpretation
* Guide Training
* Park Management
* Wildlife Monitoring
* Visitor Management
* Conservation Education
* Tourism Impact Assessment
* Field Guide Practicum

### **21. Climate Smart Agriculture**
* Climate Adaptation Strategies
* Resilient Crop Systems
* Water Management Technologies
* Soil Carbon Management
* Weather Information Systems
* Sustainable Intensification
* Farmer Field Schools
* Climate Policy in Agriculture

### **22. One Health**
* Integrated Human-Animal Health
* Zoonotic Diseases
* Environmental Health Connections
* Surveillance Systems
* Outbreak Investigation
* Policy for One Health
* Cross-Sectoral Collaboration
* Field Epidemiology

### **23. Digital Humanities**
* Digital Archives
* Text Mining
* Cultural Analytics
* Digital Storytelling
* Web Publishing
* Computational Analysis
* Digital Preservation
* Ethics in Digital Scholarship

### **24. Actuarial Science**
* Probability Models
* Financial Mathematics
* Life Contingencies
* Risk Theory
* Loss Models
* Economics for Actuaries
* Insurance Practices
* Professional Exams Preparation

### **25. Petroleum Engineering**
* Reservoir Engineering
* Drilling Engineering
* Production Engineering
* Petroleum Geology
* Formation Evaluation
* Well Completion
* Petroleum Economics
* Field Development

### **26. Mining Surveying**
* Mine Mapping
* Underground Surveying
* Volume Calculations
* Mine Planning Support
* Safety Monitoring Surveys
* Survey Software for Mining
* Legal Mine Surveys
* Field Practice in Mines

### **27. Applied Geology**
* Engineering Geology Applications
* Hydrogeology Field Methods
* Mineral Exploration
* Environmental Site Assessment
* Geophysical Methods
* Remote Sensing Applications
* Geological Software
* Professional Reporting

### **28. Industrial Chemistry**
* Process Chemistry
* Quality Control Chemistry
* Polymer Chemistry Applications
* Pharmaceutical Manufacturing
* Paint & Coating Technology
* Adhesive Technology
* Industrial Analysis Methods
* Plant Chemistry Operations

### **29. Applied Physics (Medical/Engineering Physics)**
* Medical Imaging Physics
* Radiation Therapy Physics
* Materials Characterization
* Vacuum Technology
* Thin Film Technology
* Semiconductor Physics Applications
* Instrumentation Physics
* Applied Optics

### **30. Biotechnology & Bioengineering**
* Bioprocess Engineering
* Downstream Processing
* Bioreactor Design
* Enzyme Technology Applications
* Biosensor Technology
* Cell Culture Technology
* Good Manufacturing Practice (GMP)
* Scale-up Processes

### **31. Mining Engineering Technology**
* Surface Mining Operations
* Underground Mining Methods
* Mine Ventilation Practical
* Rock Fragmentation (Drilling & Blasting)
* Mineral Processing Operations
* Mine Safety Management
* Mine Surveying Applications
* Equipment Maintenance
* Mine Environmental Control
* Field Operations

### **32. Electrical Power Engineering Technology**
* Power Generation Technology
* Transmission & Distribution Systems
* Substation Operations
* Protection Relay Testing
* Power System Maintenance
* Renewable Energy Integration
* Smart Grid Technology
* Energy Metering & Billing
* Utility Operations
* Practical Line Work

### **33. Electronics & Communication Technology**
* Analog Electronics Lab
* Digital Electronics Systems
* Communication Systems Maintenance
* Network Troubleshooting
* Antenna Systems
* Microwave Technology
* Fiber Optic Communication
* Mobile Communication Systems
* Broadcast Equipment
* Repair & Calibration

### **34. Computer Hardware & Networking Technology**
* PC Assembly & Maintenance
* Network Installation
* Server Administration
* Cybersecurity Implementation
* Data Recovery
* Cloud Infrastructure
* IoT Device Configuration
* Technical Support
* Certification Preparation (Cisco, CompTIA)
* Workshop Practice

### **35. Agricultural Mechanization Technology**
* Farm Machinery Operation
* Tractor Systems
* Irrigation System Installation
* Post-harvest Equipment
* Machinery Maintenance
* Workshop Management
* Safety in Agricultural Machinery
* Equipment Calibration
* Field Operations Management
* Service Center Operations

### **36. Soil & Water Conservation Technology**
* Erosion Control Structures
* Terrace Construction
* Watershed Management Field Techniques
* Soil Testing Field Methods
* Conservation Structure Design
* Rainwater Harvesting Systems
* Gully Rehabilitation
* Community Mobilization Techniques
* Field Measurement
* Project Implementation

### **37. Dairy Technology & Management**
* Milk Processing Operations
* Dairy Plant Management
* Quality Control in Dairy
* Ice Cream & Yogurt Production
* Cheese Making Technology
* Dairy Equipment Maintenance
* Cold Chain Management
* Dairy Business Management
* Product Development
* Plant Sanitation

### **38. Poultry Science & Technology**
* Hatchery Management
* Broiler Production Systems
* Layer Management
* Feed Formulation Practical
* Poultry Health Management
* Processing Plant Operations
* Egg Quality Control
* Farm Business Management
* Biosecurity Implementation
* Waste Management

### **39. Apiculture (Beekeeping) Technology**
* Bee Biology & Behavior
* Hive Management
* Honey Extraction & Processing
* Queen Rearing
* Bee Products Value Addition
* Apiary Equipment
* Disease & Pest Management
* Marketing of Bee Products
* Melittopalynology (Pollen Study)
* Field Practical

### **40. Sericulture (Silk Production)**
* Mulberry Cultivation
* Silkworm Rearing
* Silk Reeling Technology
* Silk Weaving Basics
* Disease Management in Silkworms
* Post-cocoon Technology
* Sericulture Economics
* Farm Management
* Practical Rearing House Operations

### **41. Fishery Resources & Management**
* Fish Stock Assessment
* Aquaculture Engineering Practical
* Fish Feed Production
* Hatchery Operations
* Fishing Gear Technology
* Fish Processing Practical
* Fishery Regulations Enforcement
* Community-Based Management
* Field Survey Methods

### **42. Wildlife Management & Ecotourism**
* Wildlife Census Techniques
* Habitat Management
* Anti-poaching Operations
* Ecotourism Enterprise Management
* Visitor Center Operations
* Wildlife Capture & Translocation
* Conflict Resolution with Communities
* Field Guide Certification
* Park Interpretation

### **43. Forestry & Natural Resource Management Technology**
* Nursery Management
* Forest Establishment
* Silvicultural Operations
* Forest Inventory Field Methods
* Fire Management
* Non-Timber Forest Products
* Community Forestry
* Forest Extension Methods
* Field Station Operations

### **44. Environmental Health Technology**
* Water Quality Field Testing
* Sanitary Inspection
* Food Establishment Inspection
* Vector Control Operations
* Waste Management Systems
* Occupational Health Monitoring
* Environmental Sampling
* Health Education Delivery
* Inspection Report Writing

### **45. Medical Equipment Technology**
* Biomedical Instrumentation
* Equipment Calibration
* Maintenance Procedures
* Imaging Equipment Basics
* Laboratory Equipment
* Sterilization Technology
* Hospital Engineering
* Safety Testing
* Inventory Management
* Workshop Practice

### **46. Anaesthesia Technology**
* Anaesthesia Machine Operation
* Patient Monitoring
* Drug Preparation & Handling
* Airway Management Assistance
* Equipment Maintenance
* Emergency Procedures
* Operating Room Protocols
* Clinical Rotation
* Safety Protocols

### **47. Optometry Technology/ Ophthalmic Technology**
* Refraction Techniques
* Contact Lens Fitting
* Low Vision Aids
* Ophthalmic Equipment Handling
* Vision Screening Programs
* Workshop Practice (Frame adjustment)
* Clinic Management
* Patient Education

### **48. Dental Technology**
* Dental Prosthetics
* Crown & Bridge Technology
* Orthodontic Appliance Fabrication
* Dental Laboratory Management
* Materials Science for Dental Tech
* CAD/CAM in Dentistry
* Quality Control in Lab
* Infection Control in Lab

### **49. Health Information Technology**
* Medical Records Management
* ICD-10 Coding
* Hospital Statistics
* Electronic Health Records Systems
* Health Data Quality
* Privacy & Security Implementation
* Release of Information
* Cancer Registry
* Practicum in Health Facilities

### **50. Pharmacy Technology**
* Pharmaceutical Calculations
* Dispensing Practice
* Pharmaceutical Manufacturing Assistant
* Quality Control Testing
* Hospital Pharmacy Operations
* Community Pharmacy Management
* Drug Information Services
* Inventory Control
* Practical Training

### **51. Community Health (Health Extension Package)**
* Disease Prevention Strategies
* Health Promotion Methods
* Maternal & Child Health Services
* Family Planning Service Delivery
* Community Diagnosis
* Health Education Techniques
* First Aid & Emergency Response
* Record Keeping at Health Post
* Field Practice

### **52. Traditional Medicine**
* Ethnobotany
* Herbal Medicine Preparation
* Traditional Healing Practices
* Quality Control for Herbal Products
* Pharmacology of Medicinal Plants
* Cultivation of Medicinal Plants
* Regulatory Affairs for Traditional Medicine
* Clinical Apprenticeship
* Research Methods in Traditional Knowledge

### **53. Fashion Design & Garment Technology**
* Pattern Making
* Draping
* Sewing Technology
* Textile Science for Fashion
* Fashion Illustration
* Collection Development
* Apparel Production Management
* Quality Control in Garments
* Portfolio Development
* Industry Internship

### **54. Industrial Design**
* Product Design Process
* Design Sketching
* Materials & Processes
* Ergonomics
* CAD for Industrial Design
* Model Making & Prototyping
* Design Research
* Sustainable Design
* Professional Practice

### **55. Interior Design**
* Space Planning
* Furniture Design
* Lighting Design
* Materials & Finishes
* Building Systems for Interiors
* CAD & 3D Visualization
* Professional Practices
* Codes & Standards
* Portfolio Development

### **56. Landscape Architecture**
* Site Analysis
* Planting Design
* Grading & Drainage
* Landscape Construction
* Environmental Planning
* Computer-Aided Design (Landscape)
* History of Landscape Architecture
* Professional Office Practice
* Design Studio I-V

### **57. Urban Design**
* Urban Analysis
* Public Space Design
* Transit-Oriented Development
* Urban Design Studio
* Implementation Tools
* Community Participation Methods
* Sustainable Urban Design
* Urban Design Theory

### **58. Construction Management**
* Construction Contracts
* Cost Estimating
* Scheduling (CPM/PERT)
* Construction Safety Management
* Equipment Management
* Claims & Dispute Resolution
* Sustainable Construction Management
* Software Applications (Primavera, MS Project)
* Field Management

### **59. Quantity Surveying**
* Measurement & Quantities
* Cost Planning
* Tendering Procedures
* Contract Administration
* Final Account Procedures
* Construction Economics
* Professional Practice
* Software (QS software, CAD measurement)

### **60. Property Management & Valuation**
* Property Law Applications
* Valuation Methods
* Property Management Operations
* Real Estate Investment Analysis
* Property Development Process
* Facility Management
* Case Studies
* Professional Ethics & Standards

### **61. Taxation**
* Tax Law
* Tax Planning
* International Taxation
* Corporate Taxation
* Tax Compliance
* Tax Administration
* Case Studies
* Tax Research

### **62. Auditing**
* Internal Auditing
* Forensic Accounting
* IT Auditing
* Compliance Auditing
* Audit Methodology
* Case Studies
* Professional Standards
* Audit Software Applications

### **63. Cooperatives & Credit Management**
* Cooperative Accounting
* Credit Analysis
* Loan Administration
* Risk Management in Cooperatives
* Audit for Cooperatives
* Leadership in Cooperatives
* Field Study of Cooperatives

### **64. Secretarial Science & Office Management**
* Office Administration
* Business Communication
* Records Management
* Office Technology
* Event Planning
* Executive Assistance
* Office Finance Basics
* Professional Development
* Internship

### **65. Public Relations & Advertising**
* PR Writing
* Media Relations
* Campaign Planning
* Creative Strategy in Advertising
* Digital PR
* Crisis Communication
* Event Management for PR
* Ethics in PR & Advertising
* Portfolio Development

### **66. Digital Media & Communication**
* Digital Content Creation
* Social Media Management
* Web Analytics
* Multimedia Storytelling
* Digital Campaigns
* User Experience (UX) Basics
* Content Strategy
* Law & Ethics in Digital Media

### **67. Film & Television Production**
* Cinematography
* Screenwriting
* Directing
* Editing
* Sound Design
* Production Management
* Film Theory
* Studio Production
* Final Production Project

### **68. Theater & Performance Studies**
* Performance Theory
* Directing for Theater
* Scenography
* Play Analysis
* Theater Criticism
* Applied Theater
* Festival Management
* Production Portfolio

### **69. Music Technology & Production**
* Audio Engineering
* Music Production Software
* Sound Recording
* Mixing & Mastering
* Live Sound
* Music Business
* Studio Management
* Final Production Portfolio

### **70. Cultural Studies**
* Cultural Theory
* Popular Culture
* Media & Culture
* Subcultures
* Cultural Policy
* Research in Cultural Studies
* Ethiopian Cultural Studies
* Contemporary Cultural Issues

### **71. Translation & Interpretation**
* Translation Theory
* Consecutive Interpretation
* Simultaneous Interpretation Basics
* Technical Translation
* Literary Translation
* Computer-Assisted Translation Tools
* Terminology Management
* Professional Practice
* Language Specialization (e.g., Legal, Medical)

### **72. Sign Language Interpretation**
* Ethiopian Sign Language (EthSL)
* Interpretation Techniques
* Deaf Culture
* Ethics in Interpretation
* Specialized Settings (Educational, Medical)
* Practicum
* Professional Development

### **73. Rehabilitation Science**
* Rehabilitation Psychology
* Assistive Technology
* Community-Based Rehabilitation
* Disability Rights & Policy
* Therapeutic Techniques
* Case Management
* Fieldwork in Rehabilitation

### **74. Gerontology (Aging Studies)**
* Biology of Aging
* Social Gerontology
* Aging & Public Policy
* Long-Term Care Administration
* Health Aspects of Aging
* Program Planning for Older Adults
* Fieldwork with Elderly

### **75. Youth & Development Studies**
* Youth Psychology
* Youth Policy
* Youth Work Methods
* Program Design for Youth
* Counseling Youth
* Youth & Media
* Fieldwork with Youth Organizations

### **76. Sport Management**
* Sport Marketing
* Facility Management
* Event Management in Sports
* Sport Law
* Sport Finance
* Governance in Sport
* Ethics in Sport
* Internship with Sport Organizations

### **77. Fitness & Wellness Management**
* Exercise Prescription
* Wellness Programming
* Fitness Assessment
* Nutrition for Fitness
* Business of Fitness
* Client Counseling
* Facility Operations
* Internship

### **78. Nutrition & Dietetics**
* Human Nutrition
* Medical Nutrition Therapy
* Community Nutrition
* Food Service Management
* Nutritional Biochemistry
* Diet Planning
* Counseling Skills
* Clinical Practicum
* Community Placement

### **79. Food Security & Livelihoods**
* Food Security Analysis
* Livelihood Strategies
* Emergency Food Programs
* Policy for Food Security
* Monitoring Food Security
* Field Assessment Methods
* Project Design for Food Security

### **80. Irrigation & Drainage Engineering**
* Irrigation System Design
* Drainage Engineering
* Water Management in Irrigation
* Irrigation Structures
* Pump Selection & Installation
* Operation & Maintenance of Systems
* Field Design Project

### **81. Dryland Agriculture**
* Crops for Drylands
* Water Harvesting Techniques
* Soil Management in Drylands
* Pastoral Systems
* Climate Resilience
* Field Methods in Drylands
* Project in Dryland Community

### **82. Post-Harvest Management**
* Grain Storage Technology
* Drying Technology
* Handling Systems
* Quality Maintenance
* Warehouse Management
* Pest Management in Storage
* Loss Assessment
* Technology for Smallholders

### **83. Seed Science & Technology**
* Seed Biology
* Seed Production
* Processing & Storage
* Quality Testing
* Certification Systems
* Marketing of Seeds
* Entrepreneurship in Seed Business
* Lab & Field Practical

### **84. Plant Breeding & Seed Systems**
* Principles of Plant Breeding
* Breeding Methods
* Participatory Plant Breeding
* Seed Systems Development
* Biotechnology in Breeding
* Field Plot Techniques
* Data Analysis for Breeders

### **85. Agricultural Biotechnology**
* Tissue Culture Techniques
* Molecular Markers
* Genetic Engineering Applications
* Biosafety Regulations
* Lab Management
* Ethical Issues
* Practical Lab Skills

### **86. Soil Science**
* Pedology (Soil Genesis & Classification)
* Soil Mineralogy
* Soil Fertility Management
* Soil & Water Conservation
* Soil Microbiology
* Land Evaluation
* Soil Survey & Mapping
* Laboratory Analysis Methods

### **87. Agricultural Meteorology**
* Weather Instruments
* Climate Data Analysis
* Forecasting for Agriculture
* Climate Risk Management
* Agrometeorological Modeling
* Extension of Weather Information
* Field Measurements

### **88. Rural Sociology & Agricultural Extension**
* Sociology of Rural Communities
* Extension Communication
* Adoption & Diffusion of Innovations
* Gender in Agriculture & Rural Life
* Participatory Approaches
* Program Evaluation
* Fieldwork in Rural Communities

### **89. Agricultural Marketing & Value Chains**
* Market Analysis
* Value Chain Development
* Post-harvest Marketing
* Cooperatives in Marketing
* Price Analysis
* Export Procedures
* Case Studies of Value Chains

### **90. Agribusiness Management**
* Farm Business Management
* Agribusiness Finance
* Supply Chain Management in Agri-food
* Food Retail Management
* Risk Management in Agribusiness
* Business Plan for Agribusiness
* Internship in Agribusiness Firm

### **91. Petroleum Geoscience**
* Sedimentary Basin Analysis
* Seismic Interpretation
* Well Log Analysis
* Reservoir Characterization
* Petroleum Systems
* Geostatistics
* Field Methods in Petroleum Geology

### **92. Marine Science**
* Oceanography
* Marine Biology
* Coastal Zone Management
* Marine Pollution
* Fisheries Oceanography
* Field Methods at Sea/Lab
* Remote Sensing of Oceans

### **93. Space Science & Astronomy**
* Astrophysics
* Planetary Science
* Space Instrumentation
* Satellite Technology Basics
* Remote Sensing Physics
* Data Analysis from Space
* Observatory Techniques

### **94. Nanotechnology**
* Nanomaterials
* Characterization Techniques
* Nanofabrication
* Applications in Energy/Medicine
* Safety & Ethics
* Lab Practical in Clean Room

### **95. Robotics & Automation**
* Robot Mechanics
* Control Systems for Robotics
* Robot Programming
* Sensors & Actuators
* Industrial Automation
* AI for Robotics
* Robotics Project

### **96. Cyber-Physical Systems**
* Embedded Systems Design
* Real-Time Systems
* Networked Control Systems
* IoT Architecture
* Security of CPS
* System Integration
* Capstone Project

### **97. Blockchain Technology**
* Cryptography Basics
* Distributed Systems
* Smart Contracts
* Blockchain Platforms (Ethereum, etc.)
* Applications in Finance/Supply Chain
* Regulatory Aspects
* Development Project

### **98. Artificial Intelligence Engineering**
* Machine Learning Engineering
* Neural Networks Design
* Natural Language Processing Systems
* Computer Vision Systems
* AI Ethics & Safety
* Deployment of AI Models
* Major AI Project

### **99. Quantum Computing Fundamentals**
* Quantum Mechanics for Computing
* Qubits & Quantum Gates
* Quantum Algorithms
* Quantum Information Theory
* Programming Quantum Computers (Qiskit/Cirq)
* Applications

### **100. Ethical Hacking & Digital Forensics**
* Penetration Testing Methodologies
* Vulnerability Assessment
* Forensic Tools & Techniques
* Incident Response Procedures
* Cyber Law
* Certifications Preparation (CEH, CHFI)
* Practical Labs & Capture The Flag
`;

const generateDeptCode = (name) => {
    // Clean name from "X. " prefix and special chars
    const cleanName = name.replace(/^\d+\.\s*/, '').replace(/[^a-zA-Z]/g, '');
    return cleanName.substring(0, 4).toUpperCase();
};

const generateCourseCode = (deptCode, index) => {
    return deptCode + (index + 301).toString();
};

const seedBatch3Data = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected for Batch 3 seeding.');

        const lines = data.split('\n');
        let currentCategory = 'Specialized & Technical Programs';
        let currentDepartment = null;
        let courseIndex = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('## ')) {
                currentCategory = line.replace(/## |\*\*|/g, '').trim();
                console.log('--- Category: ' + currentCategory + ' ---');
            } else if (line.startsWith('### ')) {
                const deptNameRaw = line.replace(/### |\*\*|/g, '').trim();
                const deptName = deptNameRaw.split('(')[0].trim(); // Remove potential bracketed info
                const deptCode = generateDeptCode(deptName);
                
                let dept = await Department.findOne({ where: { code: deptCode } });
                if (!dept) {
                    dept = await Department.create({
                        name: deptName,
                        code: deptCode,
                        description: 'Specialized program under ' + currentCategory
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

        console.log('✓ Batch 3 seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Major error in Batch 3 seeding:', error);
        process.exit(1);
    }
};

seedBatch3Data();
