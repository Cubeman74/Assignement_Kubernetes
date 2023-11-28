<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      newTask: {
        task_title: '',
        task_description: ''
      }
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      this.tasks = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    addTask() {
      if (this.newTask.task_title === '' || this.newTask.task_description === '') {
        alert('Please, fill all the fields');
        return;
      }

      axios.post('http://localhost:3000/tasks', this.newTask)
        .then(response => {
          console.log(response.data);
          // Actualiser la liste des tâches après l'ajout
          this.tasks.push(response.data);
          // Vider le formulaire
          this.newTask = {
            task_title: '',
            task_description: ''
          };
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteTask(taskId) {
      axios.delete(`http://localhost:3000/tasks/${taskId}`)
        .then(response => {
          console.log(`Deleted post with ID ${taskId}`);
          // Actualiser la liste des tâches après la suppression
          this.tasks = this.tasks.filter(task => task.task_id !== taskId);
        })
        .catch(error => {
          console.error(error);
        });
    },
    nextTask(taskId) {
      var state = "";
      if(this.tasks[taskId].task_state == "To Do"){
        state = "In Progress"
      }
      else if (this.tasks[taskId].task_state == "In Progress"){
        state = "Done"
      }
      else {
        state = "Done"
      }
      axios.put(`http://localhost:3000/tasks/${this.tasks[taskId].task_id}`, { task_state: state })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
    },
    previousTask(taskId) {
      var state = "";
      if(this.tasks[taskId].task_state == "Done"){
        state = "In Progress"
      }
      else if (this.tasks[taskId].task_state == "In Progress"){
        state = "To Do"
      }
      else {
        state = "To Do"
      }
      axios.put(`http://localhost:3000/tasks/${this.tasks[taskId].task_id}`, { task_state: state })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
    },
}
}

</script>

<template>
  <div class="task-columns">
    <div class="column todoColumn">
      <h2>Todo</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'To Do'" class="taskDiv">
          <div class="headTask">
          <h3 class="titleTask">{{ task.task_title }}</h3>
          <div>
            <span @click="previousTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_left_alt</span>
            <span @click="nextTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_right_alt</span>
            <button @click="deleteTask(task.task_id)" class="material-symbols-outlined">delete</button>            
          </div>
        </div>
        <p>{{ task.task_description }}</p>
        </div>
      </template>
    </div>
    <div class="column inProgressColumn">
      <h2>In Progress</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'In Progress'" class="taskDiv">
          <div class="headTask">
          <h3 class="titleTask">{{ task.task_title }}</h3>
          <div>
            <span @click="previousTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_left_alt</span>
            <span @click="nextTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_right_alt</span>
            <button @click="deleteTask(task.task_id)" class="material-symbols-outlined">delete</button>          
          </div>
        </div>
        <p>{{ task.task_description }}</p>
        </div>
      </template>
    </div>
    <div class="column doneColumn">
      <h2>Done</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'Done'" class="taskDiv">
          <div class="headTask">
          <h3 class="titleTask">{{ task.task_title }}</h3>
          <div>
            <span @click="previousTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_left_alt</span>
            <span @click="nextTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_right_alt</span>
            <button @click="deleteTask(task.task_id)" class="material-symbols-outlined">delete</button>           
          </div>
        </div>
        <p>{{ task.task_description }}</p>
        </div>
      </template>
    </div>
  </div>

  <div id="addButton">
    +
  </div>
  <div id="formTask">
    <h3>Name of the task :</h3>
    <input v-model="newTask.task_title" />
    <h3>Description of the task :</h3>
    <input v-model="newTask.task_description" />
    <br>
    <button @click="addTask()">Add</button>
  </div>
</template>

<style scoped>
.task-columns {
  display: flex;
  justify-content: space-between;
}
.headTask {
  display: flex;
  justify-content: space-between;
}
h3 {
  font-weight: bold;  
  color: rgb(255, 255, 255);
  padding: 7px;  
  white-space: nowrap;
}
#formTask {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: aquamarine;
  border-radius: 10px;
  padding: 7px;
  bottom: 100px;
  right: 20px;
  color: black;
}

#formTask h3 {
  color: #000;
}

#addButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 3em;
  color: black;
  background-color: greenyellow;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.material-symbols-outlined {
  font-size: 1.5rem;
  color: whitesmoke;
  background-color: royalblue;
  border-radius: 50px;
  padding: 7px;
  cursor: pointer;
  margin-left: 5px;
}
.titleTask {
  border-radius: 0 50px 50px 0;
  background-color: rgb(229, 128, 4);
}


.column {
  flex: 1;
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
}
/* Task Pattern */
.taskDiv {
  background-color: whitesmoke;
  border: 1px solid rgb(194, 194, 194);
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
}
/* Backgorund color*/
.todoColumn {
  background-color: #fff4cc;
}

.inProgressColumn {
  background-color: #ccf1ff; 
}

.doneColumn {
  background-color: #d1ffcc;
}
</style>