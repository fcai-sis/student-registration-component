/**
 * The Student model type.
 */
type StudentType = {
  studentId: string;
  fullName: string;
  address: string;
  status: "active" | "pending" | "inactive";
};

export default StudentType;
