const express = require('express')
const { Pool } = require('pg');
var cors = require('cors')
const app = express()
const port = 3000


// Connect to the PostgreSQL database
const pool = new Pool({
    user: 'postgres',
    host: 'postgres-service', // name of the Kubernetes service
    database: 'CloudComputing',
    password: 'mdp123',
    port: 5432,
});

app.use(express.json());
app.use(cors()) 


// Initialization of the SQL tables
async function createAlbumsTable() {
    try {
      const query = `
      DO $$
  BEGIN
    BEGIN -- If an error occurs (like the table already exists) then initialize the Database with starting data
      CREATE TYPE Etat AS ENUM ('To Do', 'In Progress', 'Done');
      CREATE TABLE IF NOT EXISTS Task (
        task_id SERIAL PRIMARY KEY,
        task_title VARCHAR(50) NOT NULL,
        task_description VARCHAR(280) NOT NULL,
        task_state Etat DEFAULT 'To Do' NOT NULL
      );
      -- Insert some starting data (it is in french sorry...)
      INSERT INTO Task (task_title, task_description) VALUES ('Manger', 'En particulier tomate mozza');
      INSERT INTO Task (task_title, task_description) VALUES ('Dormir', 'Au moins 8h');
    EXCEPTION
    WHEN duplicate_object THEN
      -- Do nothing (we are not going to re-create the table if it already exists)
    END;
END $$;


      `;
  
      await pool.query(query);
      console.log('Albums table created');
    } catch (err) {
      console.error(err);
      console.error('Albums table creation failed, retrying in 5 seconds...');
      setTimeout(createAlbumsTable, 5000);
    }
}

// Starting
 createAlbumsTable();



// ===================== ROUTES API ===================== //
// GET /tasks
app.get('/tasks', async (req, res) => {
    try {
      const query = 'SELECT * FROM task;';
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('failed');
    }
  });

// GETbyID /tasks/:task_id
app.get('/albums/:task_id', async (req, res) => {
  try {
    const { task_id } = req.params;
    const query = 'SELECT * FROM task WHERE task_id = $1;';
    const { rows } = await pool.query(query, [task_id]);

    if (rows.length === 0) {
      return res.status(404).send('this task is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

// POST /tasks/add
app.post('/tasks', async (req, res) => {
    // Validate the incoming JSON data
    const { task_title, task_description } = req.body;
    console.log(req.body);
    if (!task_title || !task_description ) {
      return res.status(400).send('You\'ve forgotten the task title or description');
    }
  
    try {
      // try to send data to the database
      const query = `
        INSERT INTO task (task_title, task_description)
        VALUES ($1, $2)
        RETURNING task_id;
      `;
      const values = [task_title, task_description];
  
      const result = await pool.query(query, values);
      res.status(201).send({ message: 'New Task created', taskId: result.rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).send('some error has occured');
    }
});

// PUT /tasks/:task_id
app.put('/tasks/:task_id', async (req, res) => {
    try {
      const { task_id } = req.params;
      const { task_state } = req.body;
  
      if (!task_state) {
        return res.status(400).send('Provide a state (but wtf you cant type anything normaly) ');
      }
  
      const query = `
        UPDATE task
        SET task_state = $1
        WHERE task_id = $2
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [task_state, task_id]);
  
      if (rows.length === 0) {
        return res.status(404).send('Cannot find anything');
      }
  
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Some error has occured failed');
    }
  });

// DELETE /tasks/:task_id
app.delete('/tasks/:task_id', async (req, res) => {
  try {
    const { task_id } = req.params;
    const query = 'DELETE FROM task WHERE task_id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [task_id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the task');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});




// Start the API server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})