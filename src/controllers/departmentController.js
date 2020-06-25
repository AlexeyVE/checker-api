import Department from '../models/departmentModel';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    // populate('subjects')
    return res.status(200).json({
      statusCode: 0,
      action: "Get all departments",
      results: departments.length,
      departments
    });
  } catch (error) {
      return res.status(500).json({
        action: "Getting departments error",
        statusCode: 1,
        message: error
      });
  };
};

export const getDepartment = async (req, res) => {
  try {
    const _id = req.params.id;
    const department = await Department.findById(_id)
    .populate('subjects')
    // const task = await Task.findById(req.params.id)      
    if (!department) {
        return res.status(404).json({
          action: "Getting department error",
          statusCode: 1,
          message: "Підрозділ не знайдено"
        })
    } else {
        return res.status(200).json({
          statusCode: 0,
          action: "Get one department",
          department
        });
    };
  } catch (error) {
      return res.status(500).json({
        action:"Getting department error",
        statusCode: 1,
        message: error
      });
  };
};

export const createDepartment = async (req, res) => {
  try {
    const {title} = req.body;
    const department = await Department.create({
      title
    });
    return res.status(201).json({
      action:'Create department',
      statusCode: 0,
      department
    });
  } catch (error) {
      return res.status(500).json({
        code: 1,
        message:error
      });
  };
};

export const updateDepartment = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title } = req.body;
    // const department = await Department.findByIdAndUpdate(req.params.id,req.body,{
    //   new:true,
    //   runValidators:true
    // })
    let department = await Department.findOne({_id})
    if  (!department){
        department = await Department.create({
          title
        })   
        return res.status(201).json({
          statusCode: 0,
          action: 'Creating a department instead of updating',
          department
        })
    } else {
        department.title = title
        await department.save()
        return res.status(200).json({
          statusCode: 0,
          action:'Update department',
          department
        });
    };
  } catch (error) {
      return res.status(500).json({
        action: "Updating department error",
        statusCode: 0,
        message: error
      });
  };
};

export const deleteDepartment = async (req, res) => {
  try {
    // await Task.findByIdAndDelete(req.params.id)  
    // Department.deleteOne({_id})
    const _id = req.params.id;
    const department = await Department.deleteOne({_id});
    if (department.deletedCount === 0){
        return res.status(404).json({
          statusCode: 1,
          action: "Fail"    
        });
    } else {
        return res.status(204).json({})
    };
  } catch (error) {
      return res.status(500).json({
        action: "Fail",
        statusCode: 1,
        message: error
      });
  };
};