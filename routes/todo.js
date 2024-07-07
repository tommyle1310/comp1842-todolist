var express = require('express');
var router = express.Router();
const request = require('request');
var Todo = require('../models/Todo');
//
function create_timestamp() {
    return parseInt(new Date().getTime() / 1000);
}
//this is rending the page without getting data from mongoDB
router.get('/list', function (req, res, next) {
    res.render('todo/list');
});
//this is the API to query the list
router.get('/read_list', function (req, res, next) {
    var todo = new Todo();
    todo.find(
        {},
        { limit: req.query.limit ? req.query.limit : 10 },   //default is 10 item
        '',
        { created_time: -1 }, //latest come first
        function (results) {
            // console.log(results);
            res.json(results);
        });
});
//POST request
router.post('/create_new', async function (req, res, next) {
    try {
        // Check if title and category are provided in request body
        if (!req.body.title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!req.body.category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        // Check if a Todo with the same title already exists
        const existingTodo = await Todo.findOne({ title: req.body.title });
        if (existingTodo) {
            return res.status(400).json({ error: 'Todo with this title already exists' });
        }

        // If no existing Todo with the same title, create a new one
        const todo = new Todo({
            id: req.body.id,
            title: req.body.title,
            category: req.body.category,
            is_active: true,
            created_time: create_timestamp()
        });

        // Save the new Todo
        const savedTodo = await todo.save();
        res.json(savedTodo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.patch('/update_todo/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const updatedFields = {
            title: req.body.title,
            category: req.body.category,
            is_active: true,
        };

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedFields, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});
router.patch('/delete_todo/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const updatedFields = {
            is_active: false,
        };

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedFields, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

//PUT request
router.put('/update_me', function (req, res, next) {
    var movie = new Movie();
    movie.update(
        { _id: req.body['_id'] },
        { year: req.body['year'] },
        function (results) {
            // console.log(results);
            res.json(results);
        });
});

module.exports = router;
