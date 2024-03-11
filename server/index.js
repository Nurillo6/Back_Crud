const express = require("express");
const bodyParser = require('body-parser')
const { Client } = require('pg')
const PORT = 3001;

const app = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'new_crud',
  password: '123',
  port: '5432',
});

client.connect().then(() => { }).catch((err) => {
  console.error('Error connecting to the database:', err)
});
const cors = require('cors');
app.use(cors());

// function setCorsHeaders(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "x-requested-with, x-auth-token", "application/json");
//   res.setHeader("Access-Control-Max-Age", "3600");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// }

// app.use(setCorsHeaders);

const getUsers = (request, response) => {
  client.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, country, status } = request.body
  client.query('INSERT INTO users (name, country, status) VALUES ($1, $2, $3)', [name, country, status], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Ushbu ${name} yaratildi`)
  })
}

const getById = (request, response) => {
  const id = parseInt(request.params.id)
  client.query('SELECT * FROM users where id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    else {
      response.status(200).json(results.rows[0])
    }
  });

}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, country } = request.body

  client.query('UPDATE users SET name = $1, country = $2 WHERE id = $3', [name, country, id], (error, results) => {
    if (error) {
      throw error
    }
    else {
      response.status(200).send("User updated")
    }
  })
}

const deleteUser = (requset, responce) => {
  const id = parseInt(requset.params.id)

  client.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    else {
      responce.status(200).send("User Delete")
    }
  })
}

app.get('/api/users', getUsers)
app.post('/api/users/add', createUser)
app.get('/api/users/:id', getById)
app.put('/api/users/:id', updateUser)
app.delete('/api/users/:id', deleteUser)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})