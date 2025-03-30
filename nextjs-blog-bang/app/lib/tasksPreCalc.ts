// import fs from 'fs';
// import csvParser from 'csv-parser';

// type FamilyHistoryStats = {
//   familyHistory: string;
//   malePercentage: number;
//   femalePercentage: number;
// };

// type CholesterolStats = {
//   gender: string;
//   min: number;
//   q1: number;
//   median: number;
//   q3: number;
//   max: number;
//   outliers: number[];
// };

// const filePath = '../../../project_hear_disease.csv'; // Replace with your actual file path

// function getDataFromCSV(filePath: string): Promise<{ Gender: string; "Family Heart Disease": string; "Cholesterol Level": number }[]> {
//   return new Promise((resolve, reject) => {
//     const results: any[] = [];
//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on('data', (data) => results.push({
//         Gender: data.Gender,
//         "Family Heart Disease": data["Family Heart Disease"],
//         "Cholesterol Level": parseFloat(data["Cholesterol Level"])
//       }))
//       .on('end', () => resolve(results))
//       .on('error', (error) => reject(error));
//   });
// }

// export function calculateFamilyHistory(data: { Gender: string; "Family Heart Disease": string }[]): FamilyHistoryStats[] {
//   const totalMales = data.filter((d) => d.Gender === "Male").length;
//   const totalFemales = data.filter((d) => d.Gender === "Female").length;
  
//   const familyYesMales = data.filter((d) => d.Gender === "Male" && d["Family Heart Disease"] === "Yes").length;
//   const familyYesFemales = data.filter((d) => d.Gender === "Female" && d["Family Heart Disease"] === "Yes").length;
  
//   return [
//     {
//       familyHistory: "Yes",
//       malePercentage: +(familyYesMales / totalMales * 100).toFixed(2),
//       femalePercentage: +(familyYesFemales / totalFemales * 100).toFixed(2),
//     },
//     {
//       familyHistory: "No",
//       malePercentage: +(100 - (familyYesMales / totalMales * 100)).toFixed(2),
//       femalePercentage: +(100 - (familyYesFemales / totalFemales * 100)).toFixed(2),
//     },
//   ];
// }

// export function calculateCholesterolStats(data: { Gender: string; "Cholesterol Level": number }[], gender: string): CholesterolStats {
//     const cholesterolValues = data
//     .filter((d) => d.Gender === gender && d["Cholesterol Level"] !== null)
//     .map((d) => d["Cholesterol Level"])
//     .sort((a, b) => a - b);
  
//   const min = cholesterolValues[0];
//   const max = cholesterolValues[cholesterolValues.length - 1];
//   const q1 = cholesterolValues[Math.floor(cholesterolValues.length * 0.25)];
//   const median = cholesterolValues[Math.floor(cholesterolValues.length * 0.5)];
//   const q3 = cholesterolValues[Math.floor(cholesterolValues.length * 0.75)];
  
//   const iqr = q3 - q1;
//   const lowerBound = q1 - 1.5 * iqr;
//   const upperBound = q3 + 1.5 * iqr;
//   const outliers = cholesterolValues.filter((val) => val < lowerBound || val > upperBound);
  
//   return { gender, min, q1, median, q3, max, outliers };
// }

// export async function generateStatsTask7() {
//   try {
//     const data = await getDataFromCSV(filePath);
//     const familyHistoryData = calculateFamilyHistory(data);
//     return familyHistoryData;
//   } catch (error) {
//     console.error("Error reading CSV file:", error);
//     return null;
//   }
// }

// export async function generateStatsTask8() {
//     try {
//     const data = await getDataFromCSV(filePath);
//     const familyHistoryData = calculateFamilyHistory(data);
//     return familyHistoryData;
//   } catch (error) {
//     console.error("Error reading CSV file:", error);
//     return null;
//   }
// }

