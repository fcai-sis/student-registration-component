// import { Request, Response } from "express";
// import StagedStudentModel from "../../data/models/stagedStudents.model";
// import HasStudentFields from "../../data/types/hasStudentFields.type";

// type HandlerRequest = Request<
//   {},
//   {},
//   {
//     students: HasStudentFields[];
//     excelColumnsHeaders: string[];
//     registrationSessionId: string;
//   }
// >;

// const updateStagedStudentHandler = async (
//   req: HandlerRequest,
//   res: Response
// ) => {
//   try {
//     // Your existing handler logic here, for example:
//     // const updatedData: HasStudentFields[] = req.body.students;
//     // const registrationSessionId: string = req.body.registrationSessionId;

//     // For demonstration, we will just send a success response
//     res.status(200).json({
//       code: "update-success",
//       message: "Staged student data updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating staged student data:", error);
//     res.status(500).json({
//       code: "update-error",
//       message: "Internal server error while updating staged student data",
//     });
//   }
// };

// export default updateStagedStudentHandler;
