import React from 'react';
import Banner from '../components/HomePages/Banner';
import AboutOur from "../components/HomePages/AboutOur";
import Review from '../components/HomePages/Review';
import CourseCarousel from '../components/HomePages/Courses';
import TeacherShowcase from '../components/HomePages/Teacher';
import OutstandingStudents from '../components/HomePages/GoldBoarder';
import NewsSection from '../components/HomePages/News';

function HomePage() {
    return (
        <div className=' bg-gray-50 '>
            <Banner/>
            <AboutOur/>
            <Review/>
            <CourseCarousel/>
            <TeacherShowcase/>
            <OutstandingStudents/>
            <NewsSection/>
            <main>
            </main>
        </div>
    );
}

export default HomePage;