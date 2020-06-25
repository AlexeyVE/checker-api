import Subject from '../models/subjectModel';
import Department from '../models/departmentModel';
import Section from '../models/sectionModel';

export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('topics')
    return res.status(200).json({
      statusCode: 0,
      action: "Get all sections",
      results: sections.length,
      sections
    })
  } catch (error) {
      return res.status(500).json({
        action: "Getting sections error",
        statusCode: 0,
        message: error
      });
  };
};

export const getSection = async (req, res) => {
  try {
    const _id = req.params.id;
    let section = await Section.findById(_id)
    .populate('topics')
    // const task = await Task.findById(req.params.id)      
    if (!section) {
        return res.status(404).json({
          statusCode: 1,
          message: "Не знайдено",
          action: "fail"
        });
    } else {
        return res.status(200).json({
          statusCode: 0,
          action: "Get one section",
          section
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

export const createSection = async (req, res) => {
  try {
    const { title, departmentId, subjectId } = req.body
    const section = await Section.create({
        title,
        department: departmentId,
        subject: subjectId
    });
    let department = await Department.findById(departmentId)
    if (department) {
      department.sections.push(section._id)
      department.save()
    }
    return res.status(201).json({
        action:'Create section',
        statusCode: 0,
        section
    })
  } catch (error) {
      return res.status(500).json({
        action: "fail",
        statusCode: 1,
        message: error
      })
  }
}

export const updateSection = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title } = req.body;
    // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
    //   new:true,
    //   runValidators:true
    // })
    let section = await Section.findOne({_id});
    if  (!section) {
        section = await Section.create({
            title
        })    
        return res.status(201).json({
            action:'Creating a section instead of updating',
            statusCode: 0,
            section
        })
    } else {
        section.title = title
        await section.save()
        return res.status(200).json({
          action:'Update section',
          statusCode: 0,
          section
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

export const deleteSection = async (req, res) => {
  try {
    // await Task.findByIdAndDelete(req.params.id)  
    // Department.deleteOne({_id})
    const _id = req.params.id;
    let section = await Section.deleteOne({_id});
    if (section.deletedCount === 0){
        return res.status(404).json({
          action: "fail",    
          statusCode: 1
        });
    } else {
        return res.status(204).json({
          action: "Delete section",
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