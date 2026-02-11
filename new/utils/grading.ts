import { Subject } from "../types";

export const calculateGradePoint = (marks: number): number => {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;
  return 0;
};

export const calculateSGPA = (subjects: Subject[]): number => {
  let totalCredits = 0;
  let totalProduct = 0;

  subjects.forEach((sub) => {
    if (sub.marks !== undefined || sub.gradePoints !== undefined) {
      const gp = sub.gradePoints !== undefined ? sub.gradePoints : calculateGradePoint(sub.marks || 0);
      totalProduct += (sub.credits * gp);
      totalCredits += sub.credits;
    }
  });

  if (totalCredits === 0) return 0;
  return parseFloat((totalProduct / totalCredits).toFixed(2));
};
