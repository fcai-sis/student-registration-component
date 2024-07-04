import paginate from "express-paginate";
import { Request, Response } from "express";
import {
  AcademicStudentModel,
  DepartmentModel,
  ProgramEnum,
} from "@fcai-sis/shared-models";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type HandlerRequest = Request;

/*
 * Reads all students
 * */
const fetchPaginatedStudents = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const departmentFilter = req.query.department as string | undefined;
    const levelFilter = req.query.level as string | undefined;
    const genderFilter = req.query.gender as string | undefined;
    const queryFilter = req.query.query as string | undefined;

    const departmentQuery = departmentFilter
      ? await DepartmentModel.findOne({
          code: departmentFilter,
        })
      : null;

    const filters: any = {};

    if (departmentQuery) {
      filters["major"] = departmentQuery._id;
    }

    if (levelFilter) {
      filters["level"] = levelFilter;
    }

    const academicStudents = await AcademicStudentModel.find(filters)
      .populate({
        path: "student",
      })
      .populate("major");

    const filteredStudents = academicStudents.filter((academicStudent) => {
      const { student } = academicStudent;

      const genderMatch = genderFilter ? student.gender === genderFilter : true;

      const queryMatch = queryFilter
        ? new RegExp(queryFilter, "i").test(student.fullName) ||
          new RegExp(queryFilter, "i").test(student.studentId) ||
          new RegExp(queryFilter, "i").test(student.email) ||
          new RegExp(queryFilter, "i").test(student.phoneNumber)
        : true;

      return genderMatch && queryMatch;
    });

    const paginatedStudents = filteredStudents.slice(
      req.skip ?? 0,
      (req.skip ?? 0) + (req.query.limit as unknown as number)
    );

    return res.status(200).json({
      students: paginatedStudents.map((academicStudent) => ({
        ...academicStudent.student.toJSON(),
        user: undefined,
        _id: undefined,
        __v: undefined,
        ...{
          ...academicStudent.toJSON(),
          student: undefined,
          _id: undefined,
          __v: undefined,
          major: academicStudent.major ?? {
            name: {
              en: "No Major",
              ar: "بدون تخصص",
            },
            program: ProgramEnum[0],
          },
        },
      })),
      totalStudents: filteredStudents.length,
    });
  }),
];

export default fetchPaginatedStudents;
