import express from 'express'
// import Task from '../models/TaskModel'
import Task from '../models/TaskModel'

import Department from '../models/DepartmentModel'

import Subject from '../models/SubjectModel'

import Section from '../models/SectionModel'

const router = express.Router()  // includes our model

// get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        return res.status(200).json({
          status:"success",
          count: tasks.length,
          tasks

        })
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one task
router.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id 

        const task = await Task.findOne({_id})
        // const task = await Task.findById(req.params.id)      
        if (!task) {
            return res.status(404).json({
              message:"Завдання не знайдене!!!"
            })
        } else {
            return res.status(200).json({
              status:"success",
              task
            })
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})
router.post('/create-task', async (req, res) => {
    try {
        const { text_before_task,
                task_body,
                task_complexity,
                task_type,
                task_answers,
            } = req.body

        const task = await Task.create({
            text_before_task,
            task_body,
            task_complexity,
            task_type,
            task_answers
        })

        return res.status(201).json({
          status: "success",
          task
        })
    } catch (error) {
        return res.status(500).json({
          status:"fail",
          message :error
        })
    }
})
// create one quiz question
// router.post('/questions', async (req, res) => {
//     try {
//         const { description } = req.body
//         const { alternatives } = req.body

//         const question = await Task.create({
//             description,
//             alternatives
//         })

//         return res.status(201).json(question)
//     } catch (error) {
//         return res.status(500).json({"error":error})
//     }
// })

// update one quiz question
router.put('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id 
        const { description, alternatives } = req.body
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        //   new:true,
        //   runVaalidators:true
        // })
        let question = await Task.findOne({_id})

        if  (!question){
            question = await Task.create({
                description,
                alternatives
            })    
            return res.status(201).json(question)
        } else {
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
        // await Task.findByIdAndDelete(req.params.id)      
        const _id = req.params.id 

        const question = await Task.deleteOne({_id})

        if (question.deletedCount === 0){
            return res.status(404).json()
        } else {
            return res.status(204).json({ 
              code: 0
            })
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

///////////////////departments////////////////////////////////////

router.post('/create-department', async (req, res) => {
    try {
        const { title
            } = req.body

        const department = await Department.create({
            title
        })

        return res.status(201).json({
            action:'created',
            code: 0,
            department
        })
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message:error
        })
    }
})

router.put('/departments/:id', async (req, res) => {
    try {
        const _id = req.params.id 
        const { title } = req.body
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        //   new:true,
        //   runValidators:true
        // })
        let department = await Department.findOne({_id})
        if  (!department){
            department = await Department.create({
                title
            })    
            return res.status(201).json({
                code:0,
                action:'created',
                department
            })
        } else {
            department.title = title
            await department.save()
            return res.status(200).json({
              code: 0,
              action:'updated',
              department
            })
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message: error
        })
    }
})

router.delete('/departments/:id', async (req, res) => {
    try {
        // await Task.findByIdAndDelete(req.params.id)  
        // Department.deleteOne({_id})
        const _id = req.params.id  
        const department = await Department.deleteOne({_id})

        if (department.deletedCount === 0){
            return res.status(404).json({
              code: 1,
              action: "fail"    
            })
        } else {
            return res.status(204).json({})
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          action: error
        })
    }
})

router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find().populate('subjects')
        return res.status(200).json({
          code: 0,
          action: "get_all_dep",
          count: departments.length,
          departments
        })
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message: error
        })
    }
})

router.get('/department/:id', async (req, res) => {
    try {
        const _id = req.params.id 

        const department = await Department.findById(_id)
        .populate('subjects')
        // const task = await Task.findById(req.params.id)      
        if (!department) {
            return res.status(404).json({
              code: 1,
              message: "Підрозділ не знайдено",
              action: "fail"
            })
        } else {
            return res.status(200).json({
              code: 0,
              action: "get one department",
              department
            })
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          action: error,
        })
    }
})
///////////////////////subject//////////////////////////////////////
router.post('/create-subject', async (req, res) => {
    try {
        const { title, departmentId } = req.body
        const subject = await Subject.create({
            title,
            department: departmentId
        })
        let department = await Department.findById(departmentId)
        if (department) {
          department.subjects.push(subject._id)
          department.save()
        }
        return res.status(201).json({
            action:'created',
            code: 0,
            subject,
            department
        })
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message:error
        })
    }
})

router.put('/subjects/:id', async (req, res) => {
    try {
        const _id = req.params.id 
        const { title } = req.body
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        //   new:true,
        //   runValidators:true
        // })
        let subject = await Subject.findOne({_id})
        if  (!subject) {
            subject = await Subject.create({
                title
            })    
            return res.status(201).json({
                code:0,
                action:'created',
                subject
            })
        } else {
            subject.title = title
            await subject.save()
            return res.status(200).json({
              code: 0,
              action:'updated',
              subject
            })
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message: error
        })
    }
})

router.delete('/subjects/:id', async (req, res) => {
    try {
        // await Task.findByIdAndDelete(req.params.id)  
        // Department.deleteOne({_id})
        const _id = req.params.id  
        let subject = await Subject.deleteOne({_id})

        if (subject.deletedCount === 0){
            return res.status(404).json({
              code: 1,
              action: "fail"    
            })
        } else {
            return res.status(204).json({})
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          action: error
        })
    }
})
router.get('/subject/:id', async (req, res) => {
    try {
        const _id = req.params.id 

        let subject = await Subject.findById(_id)
        .populate('sections')
        // const task = await Task.findById(req.params.id)      
        if (!subject) {
            return res.status(404).json({
              code: 1,
              message: "Не знайдено",
              action: "fail"
            })
        } else {
            return res.status(200).json({
              code: 0,
              action: "get one subject",
              subject
            })
        }
    } catch (error) {
        return res.status(500).json({
          code: 1,
          action: error,
        })
    }
})
/////////////////////////subject end/////////////////////////

////////////////////////sections///////////////////////////////
router.post('/create-section', async (req, res) => {
    try {
        const { title, departmentId, subjectId } = req.body
        const section = await Section.create({
            title,
            department: departmentId,
            subject: subjectId
        })
        let subject = await Subject.findById(subjectId);
        if (subject) {
          subject.sections.push(section._id)
          subject.save()
        }
        return res.status(201).json({
            action:'created',
            code: 0,
            section
        })
    } catch (error) {
        return res.status(500).json({
          code: 1,
          message:error
        });
    }
})


/////////////////////////sections end/////////////////////////

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        return res.status(200).json({
          action: "get_all_tsks",
          code: 0,
          result: tasks.length,
          tasks
        })
    } catch (error) {
        return res.status(500).json({
          action: "fail",
          code: 1,
          message: error
        })
    }
})


module.exports = router