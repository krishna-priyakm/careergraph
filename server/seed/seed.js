const { driver } = require("../config/database");

const seedDatabase = async () => {
  const session = driver.session();

  try {
    console.log("🌱 Starting CareerGraph database seed...");

    // Remove existing graph data
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    // -----------------------------
    // PEOPLE
    // -----------------------------
    const people = [
      {
        id: "P001",
        name: "Anu",
        experience: 2,
      },
      {
        id: "P002",
        name: "Rahul",
        experience: 3,
      },
      {
        id: "P003",
        name: "Meera",
        experience: 1,
      },
      {
        id: "P004",
        name: "Arjun",
        experience: 4,
      },
      {
        id: "P005",
        name: "Neha",
        experience: 2,
      },
    ];

    // -----------------------------
    // SKILLS
    // -----------------------------
    const skills = [
      {
        id: "S001",
        name: "React.js",
        category: "Frontend",
      },
      {
        id: "S002",
        name: "Node.js",
        category: "Backend",
      },
      {
        id: "S003",
        name: "MongoDB",
        category: "Database",
      },
      {
        id: "S004",
        name: "JavaScript",
        category: "Programming",
      },
      {
        id: "S005",
        name: "TypeScript",
        category: "Programming",
      },
      {
        id: "S006",
        name: "Express.js",
        category: "Backend",
      },
      {
        id: "S007",
        name: "Python",
        category: "Programming",
      },
      {
        id: "S008",
        name: "SQL",
        category: "Database",
      },
      {
        id: "S009",
        name: "Java",
        category: "Programming",
      },
      {
        id: "S010",
        name: "Spring Boot",
        category: "Backend",
      },
      {
        id: "S011",
        name: "Docker",
        category: "DevOps",
      },
      {
        id: "S012",
        name: "AWS",
        category: "Cloud",
      },
      {
        id: "S013",
        name: "Git",
        category: "Tools",
      },
      {
        id: "S014",
        name: "Next.js",
        category: "Frontend",
      },
      {
        id: "S015",
        name: "Redux",
        category: "Frontend",
      },
    ];

    // -----------------------------
    // COMPANIES
    // -----------------------------
    const companies = [
      {
        id: "C001",
        name: "TechNova",
        location: "Bengaluru",
      },
      {
        id: "C002",
        name: "CloudWorks",
        location: "Hyderabad",
      },
      {
        id: "C003",
        name: "DataSphere",
        location: "Pune",
      },
      {
        id: "C004",
        name: "WebForge",
        location: "Chennai",
      },
      {
        id: "C005",
        name: "InnovateLabs",
        location: "Kochi",
      },
    ];

    // -----------------------------
    // JOBS
    // -----------------------------
    const jobs = [
      {
        id: "J001",
        title: "Full Stack Developer",
        experienceLevel: "Junior",
      },
      {
        id: "J002",
        title: "Frontend Developer",
        experienceLevel: "Junior",
      },
      {
        id: "J003",
        title: "Backend Developer",
        experienceLevel: "Mid",
      },
      {
        id: "J004",
        title: "Python Developer",
        experienceLevel: "Junior",
      },
      {
        id: "J005",
        title: "Java Backend Developer",
        experienceLevel: "Mid",
      },
      {
        id: "J006",
        title: "Cloud Engineer",
        experienceLevel: "Mid",
      },
      {
        id: "J007",
        title: "React Developer",
        experienceLevel: "Junior",
      },
      {
        id: "J008",
        title: "Software Engineer",
        experienceLevel: "Mid",
      },
    ];

    // -----------------------------
    // PROJECTS
    // -----------------------------
    const projects = [
      {
        id: "PR001",
        name: "E-Commerce Platform",
        description: "A full-stack online shopping platform.",
      },
      {
        id: "PR002",
        name: "Service Booking System",
        description: "A platform for booking technical services.",
      },
      {
        id: "PR003",
        name: "Research Repository",
        description: "A repository for managing academic research papers.",
      },
      {
        id: "PR004",
        name: "Analytics Dashboard",
        description: "A dashboard for visualizing business analytics.",
      },
      {
        id: "PR005",
        name: "Cloud Deployment Platform",
        description: "A platform for deploying web applications.",
      },
    ];

    // -----------------------------
    // CREATE PEOPLE
    // -----------------------------
    await session.run(
      `
      UNWIND $people AS person
      CREATE (:Person {
        id: person.id,
        name: person.name,
        experience: person.experience
      })
      `,
      { people }
    );

    // -----------------------------
    // CREATE SKILLS
    // -----------------------------
    await session.run(
      `
      UNWIND $skills AS skill
      CREATE (:Skill {
        id: skill.id,
        name: skill.name,
        category: skill.category
      })
      `,
      { skills }
    );

    // -----------------------------
    // CREATE COMPANIES
    // -----------------------------
    await session.run(
      `
      UNWIND $companies AS company
      CREATE (:Company {
        id: company.id,
        name: company.name,
        location: company.location
      })
      `,
      { companies }
    );

    // -----------------------------
    // CREATE JOBS
    // -----------------------------
    await session.run(
      `
      UNWIND $jobs AS job
      CREATE (:Job {
        id: job.id,
        title: job.title,
        experienceLevel: job.experienceLevel
      })
      `,
      { jobs }
    );

    // -----------------------------
    // CREATE PROJECTS
    // -----------------------------
    await session.run(
      `
      UNWIND $projects AS project
      CREATE (:Project {
        id: project.id,
        name: project.name,
        description: project.description
      })
      `,
      { projects }
    );

    // -----------------------------
    // PERSON -> SKILL
    // -----------------------------
    await session.run(`
      MATCH (p:Person {id: "P001"})
      MATCH (s:Skill {id: "S001"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P001"})
      MATCH (s:Skill {id: "S002"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P001"})
      MATCH (s:Skill {id: "S003"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P001"})
      MATCH (s:Skill {id: "S004"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P001"})
      MATCH (s:Skill {id: "S013"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    // Rahul
    await session.run(`
      MATCH (p:Person {id: "P002"})
      MATCH (s:Skill {id: "S007"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P002"})
      MATCH (s:Skill {id: "S008"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P002"})
      MATCH (s:Skill {id: "S013"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P002"})
      MATCH (s:Skill {id: "S011"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    // Meera
    await session.run(`
      MATCH (p:Person {id: "P003"})
      MATCH (s:Skill {id: "S001"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P003"})
      MATCH (s:Skill {id: "S005"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P003"})
      MATCH (s:Skill {id: "S015"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    // Arjun
    await session.run(`
      MATCH (p:Person {id: "P004"})
      MATCH (s:Skill {id: "S009"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P004"})
      MATCH (s:Skill {id: "S010"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P004"})
      MATCH (s:Skill {id: "S008"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P004"})
      MATCH (s:Skill {id: "S013"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    // Neha
    await session.run(`
      MATCH (p:Person {id: "P005"})
      MATCH (s:Skill {id: "S001"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P005"})
      MATCH (s:Skill {id: "S014"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    await session.run(`
      MATCH (p:Person {id: "P005"})
      MATCH (s:Skill {id: "S004"})
      CREATE (p)-[:HAS_SKILL]->(s)
    `);

    // -----------------------------
    // JOB -> SKILL
    // -----------------------------

    // Full Stack Developer
    await session.run(`
      MATCH (j:Job {id: "J001"})
      MATCH (s:Skill {id: "S001"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J001"})
      MATCH (s:Skill {id: "S002"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J001"})
      MATCH (s:Skill {id: "S003"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J001"})
      MATCH (s:Skill {id: "S004"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J001"})
      MATCH (s:Skill {id: "S005"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Frontend Developer
    await session.run(`
      MATCH (j:Job {id: "J002"})
      MATCH (s:Skill {id: "S001"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J002"})
      MATCH (s:Skill {id: "S004"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J002"})
      MATCH (s:Skill {id: "S005"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Backend Developer
    await session.run(`
      MATCH (j:Job {id: "J003"})
      MATCH (s:Skill {id: "S002"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J003"})
      MATCH (s:Skill {id: "S006"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J003"})
      MATCH (s:Skill {id: "S003"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Python Developer
    await session.run(`
      MATCH (j:Job {id: "J004"})
      MATCH (s:Skill {id: "S007"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J004"})
      MATCH (s:Skill {id: "S008"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Java Backend Developer
    await session.run(`
      MATCH (j:Job {id: "J005"})
      MATCH (s:Skill {id: "S009"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J005"})
      MATCH (s:Skill {id: "S010"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Cloud Engineer
    await session.run(`
      MATCH (j:Job {id: "J006"})
      MATCH (s:Skill {id: "S011"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J006"})
      MATCH (s:Skill {id: "S012"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // React Developer
    await session.run(`
      MATCH (j:Job {id: "J007"})
      MATCH (s:Skill {id: "S001"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J007"})
      MATCH (s:Skill {id: "S014"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // Software Engineer
    await session.run(`
      MATCH (j:Job {id: "J008"})
      MATCH (s:Skill {id: "S004"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    await session.run(`
      MATCH (j:Job {id: "J008"})
      MATCH (s:Skill {id: "S013"})
      CREATE (j)-[:REQUIRES]->(s)
    `);

    // -----------------------------
    // COMPANY -> JOB
    // -----------------------------

    await session.run(`
      MATCH (c:Company {id: "C001"})
      MATCH (j:Job {id: "J001"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C001"})
      MATCH (j:Job {id: "J002"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C002"})
      MATCH (j:Job {id: "J003"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C002"})
      MATCH (j:Job {id: "J006"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C003"})
      MATCH (j:Job {id: "J004"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C003"})
      MATCH (j:Job {id: "J008"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C004"})
      MATCH (j:Job {id: "J007"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    await session.run(`
      MATCH (c:Company {id: "C005"})
      MATCH (j:Job {id: "J005"})
      CREATE (c)-[:OFFERS]->(j)
    `);

    // -----------------------------
    // RELATED SKILLS
    // -----------------------------

    const relatedSkills = [
      ["S001", "S005"],
      ["S001", "S014"],
      ["S001", "S015"],
      ["S002", "S006"],
      ["S002", "S003"],
      ["S007", "S008"],
      ["S009", "S010"],
      ["S011", "S012"],
      ["S004", "S005"],
    ];

    for (const [skillA, skillB] of relatedSkills) {
      await session.run(
        `
        MATCH (a:Skill {id: $skillA})
        MATCH (b:Skill {id: $skillB})
        CREATE (a)-[:RELATED_TO]->(b)
        `,
        {
          skillA,
          skillB,
        }
      );
    }

    // -----------------------------
    // PERSON -> PROJECT
    // -----------------------------

    const personProjects = [
      ["P001", "PR001"],
      ["P001", "PR002"],
      ["P002", "PR004"],
      ["P003", "PR003"],
      ["P004", "PR005"],
      ["P005", "PR001"],
    ];

    for (const [personId, projectId] of personProjects) {
      await session.run(
        `
        MATCH (p:Person {id: $personId})
        MATCH (pr:Project {id: $projectId})
        CREATE (p)-[:WORKED_ON]->(pr)
        `,
        {
          personId,
          projectId,
        }
      );
    }

    // -----------------------------
    // PROJECT -> SKILL
    // -----------------------------

    const projectSkills = [
      ["PR001", "S001"],
      ["PR001", "S002"],
      ["PR001", "S003"],
      ["PR002", "S001"],
      ["PR002", "S002"],
      ["PR002", "S006"],
      ["PR003", "S007"],
      ["PR003", "S008"],
      ["PR004", "S007"],
      ["PR004", "S008"],
      ["PR005", "S011"],
      ["PR005", "S012"],
    ];

    for (const [projectId, skillId] of projectSkills) {
      await session.run(
        `
        MATCH (pr:Project {id: $projectId})
        MATCH (s:Skill {id: $skillId})
        CREATE (pr)-[:USES]->(s)
        `,
        {
          projectId,
          skillId,
        }
      );
    }

    console.log("✅ CareerGraph database seeded successfully!");
    console.log("📊 People: 5");
    console.log("🛠️ Skills: 15");
    console.log("💼 Jobs: 8");
    console.log("🏢 Companies: 5");
    console.log("📁 Projects: 5");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedDatabase();