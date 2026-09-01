import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, BookOpen, Users, Sparkles, GraduationCap, Coffee } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ManifestationsSection = () => {
  const timeline = [
    {
      year: "2007",
      title: "Khởi Đầu Hành Trình",
      description: "Những buổi gia sư đầu tiên, từng bước đồng hành cùng học trò",
      icon: Coffee
    },
    {
      year: "2010",
      title: "Mở Rộng Lớp Học",
      description: "Thành lập nhóm học đầu tiên từ sự tin tưởng của phụ huynh",
      icon: Users
    },
    {
      year: "2015",
      title: "Phát Triển Phương Pháp",
      description: "Xây dựng phương pháp giảng dạy độc đáo, hiệu quả",
      icon: BookOpen
    },
    {
      year: "2023",
      title: "Câu Lạc Bộ Tư Duy 6T",
      description: "Hiện thực hóa ước mơ về một môi trường học tập toàn diện",
      icon: Star
    }
  ];

  const quotes = [
    "Mỗi đứa trẻ đều là một ngôi sao đang chờ tỏa sáng",
    "Giáo dục không chỉ là truyền đạt kiến thức, mà còn là thắp lửa trong tim",
    "Hạnh phúc lớn nhất là thấy học trò trưởng thành mỗi ngày"
  ];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className="py-16 md:py-32 px-4 md:px-8 relative min-h-screen bg-gradient-to-b from-white to-pink-100 overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full opacity-5" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Lời Tỏ Bày
          </h2>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 md:mb-8" />
        </motion.div>

        {/* Teacher's Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20"
        >
          <div className="relative order-2 md:order-1">
            <motion.img
              src="https://antimatter.vn/wp-content/uploads/2022/11/hinh-anh-anime-nam.jpg"
              alt="Teacher's Journey"
              className="w-full rounded-2xl shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-3 md:p-4 rounded-xl shadow-lg"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <div className="text-sm font-semibold mt-2">16+ Năm</div>
              <div className="text-xs text-gray-600">Kinh Nghiệm</div>
            </motion.div>
          </div>

          <div className="space-y-6 md:space-y-8 order-1 md:order-2">
            <motion.p
              className="text-lg leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Những ngày tháng gắn bó với nghề giáo,chúng tôi đã chứng kiến biết bao câu chuyện về sự trưởng thành, những giấc mơ được vun đắp, và cả những nỗ lực bền bỉ của từng học trò mà chúng tôi may mắn được đồng hành. Chúng tôi bắt đầu hành trình dạy Toán với niềm đam mê và khát khao đơn giản là giúp các em hiểu bài, làm được bài, và tìm thấy niềm vui trong môn học tưởng chừng khô khan này. Ban đầu, chỉ là những buổi dạy gia sư nhỏ lẻ, từng buổi tôi dành trọn tâm huyết để kèm cặp từng học sinh. Thời gian trôi qua, niềm tin yêu của các bậc phụ huynh đã trở thành động lực lớn lao, và chính họ đã đề nghị lập nên một nhóm học sinh để chúng tôi có thể giảng dạy hiệu quả hơn. </motion.p>
            <motion.p
              className="text-lg leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Câu lạc bộ Tư Duy 6T ra đời từ những điều giản dị như thế. Nhưng với tôi, nó không chỉ là một lớp học. Đó là nơi tôi đặt vào tất cả những hoài bão lớn lao nhất của mình. Tôi luôn tin rằng Toán học không chỉ dừng lại ở những con số hay phép tính. Toán học là công cụ để các con rèn luyện tư duy, học cách giải quyết vấn đề, và tìm ra câu trả lời cho những câu hỏi phức tạp của cuộc sống. Câu lạc bộ được thành lập không chỉ để các con làm tốt hơn trong môn học này, mà còn để truyền cảm hứng, khơi dậy khả năng sáng tạo và tiềm năng mà mỗi đứa trẻ đều sở hữu.
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
            Tôi khao khát thấy các con không chỉ hiểu Toán, mà còn học được cách làm chủ tư duy, tự tin đối mặt với những thử thách của thời đại mới – nơi tư duy công nghệ, tư duy tài chính và kỹ năng giải quyết vấn đề là những hành trang không thể thiếu. Với CLB Tư Duy 6T, tôi mong rằng các con sẽ nhìn thấy tương lai của mình rộng mở, không bị giới hạn bởi những rào cản của kiến thức hay tư duy cũ kỹ.  
            Những năm qua, mỗi nụ cười khi các con giải được bài toán khó, mỗi ánh mắt sáng ngời vì nhận ra điều mới lạ, và cả những lời cảm ơn từ phụ huynh đều là nguồn động viên lớn lao giúp tôi thêm vững tin trên con đường mình đã chọn
            </motion.p>
          </div>
        </motion.div>

        {/* Timeline */}
       {/* Timeline */}
<div className="mb-12 md:mb-20">
  <div className="relative">
    {/* Vertical Line */}
    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2 bg-gradient-to-b from-purple-600 to-transparent" />
    
    <div className="relative flex flex-col">
      {timeline.map((item, index) => (
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          key={index}
          className={`flex mb-12 md:mb-16 w-full ${
            index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
          }`}
        >
          <div className={`w-full md:w-[45%] flex ${
            index % 2 === 0 ? 'flex-row' : 'md:flex-row-reverse'
          } items-center pl-8 md:pl-0`}>
            <div className={`w-32 ${
              index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-2'
            }`}>
              <div className="text-2xl font-bold text-purple-600">{item.year}</div>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative z-10">
              <item.icon className="w-6 h-6 text-white" />
            </div>
            
            <div className={`flex-1 ${
              index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'
            }`}>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Inspirational Quotes */}
        {/* Inspirational Quotes */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
  {quotes.map((quote, index) => (
    <div 
      data-aos="fade-up"
      data-aos-anchor-placement="center-bottom"
      key={index}
      className="p-8 bg-white rounded-2xl shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      <Sparkles className="w-8 h-8 text-purple-600 mb-4" />
      <p className="text-lg italic text-gray-700">{quote}</p>
    </div>
  ))}
</div>

       {/* Final Message */}
<div 
  data-aos="fade-up"
  data-aos-anchor-placement="center-bottom"
  className="text-center max-w-3xl mx-auto"
>
  <p className="text-xl leading-relaxed text-gray-700 mb-8">
    Nhìn lại hành trình đã qua, tôi vô cùng tự hào khi thấy các con trưởng thành, không chỉ trong học tập mà còn trong tư duy và nhân cách. Đó chính là phần thưởng lớn nhất đối với tôi - một người giáo viên luôn tận tụy với ước mơ gieo mầm tri thức và dẫn dắt các thế hệ trẻ đi đến những chân trời mới.
  </p>
  <Heart className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
</div>
      </div>
    </section>
  );
};

export default ManifestationsSection;