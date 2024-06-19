import paginate from "express-paginate";
import { Request, Response } from "express";
import { StudentModel } from "@fcai-sis/shared-models";
import { asyncHandler } from "@fcai-sis/shared-utilities";

type HandlerRequest = Request;

/*
 * Reads all students
 * */
const fetchPaginatedStudents = [
  paginate.middleware(),
  asyncHandler(async (req: HandlerRequest, res: Response) => {
    const filter = {};
    const totalStudents = await StudentModel.countDocuments(filter);

    const students = await StudentModel.find(filter)
      .skip(req.skip ?? 0) // pagination
      .limit(req.query.limit as unknown as number);

    return res.status(200).json({
      students,
      totalStudents,
    });
  }),
];

export default fetchPaginatedStudents;
