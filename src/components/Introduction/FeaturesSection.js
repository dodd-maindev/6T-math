import React from 'react';
import { Brain, Calculator, LineChart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Calculator,
      title: "Phương Pháp Độc Đáo",
      description: "Kết hợp toán học hiện đại với phương pháp giảng dạy sáng tạo",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Brain,
      title: "Phát Triển Tư Duy",
      description: "Rèn luyện tư duy logic và khả năng giải quyết vấn đề",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: LineChart,
      title: "Theo Dõi Tiến Độ",
      description: "Đánh giá và điều chỉnh liên tục để tối ưu kết quả học tập",
      color: "from-pink-400 to-pink-600"
    }
  ];

  return (
    <section className="py-32 px-8 relative">
      <h2 className="text-5xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Điểm Nổi Bật
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group relative p-8 rounded-2xl bg-white backdrop-blur-lg bg-opacity-60 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <feature.icon className="w-12 h-12 mb-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
            <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors">{feature.description}</p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
