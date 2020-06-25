import Subject from '../models/subjectModel';
import Department from '../models/departmentModel';
import Section from '../models/sectionModel';

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('sections')
    return res.status(200).json({
      statusCode: 0,
      action: "Get all subjects",
      results: subjects.length,
      subjects
    })
  } catch (error) {
      return res.status(500).json({
        action: "Getting subjects error",
        statusCode: 0,
        message: error
      });
  };
};

export const getSubject = async (req, res) => {
  try {
    const _id = req.params.id;
    let subject = await Subject.findById(_id)
    .populate('sections')
    // const task = await Task.findById(req.params.id)      
    if (!subject) {
        return res.status(404).json({
          statusCode: 1,
          message: "Не знайдено",
          action: "fail"
        });
    } else {
        return res.status(200).json({
          statusCode: 0,
          action: "get one subject",
          subject
        });
    };
  } catch (error) {
      return res.status(500).json({
        action:"fail",
        statusCode: 1,
        message: error
      });
  };
};

export const createSubject = async (req, res, next) => {
  try {
    const { title, departmentId } = req.body
    const subject = await Subject.create({
        title,
        department: departmentId
    });
    let department = await Department.findById(departmentId)
    if (department) {
      department.subjects.push(subject._id)
      department.save()
    }
    return res.status(201).json({
        action:'Create subject',
        statusCode: 0,
        subject
    })
  } catch (error) {
      return res.status(500).json({
        action: "fail",
        statusCode: 1,
        message: error
      })
  }
}

export const updateSubject = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title } = req.body;
    // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
    //   new:true,
    //   runValidators:true
    // })
    let subject = await Subject.findOne({_id});
    if  (!subject) {
        subject = await Subject.create({
            title
        })    
        return res.status(201).json({
            action:'Creating a subject instead of updating',
            statusCode: 0,
            subject
        })
    } else {
        subject.title = title
        await subject.save()
        return res.status(200).json({
          action:'Update subject',
          statusCode: 0,
          subject
        })
    }
  } catch (error) {
      return res.status(500).json({
        action: 'fail',
        statusCode: 1,
        message: error
      })
    }
}

export const deleteSubject = async (req, res) => {
  try {
    // await Task.findByIdAndDelete(req.params.id)  
    // Department.deleteOne({_id})
    const _id = req.params.id;
    let subject = await Subject.deleteOne({_id});
    if (subject.deletedCount === 0){
        return res.status(404).json({
          action: "fail",    
          statusCode: 1
        });
    } else {
        return res.status(204).json({
          action: "Delete subject",
          statusCode: 0
        })
    };
  } catch (error) {
      return res.status(500).json({
        action: 'fail',
        statusCode: 1,
        message: error
      });
    };
};