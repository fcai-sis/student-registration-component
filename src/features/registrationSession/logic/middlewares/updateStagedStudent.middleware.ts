// import { Request, Response, NextFunction } from "express";
// import StagedStudentModel from "../../data/models/stagedStudents.model";
// import HasStudentFields from "../../data/types/hasStudentFields.type";

// const updateStagedStudentMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updatedData: HasStudentFields[] = req.body.students;
//     const excelColumnsHeaders: string[] = req.body.excelColumnsHeaders;

//     // Validate the updated data against the Student model (replace with your validation logic)
//     // const validatedData: HasStudentFields[] = validateStudentData(updatedData, excelColumnsHeaders);

//     // For demonstration, assuming validation passed
//     const validatedData: HasStudentFields[] = updatedData;

//     // Fetch the current staged student data
//     const currentStagedStudent = await StagedStudentModel.findOne({
//       registrationSessionId: req.body.registrationSessionId,
//     });

//     // If there is no current staged student, create a new one
//     if (!currentStagedStudent) {
//       await StagedStudentModel.create({
//         student: validatedData,
//         registrationSessionId: req.body.registrationSessionId,
//       });
//     } else {
//       // Backup the existing data before the update
//       currentStagedStudent.backup = currentStagedStudent.student;
//       await currentStagedStudent.save();

//       // Update the staged student data
//       currentStagedStudent.student = validatedData;
//       await currentStagedStudent.save();
//     }

//     // Continue to the next middleware or the handler
//     next();
//   } catch (error) {
//     console.error("Error updating staged student data:", error);
//     res.status(400).json({
//       code: "update-error",
//       message: "Error updating staged student data",
//     });
//   }
// };

// export default updateStagedStudentMiddleware;
