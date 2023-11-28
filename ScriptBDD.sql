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

