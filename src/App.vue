<script setup>
import {ref} from 'vue'

const isLogin = ref(true);
const isRegistration = ref(false);
const isShowTasks = ref(false);

const username = ref();
const password = ref();

const errorPlace = ref();

//Массивы задач
const newTasks = ref([]);
const workTasks = ref([]);
const reviewTasks = ref([]);
const doneTasks = ref([]);

function getTasks(){
  fetch('http://192.168.31.209:3000/gettasks?username='+username.value+'&password='+password.value)
    .then(response => response.json())
    .then(data => {
      data.forEach(task => {
        switch(task.category){
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
  fetch('http://192.168.31.209:3000/login?username='+username.value+'&password='+password.value)
    .then(response => response.json())
    .then(data => {
      if (data.res=='good'){
        getTasks();
      } else{
        errorPlace.value = 'Возможно вы ошиблись в имени пользователя или пароле. Если у вас нет профиля, то зарегистрируйтесь'
      }
      })
    .catch(error => {
      console.log(error);
    });
}
function registration(){
  fetch('http://192.168.31.209:3000/registration?username='+username.value+'&password='+password.value)
    .then(response => response.json())
    .then(data => {
      if (data.res=='good'){
        getTasks();
      } else{
        errorPlace.value = 'Проблема на сервере. Попробуйте попозже'
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
</script>

<template>
  <div class="allDiv">
    <div v-if="isLogin">
      <h2>{{errorPlace}}</h2>
      <h2>Вход</h2>
      <h3>Имя пользователя</h3>
      <input v-model="username">
      <h3>Пароль</h3>
      <input v-model="password">
      <button @click="logIn()">Войти</button>    
      <p>Еще нет аккаунта?<a @click="toRegistration()">Зарегистрироваться</a></p>
    </div>

    <div v-if="isRegistration">
      <h2>{{errorPlace}}</h2>
      <h2>Регистрация</h2>
      <h3>Имя пользователя</h3>
      <input v-model="username">
      <h3>Пароль</h3>
      <input v-model="password">
      <button @click="registration()">Зарегистрироваться</button>
      <p>Уже есть аккаунт?<a @click="toLogIn">Войти</a></p>
    </div>

    <main v-if="isShowTasks">
      <div v-for="newTask in newTasks" :key="newTask.id"></div>
      <div v-for="workTask in workTasks" :key="workTask.id"></div>
      <div v-for="reviewTask in reviewTasks" :key="reviewTask.id"></div>
      <div v-for="doneTask in doneTasks" :key="doneTask.id"></div>
    </main>
  </div>
</template>

<style>
a{
  color: blue;
  
}
.allDiv div{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.allDiv div button{
  margin-top:1vmin;
}
</style>