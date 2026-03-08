const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        
        res.render('index', { files: files });
        
    });
});
app.get('/task/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}.txt`, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);   

            res.status(500).send('Error reading task details');
        } else {
            res.render('task', { title: req.params.filename, details: data });
        }   
    });
}); 
app.post('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}.txt`, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting task');
        } else {
            res.redirect('/');
        }       
    });
});
app.post('/create-task', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {  
        if (err) {
            console.log(err);
            res.status(500).send('Error creating task');
        } else {
            res.redirect('/');
        }
    });
});
app.listen
(3000, () => {
    console.log('Server is running on port 3000');
});