<script setup>
import {ref} from 'vue'

const isLogin = ref(true);
const isRegistration = ref(false);
const isShowTasks = ref(false);

const username = ref();
const password = ref();

const errorPlace = ref();

//Массивы задач
const newTasks = ref([{userid:0, id:0, taskcategory:'new', task:'Кажется нет доступа к серверу'}]);
const workTasks = ref([{userid:0, id:0, taskcategory:'work', task:'Кажется нет доступа к серверу'}]);
const reviewTasks = ref([{userid:0, id:0, taskcategory:'review', task:'Кажется нет доступа к серверу'}]);
const doneTasks = ref([{userid:0, id:0, taskcategory:'done', task:'Кажется нет доступа к серверу'}]);

function getTasks(userid){
  fetch('http://192.168.31.209:3000/gettasks?userid='+userid)
    .then(response => response.json())
    .then(data => {
      newTasks.value = [];
      workTasks.value = [];
      reviewTasks.value = [];
      doneTasks.value = [];
      data.forEach(task => {
        switch(task.taskcategory){
          case 'new':
            newTasks.value.push(task);
            break;
          case 'work':
            workTasks.value.push(task);
            break;
          case 'review':
            reviewTasks.value.push(task);
            break;
          case 'done':
            doneTasks.value.push(task);
            break;
        }
      });

      })
    .catch(error => {
      console.log(error);
    });
}
function logIn(){
  if (username.value=='' || password.value==''){
    errorPlace.value = 'Вы не ввели необходимые данные';
  } else {
    fetch('http://192.168.31.209:3000/login?username='+username.value+'&password='+password.value)
    .then(response => response.json())
    .then(data => {
      if (data.res=='good'){
        errorPlace.value = '';
        getTasks(data.userid);
        toTasks();
      } else{
        errorPlace.value = 'Возможно вы ошиблись в имени пользователя или пароле. Если у вас нет профиля, то зарегистрируйтесь'
      }
      })
    .catch(error => {
      console.log(error);
    });  }

}
function registration(){
  fetch('http://192.168.31.209:3000/registration?username='+username.value+'&password='+password.value)
    .then(response => response.json())
    .then(data => {
      if (data.res=='good'){
        errorPlace.value = 'Вы успешно зарегистрированы';
        getTasks();
        toLogIn();
      } else if (data.res=='already'){
        errorPlace.value = 'Имя пользователя уже занято';
      } else {
        errorPlace.value = 'Проблема на сервере. Попробуйте попозже';
      }
      })
    .catch(error => {
      console.log(error);
    });
}
function deleteTask(task){
  fetch('http://192.168.31.209:3000/deletetask?id='+task.id)
    .then(response => response.json())
    .then(data => {
      if (data.res=='bad'){
        errorPlace.value = 'Ошибка на сервере. Не удалось удалить задачу';
      } else {
        switch(task.taskcategory){
          case 'new':
            newTasks.value = newTasks.value.filter((Task)=>task!=Task);
            break;
          case 'work':
            workTasks.value = workTasks.value.filter((Task)=>task!=Task);
            break;
          case 'review':
            reviewTasks.value = reviewTasks.value.filter((Task)=>task!=Task);
            break;
          case 'done':
            doneTasks.value = doneTasks.value.filter((Task)=>task!=Task);
            break;
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
}
function toRegistration(){
  isLogin.value = false;
  isShowTasks.value = false;
  isRegistration.value = true;
}
function toLogIn(){
  isRegistration.value = false;
  isShowTasks.value = false;
  isLogin.value = true;
}
function toTasks(){
  isLogin.value = false;
  isRegistration.value = false;
  isShowTasks.value = true;
}
</script>

<template>
  <div class="allDiv">
    <div v-if="isLogin">
      <h2 class="errorPlace">{{errorPlace}}</h2>
      <h2>Вход</h2>
      <h3>Имя пользователя</h3>
      <input v-model="username">
      <h3>Пароль</h3>
      <input v-model="password">
      <button @click="logIn()">Войти</button>    
      <p>Еще нет аккаунта? <a @click="toRegistration()">Зарегистрироваться</a></p>
    </div>

    <div v-if="isRegistration">
      <h2 class="errorPlace">{{errorPlace}}</h2>
      <h2>Регистрация</h2>
      <h3>Имя пользователя</h3>
      <input v-model="username">
      <h3>Пароль</h3>
      <input v-model="password">
      <button @click="registration()">Зарегистрироваться</button>
      <p>Уже есть аккаунт? <a @click="toLogIn">Войти</a></p>
    </div>

    <main v-if="isShowTasks">
      <h2 class="errorPlace">{{errorPlace}}</h2>
      <div>
        <div>
          <textarea></textarea>
          <button @click="addNewTask()">Добавить новую задачу</button>
        </div>
        <div v-for="newTask in newTasks" :key="newTask.id">
          <p>{{newTask.task}}</p>
          <button @click="deleteTask(newTask.id)"></button>
        </div> 
      </div>
      <div v-for="workTask in workTasks" :key="workTask.id">
        <p>{{workTask.task}}</p>
        <button @click="deleteTask(workTask.id)"></button>
      </div>
      <div v-for="reviewTask in reviewTasks" :key="reviewTask.id">
        <p>{{reviewTask.task}}</p>
        <button @click="deleteTask(reviewTask.id)"></button>
      </div>
      <div v-for="doneTask in doneTasks" :key="doneTask.id">
        <p>{{doneTask.task}}</p>
        <button @click="deleteTask(doneTask.id)"></button>
      </div>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Jost:wght@100;500&display=swap');
p{
  font-family: 'Didact Gothic', sans-serif;
  font-family: 'Jost', sans-serif;
}
a{
  color: blue;
  font-family: 'Didact Gothic', sans-serif;
  font-family: 'Jost', sans-serif;
}
.allDiv div{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.allDiv div button{
  margin-top:1vmin;
}
h2{
  font-family: 'Didact Gothic', sans-serif;
  font-family: 'Jost', sans-serif;
}
h3{
  font-family: 'Didact Gothic', sans-serif;
  font-family: 'Jost', sans-serif;
}
button{
  font-family: 'Didact Gothic', sans-serif;
  font-family: 'Jost', sans-serif;
}
main{
  display: flex;
  flex-direction: row;
}
main div{
  background-color: aqua;
  display: flex;
  flex-direction: column;
}
.errorPlace{
  color: red;
}
</style>