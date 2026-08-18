# CareerGraph

CareerGraph is a graph-based career exploration and recommendation application built using React, Node.js, Express, and CognoDB.

The application connects candidates, skills, jobs, and companies using graph relationships. Users can select a candidate, explore their current skills, view related career opportunities, identify missing skills for a particular job, and visualize their career connections.

---

## Live Demo

https://careergraph-jrmw.onrender.com/

## GitHub Repository

https://github.com/krishna-priyakm/careergraph

---

# 1. Use Case

CareerGraph helps candidates explore career opportunities based on the skills they already possess.

Instead of treating a candidate, their skills, jobs, and companies as isolated records, CareerGraph models them as connected entities.

For example:

Person → HAS_SKILL → Skill  
Skill → REQUIRES ← Job  
Job → OFFERS ← Company

This allows the application to answer relationship-based questions such as:

- What skills does a candidate currently have?
- Which jobs require those skills?
- Which companies offer those jobs?
- What percentage of a job's required skills does a candidate already possess?
- Which skills are missing for a particular job?
- What career connections exist for a candidate?

---

# 2. Why a Graph Database?

Career recommendations naturally involve relationships between multiple entities.

A relational database could store people, skills, jobs, and companies in separate tables, but queries involving multiple connected entities would require several joins.

A graph database represents these relationships directly.

CareerGraph uses the following relationship path:

Person → Skill → Job → Company

For example:

```text
Person
  │
  │ HAS_SKILL
  ▼
Skill
  │
  │ REQUIRES
  ▼
Job
  │
  │ OFFERS
  ▼
Company