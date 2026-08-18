const express = require("express");
const { driver } = require("../config/database");

const router = express.Router();

// Get all skills
router.get("/", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Skill)
      RETURN s
      ORDER BY s.name
    `);

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

// Get related skills
router.get("/:id/related", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (s:Skill {id: $id})
            -[:RELATED_TO]-(related:Skill)

      RETURN related
      ORDER BY related.name
      `,
      {
        id: req.params.id,
      }
    );

    const skills = result.records.map((record) => {
      return record.get("related").properties;
    });

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching related skills:", error.message);

    res.status(503).json({
      success: false,
      message: "Unable to retrieve related skills",
    });
  } finally {
    await session.close();
  }
});

module.exports = router;