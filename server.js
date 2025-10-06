const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connection successful')
    } catch (error) {
        console.error('Database connection failure', error);
        process.exit(1);
    }
}

connectToDB();

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    dueDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
})

const task = mongoose.model('task', taskSchema);


app.get('/', (req, res) => {
    res.send('welcome to my todo app')
})


app.post('/api/addtask', async (req, res) => {
    try {
        const now = new Date();
        const { title, description, priority, dueDate } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'please fill in all fields'
            })
        }

        const checkIftaskAlreadyExist = await task.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') }, // case-insensitive
            completed: false,
            dueDate: { $gte: now }
        })

        if (checkIftaskAlreadyExist) {
            return res.status(400).json({
                success: false,
                message: 'this task already exist and is not yet completed and stiil has a valid due date'
            })
        }

        const newTask = await task.create({
            title,
            description,
            priority,
            dueDate
        })

        if (newTask) {
            res.status(201).json({
                success: true,
                message: 'task created succesfully'
            })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await task.find()
        if (tasks) {
            res.status(200).json({
                success: true,
                tasks
            })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.put('/api/updateStatus/:id', async (req, res) => {
    try {
        const taskId = req.params.id
        const updatedTask = await task.findByIdAndUpdate(
            taskId,
            { completed: true }, // Just change this specific field
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})


app.delete('/api/deleteTask/:id', async (req, res) => {
    try {
        const taskId = req.params.id
        const deletedTask = await task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            task: deletedTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})


app.listen(port, () => {
    console.log('app is running on port 5000')
})