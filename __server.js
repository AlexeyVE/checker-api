const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes') // includes the routes.js file
const cors = require('cors') // includes cors module

require('dotenv').config()

app.use(cors()) // We're telling express to use CORS
app.use(express.json()) // we need to tell server to use json as well
app.use(routes) // tells the server to use the routes in routes.js

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('database connected'))

app.listen(process.env.PORT, () => {
    console.log("The API is running...")
})

*******************************************************
Теперь, когда мы установили routes.jsфайл, нам нужно беспокоиться о создании модели и ее схемы. Для тех, кто не знает об этом, в этом контексте модели являются просто представлением сущности базы данных. Если это все еще не имеет особого смысла, просто следуйте этому посту. Это станет легче, как мы идем.

Итак, давайте создадим папку с именем modelsвнутри нашего srcкаталога. Я уже создал новую коллекцию (это как таблицы в MySQL), которая вызывается questionsв нашей базе данных. При этом давайте создадим новый файл внутри папки моделей с именем Question.js.

Внутри этого файла мы сделаем его схему. Схема похожа на проект сущности базы данных (в данном конкретном случае именованную коллекцию questions). Таким образом, содержание Question.jsбудет похоже на это:


const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    description: String,
    alternatives: [
        {
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ]
})

module.exports = mongoose.model('Question', QuestionSchema)



*************************************************************
const express = require('express')
const router = express.Router()

// get all quiz questions
router.get('/questions', (req, res) => {

})

// get one quiz question
router.get('/questions/:id', (req, res) => {

})

// create one quiz question
router.post('/questions', (req, res) => {

})

// update one quiz question
router.put('/questions/:id', (req, res) => {

})

// delete one quiz question
router.delete('/questions/:id', (req, res) => {

})

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})


module.exports = router

*****************************************************

const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    description: String,
    alternatives: [
        {
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ]
})

module.exports = mongoose.model('Question', QuestionSchema)

***********************************************************************
Теперь, когда у нас есть описание и альтернативы для вопроса, мы будем использовать схему Вопроса для создания нового вопроса. В конце мы вернем код состояния 201 (что означает «создан») вместе с созданным вопросом.

// create one quiz question
router.post('/questions', async (req, res) => {
    try {
        const { description } = req.body
        const { alternatives } = req.body

        const question = await Question.create({
            description,
            alternatives
        })

        return res.status(201).json(question)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


// get all quiz questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find()
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})


// get one quiz question
router.get('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id 

        const question = await Question.findOne({_id})        
        if(!question){
            return res.status(404).json({})
        }else{
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})





router.put('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id 
        const { description, alternatives } = req.body

        let question = await Question.findOne({_id})

        if(!question){
            question = await Question.create({
                description,
                alternatives
            })    
            return res.status(201).json(question)
        }else{
            question.description = description
            question.alternatives = alternatives
            await question.save()
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})



// delete one quiz question
router.delete('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id 

        const question = await Question.deleteOne({_id})

        if(question.deletedCount === 0){
            return res.status(404).json()
        }else{
            return res.status(204).json()
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})