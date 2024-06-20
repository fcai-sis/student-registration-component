import RegistrationSessionModel from "../src/features/registrationSession/data/models/registrationSession.model";
import StagedStudentModel from "../src/features/registrationSession/data/models/stagedStudents.model";
import MappedStudentModel from "../src/features/common/data/models/mappedStudent.model";
import {
  StudentModel,
  UserModel,
  AcademicStudentModel,
} from "@fcai-sis/shared-models";
import database from "../src/database";

async function resetRegistration() {
  console.log("Resetting registration...");

  console.log("Connecting to database...");
  await database("mongodb://localhost:27017/fcai-sis");
  console.log("Connected to database");

  console.log("Starting...");

  await RegistrationSessionModel.deleteMany({});
  console.log("Registration session has been reset");

  await StagedStudentModel.deleteMany({});
  console.log("Staged students have been reset");

  await MappedStudentModel.deleteMany({});
  console.log("Mapped students have been reset");

  const students = await StudentModel.find();
  for (const student of students) {
    await UserModel.findByIdAndDelete(student.user);
    await AcademicStudentModel.deleteOne({ student: student._id });
  }
  console.log("Users and academic students have been reset");

  await StudentModel.deleteMany({});
  console.log("Students have been reset");

  console.log("Done");
}

resetRegistration().then(() => process.exit(0));
