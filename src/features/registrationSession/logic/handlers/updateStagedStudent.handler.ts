import { Request, Response } from "express";
import StagedStudentModel from "../../data/models/stagedStudents.model";
import HasStudentFields from "../../data/types/hasStudentFields.type";

type HandlerRequest = Request<
  {},
  {},
  {
    students: HasStudentFields[];
    excelColumnsHeaders: string[];
    registrationSessionId: string;
    // Do i need to add a Buffer type for the excel file?
  }
>;

const updateStagedStudentHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  try {
    const updatedData: HasStudentFields[] = req.body.students;

    // Fetch the current staged student data
    const currentStagedStudent = await StagedStudentModel.findOne({
      registrationSessionId: req.body.registrationSessionId,
    });

    // If there is no current staged student, create a new one
    if (!currentStagedStudent) {
      await StagedStudentModel.create({
        student: updatedData,
        registrationSessionId: req.body.registrationSessionId,
      });
    } else {
      // Backup the existing data before the update
      currentStagedStudent.backup = currentStagedStudent.student;
      await currentStagedStudent.save();

      // Update the staged student data
      currentStagedStudent.student = updatedData;
      await currentStagedStudent.save();
    }

    //

    // For demonstration, we will just send a success response
    res.status(200).json({
      code: "update-success",
      message: "Staged student data updated successfully",
    });
  } catch (error) {
    console.error("Error updating staged student data:", error);
    res.status(500).json({
      code: "update-error",
      message: "Internal server error while updating staged student data",
    });
  }
};

export default updateStagedStudentHandler;
