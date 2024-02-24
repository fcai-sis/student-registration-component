/**
 * The Student model type.
 */
type StudentType = {
  studentId: string;
  fullName: string;
  groupCode: boolean;
  gender: "male" | "female" | "other";
  religion: "muslim" | "christian" | "other";
  nationalId: string;
  administration: string;
  directorate: string;
  phoneNumber: string | undefined;
  educationType: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthPlace: string;
  governorateId: number;
  nationality: string;
  address: string;
  profile: Object;
};

export default StudentType;
