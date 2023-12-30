/**
 * The Student model type.
 */
type StudentType = {
  studentId: number;
  fullName: string;
  address: string;
  status: "active" | "pending" | "inactive";
};

export default StudentType;
