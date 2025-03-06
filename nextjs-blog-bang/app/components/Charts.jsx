'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Analysis from './Analysis';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Charts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/project_heart_disease_filled.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => setData(result.data),
        });
      });
  }, []);

  if (!data) return <p className="text-center text-gray-600 text-lg">📊 Đang tải dữ liệu...</p>;

  const ageBins = [18, 22, 30, 40, 50, 60, 70, 80];
  const ageLabels = ['18-22', '22-30', '30-40', '40-50', '50-60', '60-70', '70-80'];
  const ageGroups = ageLabels.map(() => ({ No: 0, Yes: 0 }));

  data.forEach(row => {
    const age = row.Age;
    const disease = row['Heart Disease Status'];
    for (let i = 0; i < ageBins.length - 1; i++) {
      if (age >= ageBins[i] && age < ageBins[i + 1]) {
        ageGroups[i][disease]++;
        break;
      }
    }
  });

  const barData = {
    labels: ageLabels,
    datasets: [
      { label: 'Không mắc bệnh', data: ageGroups.map(g => g.No), backgroundColor: 'blue' },
      { label: 'Mắc bệnh', data: ageGroups.map(g => g.Yes), backgroundColor: 'red' }
    ]
  };

  const genderData = { Male: { No: 0, Yes: 0 }, Female: { No: 0, Yes: 0 } };
  data.forEach(row => {
    const gender = row.Gender;
    const disease = row['Heart Disease Status'];
    if (genderData[gender]) {
      genderData[gender][disease]++;
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📊 Thống kê bệnh tim</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🔹 Phân bố bệnh tim theo độ tuổi</h3>
        <Bar data={barData} options={{ responsive: true }} />
        <Analysis type="age" />
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🧑 Nam giới</h3>
          <Pie data={{ labels: ['Không mắc bệnh', 'Mắc bệnh'], datasets: [{ data: [genderData.Male.No, genderData.Male.Yes], backgroundColor: ['blue', 'red'] }] }} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">👩 Nữ giới</h3>
          <Pie data={{ labels: ['Không mắc bệnh', 'Mắc bệnh'], datasets: [{ data: [genderData.Female.No, genderData.Female.Yes], backgroundColor: ['blue', 'red'] }] }} />
        </div>
      </div>

      <Analysis type="gender" />
    </div>
  );
}
