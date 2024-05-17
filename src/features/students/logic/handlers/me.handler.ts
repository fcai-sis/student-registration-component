import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";


type HandlerRequest = Request<
  {},
  {},
  {
    userId: string;
  }
>;

/*
 * Find student by Id
 * */
const meHandler = async (req: HandlerRequest, res: Response) => {
    const userId = req.body.userId;
    // read the student from the db
    const student = await StudentModel.findOne({ userId });
    
    if (!student) {
        return res.status(404).json({
        error: {
            message: "Student not found",
        },
        });
    }
    
    return res.status(200).json({
      student: {
        ...student.toObject(),
        },
    });
    }
    export default meHandler;
    
