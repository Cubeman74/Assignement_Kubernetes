<!------------------------------------------->
<!------------- /> HomeView ----------------->
<!------------------------------------------->
<script>
import axios from 'axios';

export default {
  // Define the model
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
    // Get the tasks from the API
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      this.tasks = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {

    // For the animation of the panel and the button
    movePanel() {
      var panel = document.getElementById("formTask");
      var button = document.getElementById("addButton");
      panel.classList.toggle("clickedPanel");
      button.classList.toggle("buttonRotate");
    },

    // ====== Add a task ====== //
    addTask() {
       // For checkking if the fields ar not empty, so they not break the app
      if (this.newTask.task_title === '' || this.newTask.task_description === '') {
        alert('Please, fill all the fields');
        return;
      }
      // Send the POST request to the API
      axios.post('http://localhost:3000/tasks', this.newTask)
        .then(response => {
          console.log(response.data);
          // Reaload the list of tasks
          this.tasks.push(response.data);
          // Erase the fields
          this.newTask = {
            task_title: '',
            task_description: ''
          };
          // Reload the page
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
    },
    // ====== Delete a task ====== //
    deleteTask(taskId) {
      // Send the DELETE request to the API
      axios.delete(`http://localhost:3000/tasks/${taskId}`)
        .then(response => {
          console.log(`Deleted post with ID ${taskId}`);
          // Reaload the list of tasks after deleting one
          this.tasks = this.tasks.filter(task => task.task_id !== taskId);
        })
        .catch(error => {
          console.error(error);
        });
    },
    // ====== Change the state of a task (Move to the next step) ====== //
    nextTask(taskId) {
      // Checking the actual state, so he can decide what state to put
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
      // Send the PUT request to the API
      axios.put(`http://localhost:3000/tasks/${this.tasks[taskId].task_id}`, { task_state: state })
      .then((response) => {
        console.log(response.data);
        // Reload the window
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
    },
    // ====== Change the state of a task (Move to the previous step) ====== //
    previousTask(taskId) {
      // Checking the actual state, so he can decide what state to put
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
      // Send the PUT request to the API
      axios.put(`http://localhost:3000/tasks/${this.tasks[taskId].task_id}`, { task_state: state })
      .then((response) => {
        console.log(response.data);
        // Reload the window
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
    <!--===================================================-->
    <!--=================== TODO COLUMN ===================-->
    <!--===================================================-->
    <div class="column todoColumn">
      <h2>Todo</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'To Do'" class="taskDiv">
          <div class="headTask">
            <h3 class="titleTask">{{ task.task_title }}</h3>
            <div>
              <!-- Action Buttons (Change state + deleting a task)-->
              <span @click="previousTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_left_alt</span>
              <span @click="nextTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_right_alt</span>
              <button @click="deleteTask(task.task_id)" class="material-symbols-outlined">delete</button>            
            </div>
          </div>
          <p>{{ task.task_description }}</p>
        </div>
      </template>
    </div>
    <!--===================================================-->
    <!--=============== IN PROGRESS COLUMN ================-->
    <!--===================================================-->
    <div class="column inProgressColumn">
      <h2>In Progress</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'In Progress'" class="taskDiv">
          <div class="headTask">
            <h3 class="titleTask">{{ task.task_title }}</h3>
            <div>
              <!-- Action Buttons (Change state + deleting a task)-->
              <span @click="previousTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_left_alt</span>
              <span @click="nextTask(tasks.indexOf(task))" class="material-symbols-outlined">arrow_right_alt</span>
              <button @click="deleteTask(task.task_id)" class="material-symbols-outlined">delete</button>          
            </div>
          </div>
          <p>{{ task.task_description }}</p>
        </div>
      </template>
    </div>
    <!--===================================================-->
    <!--================== DONE COLUMN ====================-->
    <!--===================================================-->
    <div class="column doneColumn">
      <h2>Done</h2>
      <template v-for="task in tasks" :key="task.task_id" >
        <div v-if="task.task_state == 'Done'" class="taskDiv">
          <div class="headTask">
            <h3 class="titleTask">{{ task.task_title }}</h3>
            <div>
              <!-- Action Buttons (Change state + deleting a task)-->
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
  <!-- Button to show the panel that adding tasks -->
  <div id="addButton" @click="movePanel()">
  +
  </div>
  <!-- Panel that adding tasks -->
  <div id="formTask">
    <h3>Name of the task :</h3>
    <input v-model="newTask.task_title" />
    <h3>Description of the task :</h3>
    <textarea cols="40" rows="5" style="resize: none;" v-model="newTask.task_description"></textarea>
    <br>
    <button @click="addTask()">Add</button>
  </div>
  
</template>

<style scoped>
/*====== Column Style =======*/
.column {
  flex: 1;
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
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
/*====== Task pattern =======*/
h3 {
  font-weight: bold;  
  color: rgb(255, 255, 255);
  padding: 7px;  
  white-space: nowrap;
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

.taskDiv {
  background-color: whitesmoke;
  border: 1px solid rgb(194, 194, 194);
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
}
.task-columns {
  display: flex;
  justify-content: space-between;
}
.headTask {
  display: flex;
  justify-content: space-between;
}

.titleTask {
  border-radius: 0 50px 50px 0;
  background-color: rgb(229, 128, 4);
}



/*====== Panel that adding tasks =======*/
#formTask {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: aquamarine;
  border-radius: 10px;
  padding: 7px;
  bottom: 100px;
  right: -400px;
  color: black;
  transition: right 0.7s ease-in-out;
}

#formTask h3 {
  color: #000;
}

#formTask > button {
  background-color: whitesmoke;
  font-weight: bold;
  border-radius: 10px;
  padding: 7px;
  width: 20%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
 
#formTask > button:hover {
  background-color: grey;
  color: aquamarine;
}

#formTask > button:active {
  background-color: black;
  transform: scale(0.9);
}

/* Panel animation */
.clickedPanel {
  right: 20px !important;
}

/*====== Add Button =======*/
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
  cursor: pointer;
  transition: all 0.7s ease-in-out;
}
.buttonRotate {
  transform: rotate(225deg);
  background-color: black !important;
  color: greenyellow !important;
}
#buttonControl:checked + #formTask {
  right: 100px;
}
</style>