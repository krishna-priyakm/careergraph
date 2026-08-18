const express = require("express");
const { driver } = require("../config/database");

const router = express.Router();

// Get all people
router.get("/", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (p:Person)
      RETURN p
      ORDER BY p.name
    `);

    const people = result.records.map((record) => {
      const person = record.get("p").properties;

      return person;
    });

    res.json({
      success: true,
      data: people,
    });
  } catch (error) {
    console.error("Error fetching people:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve people",
    });
  } finally {
    await session.close();
  }
});

// Get a person by ID
router.get("/:id", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
      RETURN p
      `,
      {
        id: req.params.id,
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    const person = result.records[0].get("p").properties;

    res.json({
      success: true,
      data: person,
    });
  } catch (error) {
    console.error("Error fetching person:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve person",
    });
  } finally {
    await session.close();
  }
});

// Get skills of a person
router.get("/:id/skills", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
            -[:HAS_SKILL]->(s:Skill)
      RETURN s
      ORDER BY s.name
      `,
      {
        id: req.params.id,
      }
    );

    const skills = result.records.map((record) => {
      return record.get("s").properties;
    });

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve skills",
    });
  } finally {
    await session.close();
  }
});

// Get missing skills for a specific person and job
router.get("/:id/missing-skills/:jobId", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $personId})
      MATCH (j:Job {id: $jobId})

      MATCH (j)-[:REQUIRES]->(required:Skill)

      OPTIONAL MATCH (p)-[:HAS_SKILL]->(owned:Skill)

      WITH
        j,
        collect(DISTINCT required.name) AS requiredSkills,
        collect(DISTINCT owned.name) AS ownedSkills

      RETURN
        j.title AS job,
        requiredSkills,
        ownedSkills,
        [skill IN requiredSkills
          WHERE NOT skill IN ownedSkills] AS missingSkills
      `,
      {
        personId: req.params.id,
        jobId: req.params.jobId,
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Person or job not found",
      });
    }

    const record = result.records[0];

    const requiredSkills = record.get("requiredSkills");
    const ownedSkills = record.get("ownedSkills");
    const missingSkills = record.get("missingSkills");

    const matchedSkills =
      requiredSkills.length - missingSkills.length;

    const matchPercentage =
      requiredSkills.length > 0
        ? Math.round(
            (matchedSkills / requiredSkills.length) * 100
          )
        : 0;

    res.json({
      success: true,
      data: {
        job: record.get("job"),
        requiredSkills,
        ownedSkills,
        missingSkills,
        matchedSkills,
        totalRequiredSkills: requiredSkills.length,
        matchPercentage,
      },
    });
  } catch (error) {
    console.error(
      "Error calculating missing skills:",
      error.message
    );

    res.status(503).json({
      success: false,
      message: "Unable to calculate missing skills",
    });
  } finally {
    await session.close();
  }
});

// Get recommended jobs and companies
router.get("/:id/recommendations", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
            -[:HAS_SKILL]->(s:Skill)
            <-[:REQUIRES]-(j:Job)
            <-[:OFFERS]-(c:Company)

      WITH
        p,
        j,
        c,
        count(DISTINCT s) AS matchedSkills

      MATCH (j)-[:REQUIRES]->(requiredSkill:Skill)

      WITH
        j,
        c,
        matchedSkills,
        count(DISTINCT requiredSkill) AS totalRequiredSkills

      RETURN
        j.id AS jobId,
        j.title AS job,
        j.experienceLevel AS experienceLevel,
        c.id AS companyId,
        c.name AS company,
        c.location AS location,
        matchedSkills,
        totalRequiredSkills,
        CASE
          WHEN totalRequiredSkills = 0 THEN 0
          ELSE round(
            100.0 * matchedSkills / totalRequiredSkills
          )
        END AS matchPercentage

      ORDER BY matchPercentage DESC, job
      `,
      {
        id: req.params.id,
      }
    );

    const recommendations = result.records.map((record) => ({
      jobId: record.get("jobId"),
      job: record.get("job"),
      experienceLevel: record.get("experienceLevel"),
      companyId: record.get("companyId"),
      company: record.get("company"),
      location: record.get("location"),

      // Convert returned values to JavaScript numbers
      matchedSkills: Number(record.get("matchedSkills")),
      totalRequiredSkills: Number(
        record.get("totalRequiredSkills")
      ),
      matchPercentage: Number(
        record.get("matchPercentage")
      ),
    }));

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error.message
    );

    res.status(503).json({
      success: false,
      message: "Unable to retrieve recommendations",
    });
  } finally {
    await session.close();
  }
});

// Get career graph for a person
router.get("/:id/graph", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})

      OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)

      OPTIONAL MATCH (s)<-[:REQUIRES]-(j:Job)

      OPTIONAL MATCH (j)<-[:OFFERS]-(c:Company)

      RETURN
        p,
        collect(DISTINCT s) AS skills,
        collect(DISTINCT j) AS jobs,
        collect(DISTINCT c) AS companies
      `,
      {
        id: req.params.id,
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    const record = result.records[0];

    const person = record.get("p").properties;

    const skills = record
      .get("skills")
      .map((skill) => skill.properties);

    const jobs = record
      .get("jobs")
      .filter((job) => job !== null)
      .map((job) => job.properties);

    const companies = record
      .get("companies")
      .filter((company) => company !== null)
      .map((company) => company.properties);

    res.json({
      success: true,
      data: {
        person,
        skills,
        jobs,
        companies,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching career graph:",
      error.message
    );

    res.status(503).json({
      success: false,
      message: "Unable to retrieve career graph",
    });
  } finally {
    await session.close();
  }
});

module.exports = router;