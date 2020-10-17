const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root@123',
    database: 'node'
});

mysqlConnection.connect((err) => {
    if(!err) console.log('Connection established.');
    else console.log('Connection not established: '+JSON.stringify(err, undefined, 2));
});

app.listen(4000);

// Add student
app.post('/student/add', (req, res) => {
    mysqlConnection.query(`insert into student(name, enrollment_no, phone_number) values ('${req.body.name}', '${req.body.enrollmentNo}', '${req.body.phoneNumber}')`);
    console.log('Student saved successfully.');
    res.status(201).send(req.body);
});

// Get all students
app.get('/students', (req, res) => {
    mysqlConnection.query('select id, name, enrollment_no, phone_number from student', (err, rows, fields) => {
        if(!err){
            rows.forEach(row => {
                console.log(`${row.id}::${row.name}::${row.enrollment_no}::${row.phone_number}`);
            });
            res.send(rows);
        }
        else res.status(500).send(err);
    });
});

// Get student by id
app.get('/student/:id', (req, res) => {
    mysqlConnection.query(`select id, name, enrollment_no, phone_number from student where id = ${req.params.id}`, (err, rows) => {
        if(!err) res.send(rows[0]);
        else res.status(500).send(err);
    });
});

// Update student
app.put('/student/update', (req, res) => {
    mysqlConnection.query(`update student set name = '${req.body.name}', enrollment_no = '${req.body.enrollmentNo}', phone_number = '${req.body.phoneNumber}'
     where id = ${req.body.id}`, (err, rows) => {
        if(!err) res.status(200).send('Student updated successfully.');
        else res.status(500).send(err);
    });
});

// Delete student by id
app.delete('/student/delete', (req, res) => {
    mysqlConnection.query(`delete from student where id = ${req.query.id}`);
    res.status(200).send('Student deleted successfully.');
});

// Delete all students
app.delete('/students/delete', (req, res) => {
    mysqlConnection.query('delete from student');
    res.status(200).send('Students deleted successfully.');
});