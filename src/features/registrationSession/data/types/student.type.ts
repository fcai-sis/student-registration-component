/**
 * The Student model type.
 */
type StudentType = {
  studentId: string;
  fullName: string;
  groupCode: boolean;
  gender: boolean;
  religion: "muslim" | "christian" | "other";
  nationalId: string;
  administration: string;
  directorate: string;
  phoneNumber: string | undefined;
  educationType: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  governorateId: number;
  nationality: string;
  address: string;
};

export default StudentType;
