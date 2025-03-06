export default function Analysis({ type }) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        {type === "age" && (
          <>
            <h3 className="text-lg font-semibold text-gray-700">📌 Nhận xét:</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Điều đầu tiên khi ta khảo sát dữ liệu ta thấy rằng độ tuổi khảo sát nằm trong khoảng từ 18 đến 80 tuổi</li>
              <li>Sinh viên ( 18-22 tuổi) có nguy cơ mắc bệnh rất thấp.</li>
              <li>Người ở độ tuổi lao động (22-40) có xu hướng tăng dần phản ánh công việc tác động đến vấn đề quan tâm sức khỏe,  đặc biệt nhóm tuổi (30-40) ghi nhận người mắc bệnh tim cao nhất</li>
              <li>Khi đến nhóm tuổi trung niên (40-60) tỷ lệ mắc bệnh giảm dần phản ánh khi đã có sự tác động của thời gian lên sức khỏe và khả năng tài chính ở nhóm tuổi này cũng ổn định họ có sự quan tâm tới sức khỏe hơn</li>
              <li>Từ sau giai đoạn đó thì tỷ lệ lại tăng dần vì càng già thì bệnh tật là điều không tránh khỏi</li>
            </ul>
          </>
        )}
  
        {type === "gender" && (
          <>
            <h3 className="text-lg font-semibold text-gray-700">📌 Nhận xét:</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Nam giới có tỷ lệ mắc bệnh tim cao hơn nữ giới.</li>
              <li>Estrogen giúp bảo vệ tim mạch ở phụ nữ, thông tin <a href="https://www.vinmec.com/vie/bai-viet/nong-do-estrogen-lien-quan-gi-den-benh-tim-mach-vi">tại đây</a></li>
            </ul>
          </>
        )}
      </div>
    );
  }
  