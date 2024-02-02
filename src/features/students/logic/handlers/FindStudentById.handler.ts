import { Request, Response } from "express";
import StudentModel from "../../../common/data/models/student.model";


type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;

/*
 * Find student by Id
 * */
const findStudentById = async (req: HandlerRequest, res: Response) => {
    const studentId = req.params.studentId;
    // read the student from the db
    const student = await StudentModel.findById(studentId);
    
    if (!student) {
        return res.status(404).json({
        error: {
            message: "Student not found",
        },
        });
    }
    
    return res.status(200).send({
      student: {
        ...student.toObject(),
        },
    });
    }
    export default findStudentById;
    
