export const MOCK_STANDARDS = [
  {
    "id": "IS_7098_P2",
    "code": "IS 7098 (Part 2) : 2011",
    "title": "Cross-Linked Polyethylene Insulated Thermoplastic Sheathed Cables - Specification (Part 2: For Working Voltages from 3.3 kV Up to and Including 33 kV)",
    "division": "ETD",
    "divisionName": "Electrotechnical Division (ETD 09)",
    "category": "Power Transmission & Distribution Cables",
    "scope": "Covers requirements for single-core and three-core crosslinked polyethylene (XLPE) insulated and PVC or polyethylene sheathed power cables for electricity supply systems from 3.3 kV up to and including 33 kV.",
    "latestAmendment": "Amendment No. 3 (November 2021) - Mandatory Water Tree Retardant XLPE insulation criteria",
    "status": "Active",
    "statusBadge": "Active / Amended",
    "reaffirmationDate": "Reaffirmed 2022",
    "confidenceScore": 99.4,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Cables and Wires (Quality Control) Order, 2023 (S.O. 412(E) issued under BIS Act 2016)",
    "ministryEnforcing": "Ministry of Commerce & Industry (DPIIT)",
    "makeInIndiaLocalContentMin": "60% (Class-I Local Supplier)",
    "keyParameters": [
      "Working Voltage: 3.3 kV to 33 kV (Tested up to 1100V-11000V AC)",
      "Conductor: High conductivity EC grade Aluminium (IS 8130)",
      "Insulation: Dry cured XLPE extrusion compound (IS 7098 P2 Cl 11)",
      "Armouring: Galvanized steel strip / wire (IS 3975)",
      "Outer Sheath: FRLS PVC Type ST2 / Zero Halogen Polyolefin"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 8130 : 2013",
          "title": "Conductors for Insulated Electric Cables and Flexible Cords",
          "testMethod": "Electrical DC Resistance Test at 20°C (Kelvin Double Bridge)",
          "mandatoryClause": "Clause 6.1 (Max conductor resistance must comply with Table 2)",
          "importance": "Crucial - Non-compliance causes high resistive losses & fire hazard",
          "checkedByDefault": true
        },
        {
          "code": "IS 10810 (Part 58) : 1998",
          "title": "Methods of Test for Cables: Part 58 Oxygen Index Test",
          "testMethod": "ASTM D2863 / ISO 4589-2 Flammability Chamber Test (Min Oxygen Index: 29%)",
          "mandatoryClause": "Clause 18.3.2 (Mandatory for FRLS outer sheath)",
          "importance": "Crucial - Guarantees self-extinguishing flame retardancy in underground tunnels",
          "checkedByDefault": true
        },
        {
          "code": "IS 3975 : 1999",
          "title": "Low Carbon Galvanized Steel Wires, Formed Wires and Tapes for Armouring of Cables",
          "testMethod": "Zinc Coating Weight Test (IS 6745) & Tensile Strength (IS 1608)",
          "mandatoryClause": "Clause 8 (Uniformity of zinc coating via Preece Dip Test)",
          "importance": "High - Prevents premature corrosion in wet soil environments",
          "checkedByDefault": true
        },
        {
          "code": "IS 10810 (Part 53) : 1984",
          "title": "Methods of Test for Cables: Part 53 Smoke Density Test for FRLS",
          "testMethod": "3-Metre Cube Smoke Chamber Test (Min Light Transmittance >= 60%)",
          "mandatoryClause": "Clause 18.3.4 (Toxic smoke emission limit)",
          "importance": "High - Critical for passenger safety in enclosed metro stations",
          "checkedByDefault": false
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 1255 : 1983",
          "title": "Code of Practice for Installation and Maintenance of Power Cables up to and Including 33 kV",
          "summary": "Prescribes mandatory trench depth (1.2m), sand cushioning, protective RCC cable tiles, and minimum bending radius (12 x OD)."
        },
        {
          "code": "IS 5216 (Part 1) : 1982",
          "title": "Recommendations on Safety Procedures and Practices in Electrical Work",
          "summary": "Lockout/Tagout (LOTO) protocols and insulation testing before energization."
        }
      ],
      "installationGuidelines": "Tenderer must certify that cable laying complies with IS 1255 with 1.2m depth underground laying and certified end-termination kits tested as per IS 13573.",
      "samplingFrequency": "One routine test sample per drum (1000m) and one type test per 20 km manufactured lot as per Clause 19 Table 6."
    },
    "modelNitClause": "1.0 TECHNICAL COMPLIANCE - 11kV POWER CABLES:\n1.1 All power cables supplied under this package shall strictly conform to BIS specification IS 7098 (Part 2) : 2011 with all latest amendments.\n1.2 STATUTORY QCO MANDATE: In accordance with the Cables and Wires (Quality Control) Order 2023 under the BIS Act 2016, the bidder/OEM MUST possess a valid BIS Standard Mark (ISI Certification) License for IS 7098 (Part 2). Bids without valid BIS CML number shall be rejected outright at technical evaluation stage.\n1.3 RAW MATERIAL & ROUTINE TESTING:\n   a) Conductors shall comply with IS 8130:2013 with DC resistance verified via Kelvin Bridge.\n   b) Outer sheath shall be Flame Retardant Low Smoke (FRLS) tested for Oxygen Index >= 29% as per IS 10810 (Part 58).\n   c) Factory Acceptance Test (FAT) witness by Third-Party Inspection Agency (TPIA) is mandatory before dispatch.\n1.4 LOCAL CONTENT: Minimum local value addition under PPP-MII Order 2017 shall be 60%."
  },
  {
    "id": "IS_694",
    "code": "IS 694 : 2010",
    "title": "Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords for Rated Voltages up to and Including 450/750 V",
    "division": "ETD",
    "divisionName": "Electrotechnical Division (ETD 09)",
    "category": "Building Wires & Control Cables",
    "scope": "Covers the requirements for single core and multi-core PVC insulated and sheathed/unsheathed cables for electric power and lighting up to 1100V grade.",
    "latestAmendment": "Amendment No. 4 (2020) - Lead-free PVC insulation & halogen-free formulations",
    "status": "Active",
    "statusBadge": "Active / QCO Mandatory",
    "reaffirmationDate": "Reaffirmed 2021",
    "confidenceScore": 96.2,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Cables and Wires (Quality Control) Order, 2023 (DPIIT)",
    "ministryEnforcing": "DPIIT / Ministry of Power",
    "makeInIndiaLocalContentMin": "60% (Class-I Local Supplier)",
    "keyParameters": [
      "Voltage Grade: Up to and including 1100V AC",
      "Conductor: High purity Electrolytic Grade Copper (IS 8130 Class 5 Flexible)",
      "Insulation: Type A PVC compound / Lead-Free HR PVC (IS 5831)",
      "Flame Retardancy: Category C1 / FRLS compliant"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 5831 : 1984",
          "title": "PVC Insulation and Sheath of Electric Cables",
          "testMethod": "Tensile strength and percentage elongation at break before and after accelerated thermal ageing",
          "mandatoryClause": "Clause 7 Table 1 (Tensile strength >= 12.5 N/mm², elongation >= 150%)",
          "importance": "Crucial - Protects against premature insulation cracking in conduits",
          "checkedByDefault": true
        },
        {
          "code": "IS 8130 : 2013",
          "title": "Conductors for Insulated Electric Cables",
          "testMethod": "Copper conductor purity & electrical resistance at 20°C",
          "mandatoryClause": "Clause 6.2 (Max resistance per km for Class 5 flexible copper conductor)",
          "importance": "Crucial - Low purity copper causes excessive heating and energy losses",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 732 : 2019",
          "title": "Code of Practice for Electrical Wiring Installations (Fourth Revision)",
          "summary": "Governs conduit sizing, color coding (Red, Yellow, Blue, Black, Green), and continuous current carrying capacities."
        }
      ],
      "installationGuidelines": "Wires shall be drawn in rigid PVC conduits conforming to IS 9537 (Part 3) with proper pulling lubricants. Jointing inside conduits is strictly prohibited.",
      "samplingFrequency": "One spark test and conductor resistance test per 100-meter coil bundle."
    },
    "modelNitClause": "1.0 TECHNICAL COMPLIANCE - 1100V GRADE BUILDING WIRES:\n1.1 All building wires shall strictly comply with IS 694:2010 with valid BIS ISI license mark.\n1.2 Conductors shall be 99.9% pure electrolytic annealed copper (IS 8130 Class 5).\n1.3 Insulation shall be Lead-Free FR/FRLS PVC compound conforming to IS 5831."
  },
  {
    "id": "IS_1786",
    "code": "IS 1786 : 2008",
    "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification (Fourth Revision)",
    "division": "CED",
    "divisionName": "Civil Engineering Division (CED 54)",
    "category": "Structural Steel & Reinforcement",
    "scope": "Covers the requirements of deformed steel bars and wires for use as reinforcement in concrete in strength grades Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600.",
    "latestAmendment": "Amendment No. 4 (April 2023) - Stringent phosphorus & sulphur limits for seismic grade Fe 500D & Fe 550D",
    "status": "Active",
    "statusBadge": "Active / Amended",
    "reaffirmationDate": "Reaffirmed 2023",
    "confidenceScore": 98.9,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Steel and Steel Products (Quality Control) Order, 2020 (S.O. 167(E) Ministry of Steel)",
    "ministryEnforcing": "Ministry of Steel / DPIIT",
    "makeInIndiaLocalContentMin": "50% (Class-I Local Supplier)",
    "keyParameters": [
      "Grade: Fe 500D (Ductile)",
      "0.2% Proof Stress: Min 500.0 N/mm²",
      "Tensile Strength: Min 565.0 N/mm² (TS/YS Ratio >= 1.10)",
      "Elongation: Min 16.0%",
      "Total Elongation at Max Force (Agt): Min 5.0%",
      "Chemical P + S content: Max 0.075%"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 1608 (Part 1) : 2018",
          "title": "Metallic Materials - Tensile Testing: Part 1 Method of Test at Room Temperature",
          "testMethod": "Universal Testing Machine (UTM) Extensometer Proof Stress & Elongation Test",
          "mandatoryClause": "Clause 9.2 (Verification of 0.2% Proof Stress and TS/YS Ratio)",
          "importance": "Crucial - Assures plastic ductility under earthquake cyclic loads",
          "checkedByDefault": true
        },
        {
          "code": "IS 1599 : 2019",
          "title": "Metallic Materials - Bend Test (Third Revision)",
          "testMethod": "180° Cold Bend Test around mandrel of specified diameter without fracture",
          "mandatoryClause": "Clause 9.3 (Bend & Rebend test around mandrel dia 4d for Fe 500D)",
          "importance": "Crucial - Prevents micro-cracks during site bar-bending operations",
          "checkedByDefault": true
        },
        {
          "code": "IS 228 (Series)",
          "title": "Methods for Chemical Analysis of Steels",
          "testMethod": "Optical Emission Spectrometry (OES) for Carbon, Sulphur, Phosphorus, and Nitrogen",
          "mandatoryClause": "Clause 4.2 Table 1 (Carbon Equivalent CE <= 0.42%)",
          "importance": "High - Guarantees site weldability without pre-heating",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 13920 : 2016",
          "title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces",
          "summary": "Mandates exclusive use of \"D\" grade rebars (Fe 415D or Fe 500D) with minimum 16% elongation in seismic zones III, IV, and V."
        },
        {
          "code": "IS 456 : 2000",
          "title": "Plain and Reinforced Concrete - Code of Practice (Fourth Revision)",
          "summary": "Mandates minimum bar cover, development length (Ld), and bar spacing guidelines."
        }
      ],
      "installationGuidelines": "Only primary integrated steel producers having blast furnace route with valid BIS ISI license mark shall be accepted. Secondary rerolled scrap steel is prohibited.",
      "samplingFrequency": "One tensile, bend, and chemical test per 50 tonnes or part thereof for each bar diameter batch (Clause 11.1)."
    },
    "modelNitClause": "1.0 TECHNICAL SPECIFICATIONS - REINFORCEMENT STEEL (TMT BARS):\n1.1 All high-strength deformed reinforcement steel bars shall strictly conform to IS 1786:2008 Grade Fe 500D with all latest amendments.\n1.2 MANDATORY QCO COMPLIANCE: In accordance with the Steel and Steel Products (Quality Control) Order 2020, all rebars MUST bear the embossed BIS Standard Mark (ISI mark) along with OEM brand name and grade designation at intervals not exceeding 1.0 meter.\n1.3 MECHANICAL PROPERTIES & DUCTILITY:\n   a) 0.2% Proof Stress: Min 500 N/mm².\n   b) Tensile Strength: Min 565 N/mm² (Tensile to Yield ratio >= 1.10).\n   c) Total Elongation: Min 16.0% with Agt >= 5.0%.\n   d) Chemical Composition: Combined Sulphur + Phosphorus <= 0.075%; CE <= 0.42%.\n1.4 MANDATORY TEST CERTIFICATE: Manufacturer Test Certificate (MTC) with heat number correlation and independent NABL-accredited test report for each lot are mandatory prior to consumption."
  },
  {
    "id": "IS_269",
    "code": "IS 269 : 2015",
    "title": "Ordinary Portland Cement - Specification (Sixth Revision - Superseding IS 8112 and IS 12269)",
    "division": "CED",
    "divisionName": "Civil Engineering Division (CED 02)",
    "category": "Cement & Pozzolana Materials",
    "scope": "Covers the manufacture and chemical and physical requirements of ordinary Portland cement of 33, 43, and 53 grades.",
    "latestAmendment": "Amendment No. 2 (2021) - Performance testing & mandatory flyash/slag transparency declaration",
    "status": "Active",
    "statusBadge": "Active / Universal 269 Standard",
    "reaffirmationDate": "Reaffirmed 2020",
    "confidenceScore": 98.2,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Cement (Quality Control) Order, 2023 (Mandatory ISI Certification for all Cement Varieties)",
    "ministryEnforcing": "DPIIT / Ministry of Commerce & Industry",
    "makeInIndiaLocalContentMin": "100% (Class-I Local Supplier)",
    "keyParameters": [
      "Grade: 53 Grade Ordinary Portland Cement",
      "28-Day Compressive Strength: Min 53.0 MPa",
      "7-Day Compressive Strength: Min 37.0 MPa",
      "Initial Setting Time: Min 30 Minutes",
      "Final Setting Time: Max 600 Minutes",
      "Soundness (Le-Chatelier): Max 10.0 mm",
      "Fineness (Blaine air permeability): Min 225 m²/kg"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 4031 (Part 6) : 1988",
          "title": "Methods of Physical Tests for Hydraulic Cement: Part 6 Determination of Compressive Strength",
          "testMethod": "70.6mm Standard Mortar Cube Compression Testing with Standard Ennore Sand (IS 650)",
          "mandatoryClause": "Clause 7 Table 2 (Verification of 3, 7, and 28 days compressive strength)",
          "importance": "Crucial - Verifies structural load carrying capacity of concrete",
          "checkedByDefault": true
        },
        {
          "code": "IS 4031 (Part 3) : 1988",
          "title": "Methods of Physical Tests for Hydraulic Cement: Part 3 Determination of Soundness",
          "testMethod": "Le-Chatelier Water Bath Expansion Mould Test & Autoclave Expansion Test",
          "mandatoryClause": "Clause 7 Table 2 (Soundness expansion <= 10mm)",
          "importance": "Crucial - Prevents destructive volume expansion after concrete hardens",
          "checkedByDefault": true
        },
        {
          "code": "IS 4031 (Part 5) : 1988",
          "title": "Methods of Physical Tests for Hydraulic Cement: Part 5 Determination of Setting Time",
          "testMethod": "Vicat Needle Apparatus Penetration Test (Initial & Final Setting Time)",
          "mandatoryClause": "Clause 7 Table 2 (Initial >= 30 min, Final <= 600 min)",
          "importance": "High - Regulates workable placement time during concreting",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 456 : 2000",
          "title": "Plain and Reinforced Concrete - Code of Practice",
          "summary": "Governs mix design proportions, minimum cement content (360 kg/m3 for severe exposure), and water-cement ratio limits."
        }
      ],
      "installationGuidelines": "Cement shall be supplied in tamper-evident 50 kg HDPE/PP bags bearing BIS ISI standard mark with week and year of manufacture. Bags stored for >90 days must be retested for compressive strength before use.",
      "samplingFrequency": "One representative sample taken per 50 tonnes batch in accordance with IS 3535."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - 53 GRADE ORDINARY PORTLAND CEMENT:\n1.1 Cement supplied shall strictly conform to IS 269:2015 for 53 Grade Ordinary Portland Cement.\n1.2 MANDATORY BIS MARKING: Under the Cement (Quality Control) Order 2023, each cement bag MUST carry the official BIS ISI Mark, manufacturer name, registered brand, Grade (53 Grade OPC), net mass (50 kg), and Week/Year of packing.\n1.3 PHYSICAL & CHEMICAL PARAMETERS:\n   a) 28-day compressive strength >= 53.0 MPa as per IS 4031 (Part 6).\n   b) Le-Chatelier Soundness <= 10 mm as per IS 4031 (Part 3).\n   c) Blaine fineness >= 225 m²/kg.\n1.4 STORAGE CLAUSE: Cement older than 90 days from packing shall not be placed without prior retesting and written approval of Engineer-in-Charge."
  },
  {
    "id": "IS_1239_P1",
    "code": "IS 1239 (Part 1) : 2004",
    "title": "Steel Tubes, Tubulars and Other Wrought Steel Fittings - Part 1: Steel Tubes (Fifth Revision)",
    "division": "MTD",
    "divisionName": "Metallurgical & Mechanical Division (MTD 19)",
    "category": "Piping & Fluid Transmission",
    "scope": "Covers requirements for welded (Electric Resistance Welded - ERW) and seamless screwed and socketed steel tubes and plain end steel tubes of nominal bore from 15 mm to 150 mm in Light, Medium, and Heavy classes.",
    "latestAmendment": "Amendment No. 2 (2018) - Reaffirmed 2021 with updated hydro-testing tolerances",
    "status": "Active",
    "statusBadge": "Active Standard",
    "reaffirmationDate": "Reaffirmed 2021",
    "confidenceScore": 97.8,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Pipes and Tubes (Quality Control) Order, 2024 / Steel QCO 2020",
    "ministryEnforcing": "Ministry of Steel / DPIIT",
    "makeInIndiaLocalContentMin": "50% (Class-I Local Supplier)",
    "keyParameters": [
      "Class: Heavy Class (Red Band colour coded)",
      "Manufacturing: Electric Resistance Welded (ERW)",
      "Hydrostatic Test Pressure: Min 5.0 MPa (50 bar) held for 5 seconds",
      "Galvanizing: Hot-dip galvanized complying with IS 4736 (Min 400 g/m² zinc mass)",
      "Tensile Strength: Min 320 N/mm²",
      "Elongation: Min 20% on gauge length 5.65√S₀"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 4736 : 1986",
          "title": "Hot-Dip Zinc Coatings on Steel Tubes",
          "testMethod": "Stripping Method for Mass of Zinc Coating (IS 6745) & Preece Uniformity Dip Test",
          "mandatoryClause": "Clause 9 (Zinc mass >= 400 g/m² and minimum 4 dips in copper sulphate solution)",
          "importance": "Crucial - Protects potable water lines against internal & external rust",
          "checkedByDefault": true
        },
        {
          "code": "IS 1608 (Part 1) : 2018",
          "title": "Metallic Materials - Tensile Testing: Part 1",
          "testMethod": "Tensile & Elongation testing on longitudinal strip cut from the tube body",
          "mandatoryClause": "Clause 12.1 (Tensile strength >= 320 N/mm², elongation >= 20%)",
          "importance": "High - Ensures pipe wall withstands water hammer and internal pressure",
          "checkedByDefault": true
        },
        {
          "code": "IS 2328 : 2018",
          "title": "Metallic Materials - Tube - Flattening Test",
          "testMethod": "Flattening between parallel plates to specified distance without weld seam cracking",
          "mandatoryClause": "Clause 12.3 (Weld seam placed at 90° to direction of flattening force)",
          "importance": "Crucial - Verifies 100% sound fusion of ERW longitudinal seam",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 5382 : 2018",
          "title": "Rubber Sealing Rings for Gas Mains, Water Mains and Sewers",
          "summary": "Specifications for EPDM/Nitril rubber gaskets used in socketed pipe joints for potable water."
        }
      ],
      "installationGuidelines": "Tubes shall be hydrostatically tested at manufacturer works at 5 MPa for min 5 seconds. Threaded ends shall comply with IS 554 with protective plastic caps.",
      "samplingFrequency": "One tensile, flattening, and zinc coating test for each lot of 200 tubes or part thereof (Clause 13.1)."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - HEAVY CLASS GALVANIZED MS ERW PIPES:\n1.1 Steel tubes shall strictly conform to IS 1239 (Part 1) : 2004 Heavy Class with hot-dip galvanized coating as per IS 4736:1986.\n1.2 STATUTORY QCO MANDATE: All pipes supplied shall carry the valid BIS ISI Standard Mark embossed/stencilled on the pipe body along with OEM trademark and color coding (Red band for Heavy Class).\n1.3 TESTING: 100% tubes hydrostatically tested at 5.0 MPa without leakage. Zinc coating mass minimum 400 g/m² as per IS 4736.\n1.4 INSPECTION: Mandatory pre-dispatch inspection by Third Party Inspection Agency (RITES/CEIL/DNV)."
  },
  {
    "id": "IS_16102_P1",
    "code": "IS 16102 (Part 1) : 2012",
    "title": "Self-Ballasted LED Lamps for General Lighting Services - Part 1: Safety Requirements",
    "division": "LITD",
    "divisionName": "Electronics & Information Technology Division (LITD 27)",
    "category": "Solid State LED Lighting",
    "scope": "Specifies safety and interchangeability requirements, together with test methods and conditions, for self-ballasted LED lamps.",
    "latestAmendment": "Amendment No. 2 (2017) - Reaffirmed 2022",
    "status": "Active",
    "statusBadge": "Active / CRS Mandatory",
    "reaffirmationDate": "Reaffirmed 2022",
    "confidenceScore": 96.5,
    "certificationScheme": "Scheme-II (CRS - Compulsory Registration Scheme)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Electronics and Information Technology Goods (Requirement for Compulsory Registration) Order, 2021 (MeitY)",
    "ministryEnforcing": "Ministry of Electronics and Information Technology (MeitY)",
    "makeInIndiaLocalContentMin": "50% (Class-I Local Supplier)",
    "keyParameters": [
      "Rated Wattage: 90W to 150W System",
      "System Efficacy: >= 130 Lumens/Watt",
      "Color Rendering Index (CRI): >= 70 (CCT: 4000K to 5700K)",
      "Ingress Protection: IP66",
      "Impact Protection: IK08",
      "Surge Protection: 10 kV internal / external SPD"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 16102 (Part 2) : 2012",
          "title": "Self-Ballasted LED Lamps for General Lighting Services - Part 2: Performance Requirements",
          "testMethod": "Integrating Sphere Photometry & Goniophotometer Efficacy (lm/W) Measurement",
          "mandatoryClause": "Clause 7 Table 1 (Lumen maintenance >= 90% at 2000 hours, LM-80 / TM-21 test)",
          "importance": "Crucial - Guarantees energy efficiency & prevents lumen depreciation",
          "checkedByDefault": true
        },
        {
          "code": "IS 10322 (Part 5/Sec 3) : 2012",
          "title": "Luminaires: Part 5 Road and Street Lighting",
          "testMethod": "IP66 Jet Water Test Chamber & Thermal Endurance Test at 45°C Ambient",
          "mandatoryClause": "Clause 5.3 (Ingress protection IP66 and thermal endurance)",
          "importance": "Crucial - Prevents water ingress and early LED driver burnout",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 15885 (Part 2/Sec 13) : 2012",
          "title": "Lamp Controlgear for LED Modules",
          "summary": "Mandatory BIS CRS registration for the electronic LED driver with THD < 10% and Power Factor > 0.95."
        },
        {
          "code": "IS 3043 : 2018",
          "title": "Code of Practice for Earthing",
          "summary": "Protective conductor grounding requirements for street light poles and luminaire chassis."
        }
      ],
      "installationGuidelines": "Die-cast aluminium housing with corrosion-resistant powder coating (minimum 1000 hours salt spray test as per ASTM B117). Driver must have over-voltage cutoff above 300V AC.",
      "samplingFrequency": "One type test report from BIS recognized / NABL laboratory per luminaire wattage rating."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - LED STREET LIGHT LUMINAIRES:\n1.1 LED Street Luminaires shall conform to IS 10322 (Part 5/Sec 3):2012 and IS 16102 (Part 1 & 2):2012.\n1.2 MANDATORY MeitY CRS REGISTRATION: Both luminaire and driver MUST have valid BIS Registration (R-number) under Scheme-II (CRS).\n1.3 PERFORMANCE: System Efficacy >= 130 lm/W, IP66 Ingress Protection, 10 kV SPD, THD <= 10%, Power Factor >= 0.95.\n1.4 WARRANTY: 5-year comprehensive replacement warranty."
  },
  {
    "id": "IS_14220",
    "code": "IS 14220 : 1994",
    "title": "Openwell Submersible Pumpsets - Specification",
    "division": "MTD",
    "divisionName": "Mechanical Engineering Division (MTD 20 / ETD)",
    "category": "Water Pumps & Irrigation",
    "scope": "Covers requirements for submersible pump-motor sets suitable for installation in open wells, sumps, and agricultural irrigation.",
    "latestAmendment": "Amendment No. 3 (2020) - High efficiency BEE 5-Star compatibility",
    "status": "Active",
    "statusBadge": "Active Standard",
    "reaffirmationDate": "Reaffirmed 2021",
    "confidenceScore": 95.8,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Pumps (Quality Control) Order, 2023 under BIS Act 2016",
    "ministryEnforcing": "DPIIT / Ministry of Agriculture",
    "makeInIndiaLocalContentMin": "60% (Class-I Local Supplier)",
    "keyParameters": [
      "Power: 5 HP / 7.5 HP 3-Phase 415V",
      "Pump Type: Multistage Centrifugal with SS Impellers (Grade 304)",
      "Motor: Wet-type water lubricated squirrel cage induction motor",
      "Overall Efficiency: Min 55% at duty point",
      "Insulation: Class F with Class B temperature rise limits"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 9137 : 2019",
          "title": "Acceptance Tests for Centrifugal, Mixed Flow and Axial Pumps - Class C",
          "testMethod": "Flow Measurement (Magnetic Flowmeter), Head (Pressure Transducer), & Power Input",
          "mandatoryClause": "Clause 9 (Head-Flow efficiency curve verification against guaranteed parameters)",
          "importance": "Crucial - Verifies pump delivers rated discharge without overloading motor",
          "checkedByDefault": true
        },
        {
          "code": "IS 9283 : 2013",
          "title": "Motors for Submersible Pumpsets - Specification",
          "testMethod": "High Voltage Withstand Test (1500V + 2 x rated voltage) & Winding Resistance",
          "mandatoryClause": "Clause 8 Table 1 (Full load current and temperature rise test)",
          "importance": "Crucial - Prevents submersible motor burnout under low voltage agricultural grid",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 3043 : 2018",
          "title": "Code of Practice for Earthing",
          "summary": "Grounding requirement for pump controller panels and solar PV structure arrays."
        }
      ],
      "installationGuidelines": "Pump impellers and bowls shall be made of Stainless Steel AISI 304 / Bronze. Cast iron parts shall have anti-corrosive epoxy coating.",
      "samplingFrequency": "One pump per 50 units batch tested for hydraulic performance at manufacturer test bed."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - SUBMERSIBLE PUMP-MOTOR SETS:\n1.1 Submersible pumpsets shall strictly conform to IS 14220:1994 / IS 8034:2018 with BIS ISI Certification.\n1.2 MANDATORY QCO LICENSE: Under Pumps QCO 2023, the manufacturer MUST hold valid BIS ISI license mark for the quoted rating.\n1.3 EFFICIENCY & MATERIALS: Impellers and stage casings fabricated from SS 304. Motor conforming to IS 9283. Complete performance curve certified as per IS 9137 Class C."
  },
  {
    "id": "IS_1180_P1",
    "code": "IS 1180 (Part 1) : 2014",
    "title": "Outdoor Type Three-Phase Distribution Transformers up to and Including 2500 kVA, 33 kV - Specification (Part 1: Mineral Oil Immersed)",
    "division": "ETD",
    "divisionName": "Electrotechnical Division (ETD 16)",
    "category": "Distribution Transformers & Power Equipment",
    "scope": "Specifies requirements and tests for outdoor type, three-phase, 50 Hz, oil-immersed distribution transformers up to 2500 kVA, 33 kV with standard loss levels.",
    "latestAmendment": "Amendment No. 4 (2021) - Stringent total losses limit (BEE Star rating alignment)",
    "status": "Active",
    "statusBadge": "Active / Statutory QCO Mandatory",
    "reaffirmationDate": "Reaffirmed 2021",
    "confidenceScore": 99.1,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Distribution Transformers (Quality Control) Order, 2024 / CEA Grid Standards",
    "ministryEnforcing": "Ministry of Power / DPIIT",
    "makeInIndiaLocalContentMin": "60% (Class-I Local Supplier)",
    "keyParameters": [
      "Rating: 100 kVA / 250 kVA / 500 kVA / 1000 kVA, 11/0.433 kV",
      "Efficiency: Energy Efficiency Level 2 (as per Table 3)",
      "Total Losses at 50% & 100% Load: Compliant with BEE / IS 1180 limits",
      "Winding Material: Electrolytic Copper (IS 12444 / IS 13730)",
      "Transformer Oil: Uninhibited Mineral Oil conforming to IS 335:2018"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 335 : 2018",
          "title": "Uninhibited and Inhibited Mineral Insulating Oils - Specification",
          "testMethod": "Dielectric Breakdown Voltage (BDV) Test (Min 60 kV) & Water Content Karl Fischer (< 15 ppm)",
          "mandatoryClause": "Clause 6 Table 1 (Dielectric dissipation factor <= 0.005 at 90°C)",
          "importance": "Crucial - Insulating oil breakdown leads to catastrophic transformer explosion",
          "checkedByDefault": true
        },
        {
          "code": "IS 2026 (Part 1 to 5)",
          "title": "Power Transformers (Series)",
          "testMethod": "Short-Circuit Withstand Dynamic Test (CPRI / ERDA certified) & Lightning Impulse 75 kVp Test",
          "mandatoryClause": "Clause 16 (Type test certificate from CPRI/ERDA within last 5 years)",
          "importance": "Crucial - Guarantees transformer survives severe grid short circuits",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 10028 (Part 2) : 1981",
          "title": "Code of Practice for Selection, Installation and Maintenance of Transformers",
          "summary": "Plinth design, oil soak pit provisions, safety clearances, and silica gel breather maintenance."
        },
        {
          "code": "IS 3043 : 2018",
          "title": "Code of Practice for Earthing",
          "summary": "Separate dedicated neutral grounding and body earth pit provisions (max 1.0 Ohm resistance)."
        }
      ],
      "installationGuidelines": "Transformer core must be manufactured exclusively from prime virgin CRGO steel with Mill Test Certificate (MTC). Recycled or scrap core material is strictly barred.",
      "samplingFrequency": "100% routine tests (No load loss, Load loss, HV withstand, Induced overvoltage) witnessed by utility inspection engineer."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - 11/0.433 kV DISTRIBUTION TRANSFORMERS:\n1.1 Transformers shall comply with IS 1180 (Part 1):2014 Energy Efficiency Level 2.\n1.2 MANDATORY BIS ISI LICENSE & BEE STAR LABEL: Valid BIS ISI Mark license as per Transformers QCO under BIS Act 2016 and BEE Star label.\n1.3 Core: Prime Virgin CRGO steel (IS 3024). Windings: 100% Electrolytic copper (IS 12444). Oil: Conforming to IS 335:2018.\n1.4 SHORT CIRCUIT TYPE TEST: Valid CPRI/ERDA short-circuit type test report within last 5 years mandatory."
  },
  {
    "id": "IS_4984",
    "code": "IS 4984 : 2016",
    "title": "High Density Polyethylene (HDPE) Pipes for Water Supply - Specification (Fifth Revision)",
    "division": "CHD",
    "divisionName": "Chemical & Polymer Division (CHD 20 / CED)",
    "category": "Polymer Piping & Potable Water",
    "scope": "Covers requirements for HDPE pipes of raw material grade PE 63, PE 80, and PE 100 for water supply systems for working pressures from PN 2.5 to PN 20.",
    "latestAmendment": "Amendment No. 1 (2020) - Stringent carbon black dispersion & oxidation induction time (OIT)",
    "status": "Active",
    "statusBadge": "Active Standard",
    "reaffirmationDate": "Reaffirmed 2021",
    "confidenceScore": 97.1,
    "certificationScheme": "Scheme-I (Mandatory ISI Mark)",
    "qcoMandatory": true,
    "qcoGazetteOrder": "Plastics and Polymers (Quality Control) Order, 2023 under BIS Act 2016",
    "ministryEnforcing": "Department of Chemicals & Petrochemicals / DPIIT",
    "makeInIndiaLocalContentMin": "60% (Class-I Local Supplier)",
    "keyParameters": [
      "Raw Material Grade: PE 100 Virgin Granules",
      "Pressure Rating: PN 6, PN 10, PN 16 (SDR 17 / SDR 11 / SDR 9)",
      "Sizes: Outer Diameter 20 mm to 630 mm",
      "Carbon Black Content: 2.0% to 3.0% by mass (IS 2530)",
      "Oxidation Induction Time (OIT): Min 20 minutes at 200°C",
      "Hydrostatic Strength (100 hours at 20°C): No burst / rupture"
    ],
    "normativeReferences": {
      "rawMaterialTests": [
        {
          "code": "IS 7328 : 2020",
          "title": "High Density Polyethylene Materials for Moulding and Extrusion",
          "testMethod": "Melt Flow Index (MFI) & Density Determination (IS 13360 Part 3/Sec 1)",
          "mandatoryClause": "Clause 5.1 (Only pre-compounded virgin resin PE 100 with valid OEM batch certificate)",
          "importance": "Crucial - Use of reprocessed/recycled plastic scrap causes catastrophic brittle burst",
          "checkedByDefault": true
        },
        {
          "code": "IS 12235 (Part 8/Sec 1) : 2018",
          "title": "Methods of Test for Unplasticized PVC / Polyolefin Pipes: Internal Hydrostatic Pressure Test",
          "testMethod": "Water Bath Hydrostatic Pressure Test at 80°C for 165 hours and 1000 hours",
          "mandatoryClause": "Clause 8.1 Table 4 (Long-term hydrostatic strength verification)",
          "importance": "Crucial - Guarantees 50-year design life of underground water distribution",
          "checkedByDefault": true
        }
      ],
      "safetyCodes": [
        {
          "code": "IS 7634 (Part 2) : 2012",
          "title": "Code of Practice for Laying and Jointing of Polyethylene (PE) Pipes for Potable Water Supply",
          "summary": "Butt fusion welding protocols, bead inspection, trench bedding with sand, and pressure testing."
        }
      ],
      "installationGuidelines": "Butt fusion jointing shall be performed only using microprocessor-controlled automatic hydraulic butt fusion machines. Recycled polymer is strictly prohibited.",
      "samplingFrequency": "One sample per 1000 meters or per continuous manufacturing coil for density, MFI, and carbon black dispersion."
    },
    "modelNitClause": "1.0 TECHNICAL CLAUSE - HDPE PE-100 PIPES FOR POTABLE WATER:\n1.1 HDPE pipes shall strictly comply with IS 4984:2016 for PE 100 grade material.\n1.2 MANDATORY BIS MARKING: Pipes MUST bear official BIS ISI Mark, manufacturer brand, raw material grade (PE 100), Pressure Rating (PN 10/16), SDR ratio, and batch number.\n1.3 RESIN PURITY: Extruded exclusively from pre-compounded 100% virgin PE 100 resin granules with carbon black (2.0% - 3.0%). Recycled polymer strictly prohibited. OIT minimum 20 min at 200°C.\n1.4 JOINTING: Electrofusion or automatic butt-fusion strictly adhering to IS 7634 (Part 2)."
  }
];
