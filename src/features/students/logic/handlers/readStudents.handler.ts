import paginate from "express-paginate";
import { Request, Response } from "express";
import { IStudent, StudentModel, StudentType } from "@fcai-sis/shared-models";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type HandlerRequest = Request;

/*
 * Reads all students
 * */
const fetchPaginatedStudents = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const departmentFilter = req.query.department;
    const levelFilter = req.query.level;
    const genderFilter = req.query.gender;
    const queryFilter = req.query.query;

    const filters: any[] = [];

    if (genderFilter)
      filters.push({
        gender: genderFilter,
      });

    if (queryFilter)
      filters.push({
        // use the query filter on full name and student id and email and phone number
        $or: [
          { fullName: { $regex: queryFilter, $options: "i" } },
          { studentId: { $regex: queryFilter, $options: "i" } },
          { email: { $regex: queryFilter, $options: "i" } },
          { phoneNumber: { $regex: queryFilter, $options: "i" } },
        ],
      });

    const filter: any = {};

    if (filters.length > 0) {
      filter["$and"] = filters;
    }

    const totalStudents = await StudentModel.countDocuments(filter);

    const students = await StudentModel.find<IStudent>(filter)
      .skip(req.skip ?? 0) // pagination
      .limit(req.query.limit as unknown as number);

    return res.status(200).json({
      students,
      totalStudents,
    });
  }),
];

export default fetchPaginatedStudents;
