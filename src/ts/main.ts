import axios from 'axios'

axios.get('https://jsonplaceholder.typicode.com/todos')
  .then(data => console.log(data.data))