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
app.get('/task', (req, res) => {
    const filename = req.query.filename || '';
    fs.readFile(`./files/${filename}.txt`, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);   

            res.status(500).send('Error reading task details');
        } else {
            res.render('task', { title: filename, details: data });
        }   
    });
}); 
app.post('/delete', (req, res) => {
    const filename = req.body.filename || '';
    fs.unlink(`./files/${filename}.txt`, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting task');
        } else {
            res.redirect('/');
        }       
    });
});
app.get('/edit', (req, res) => {
    const filename = req.query.filename || '';
    res.render('edit', { title: filename });
});
app.post('/edit', (req, res) => {
    const oldFilename = req.body.previous || '';
    const newFilename = req.body.new ? req.body.new.split(' ').join('') : '';
    fs.rename(`./files/${oldFilename}.txt`, `./files/${newFilename}.txt`, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error renaming task');
        }
        else {
            res.redirect('/');
        }   
    });
});

app.post('/create-task', (req, res) => {
    let filename = req.body.title ? req.body.title.split(' ').join('') : 'Untitled';
    let counter = 1;
    let finalFilename = filename;
    while (fs.existsSync(`./files/${finalFilename}.txt`)) {
        finalFilename = `${filename}(${counter})`;
        counter++;
    }
    fs.writeFile(`./files/${finalFilename}.txt`, req.body.details, (err) => {  
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