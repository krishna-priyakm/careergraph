const express = require("express");
const { driver } = require("../config/database");

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (j:Job)
      RETURN j
      ORDER BY j.title
    `);

    const jobs = result.records.map((record) => {
      return record.get("j").properties;
    });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve jobs",
    });
  } finally {
    await session.close();
  }
});

// Get a specific job and its required skills
router.get("/:id", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (j:Job {id: $id})
      OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)

      RETURN
        j,
        collect(s) AS skills
      `,
      {
        id: req.params.id,
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const record = result.records[0];

    const job = record.get("j").properties;

    const skills = record
      .get("skills")
      .filter((skill) => skill !== null)
      .map((skill) => skill.properties);

    res.json({
      success: true,
      data: {
        ...job,
        skills,
      },
    });
  } catch (error) {
    console.error("Error fetching job:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve job",
    });
  } finally {
    await session.close();
  }
});

module.exports = router;