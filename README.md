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


# 3. Data Model

CareerGraph uses the following main entities:

| Entity | Description |
|---|---|
| **Person** | Represents a candidate/user |
| **Skill** | Represents a technical skill |
| **Job** | Represents a job opportunity |
| **Company** | Represents a company offering a job |

### Relationships

| Relationship | Meaning |
|---|---|
| `HAS_SKILL` | Connects a person to a skill |
| `REQUIRES` | Connects a job to the skills required for that job |
| `OFFERS` | Connects a company to a job |

### Data Model Diagram

```text
                    HAS_SKILL
       ┌─────────────────────────────┐
       │                             ▼
   Person ───────────────────────> Skill
                                      │
                                      │ REQUIRED BY
                                      ▼
                                     Job
                                      │
                                      │ OFFERED BY
                                      ▼
                                   Company

The main graph traversal used by CareerGraph is:

Person → Skill → Job → Company

This structure allows the application to identify career opportunities based on the skills associated with a candidate.

4. Setup and Run Instructions
Prerequisites

Install the following before running the application:

Node.js
npm
Git
CognoDB
4.1 Clone the Repository
git clone https://github.com/krishna-priyakm/careergraph.git
cd careergraph
4.2 Create the CognoDB Instance

CareerGraph uses CognoDB as its graph database.

Create a CognoDB instance and obtain the database connection details.

The required information is:

Database URI
Username
Password

For a local CognoDB instance, the Bolt connection can be configured as:

bolt://localhost:7687

Make sure the CognoDB instance is running before starting the CareerGraph server.

4.3 Configure the Server

Navigate to the server directory:

cd server

Install the dependencies:

npm install

Create a .env file in the server directory and configure the CognoDB connection.

Example:

COGNODB_URI=bolt://localhost:7687
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password
PORT=5000

Replace the values with the credentials and connection details of your CognoDB instance.

4.4 Configure the Client

Open another terminal and navigate to the client directory:

cd client

Install the dependencies:

npm install
4.5 Start the Server

From the server directory:

npm start

The Express backend starts and provides the APIs used by the React application.

4.6 Start the Client

From the client directory:

npm start

The React application will start in the browser using the development server URL.

5. Main Queries Explained

CareerGraph uses Cypher queries to traverse the graph and retrieve connected career information.

5.1 Find a Candidate's Skills

The application first retrieves the skills associated with a selected candidate.

MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)
RETURN p, s

This query follows:

Person → HAS_SKILL → Skill

It is used to display the candidate's current skills.

5.2 Find Jobs Related to Candidate Skills

The application can traverse from a candidate to their skills and then to jobs requiring those skills.

MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)
RETURN DISTINCT j

This follows:

Person → Skill ← Job

It identifies jobs that have requirements matching the candidate's existing skills.

5.3 Find Companies Offering the Jobs

The graph can be traversed further from the candidate's skills to jobs and then to companies.

MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)<-[:OFFERS]-(c:Company)
RETURN DISTINCT j, c

The traversal is:

Person → Skill ← Job ← Company

This allows the application to display companies associated with relevant career opportunities.

5.4 Calculate Job Skill Match

CareerGraph compares the skills of a candidate with the skills required by a selected job.

Conceptually, the application calculates:

Skill Match Percentage =
(Number of Required Skills the Candidate Has
 / Total Required Skills)
× 100

For example, if a job requires 5 skills and the candidate has 4 of them:

(4 / 5) × 100 = 80%

The application displays this percentage to help the candidate understand how closely their current skills match a job.

5.5 Identify Missing Skills

The graph can also be used to identify skills required by a job that the candidate does not currently have.

MATCH (j:Job {id: $jobId})-[:REQUIRES]->(s:Skill)
WHERE NOT EXISTS {
    MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s)
}
RETURN s

This query returns the skills that are required by the selected job but are not currently associated with the candidate.

These skills can be treated as potential areas for learning or improvement.

5.6 Retrieve the Candidate Graph

CareerGraph provides a graph API for retrieving the connected graph of a candidate.

GET /api/people/P001/graph

For example:

/api/people/P001/graph

The endpoint returns the graph data associated with the candidate, including connected skills and career relationships.

The returned graph is used by the frontend to visualize the candidate's career connections.

6. Screenshots of the UI
6.1 CareerGraph Dashboard




The dashboard allows the user to select a candidate and explore their career information.

6.2 Candidate Skills




This view displays the skills associated with the selected candidate.

6.3 Job Recommendations




This view displays jobs connected to the candidate's existing skills and provides the corresponding skill-match information.

6.4 Missing Skills




This view shows the skills that the candidate needs to develop for a selected job.

6.5 Graph Visualization




The graph visualization shows the relationships between the candidate, skills, jobs, and companies.

The visualization represents the connected career path:

Person → Skill → Job → Company