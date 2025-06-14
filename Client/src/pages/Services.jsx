import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import facilitiesService from '../services/facilitiesServices';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const base_url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await facilitiesService.getAllServices();
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();

    // Responsive check
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // run initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: "unslick" // disables slick on mobile
      }
    ]
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={`${base_url}${service.serviceImagePath}`}
        alt={service.service}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-center text-gray-800">{service.service}</h3>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">Our Services</h2>

      {/* Conditionally render carousel or list */}
      <div className="w-full">
        {isMobile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <ServiceCard key={idx} service={service} />
            ))}
          </div>
        ) : (
          <Slider {...sliderSettings}>
            {services.map((service, idx) => (
              <div key={idx} className="px-3">
                <ServiceCard service={service} />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-12 px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">FAQs</h2>
        <div className="space-y-4">
          {[
            {
              question: "How do I book an appointment with a doctor?",
              answer: "Go to the 'Book Appointment' tab, pick your department, date, and submit."
            },
            {
              question: "Can I upload medical reports?",
              answer: "Yes, upload JPG, PNG or PDF files while booking your appointment."
            },
            {
              question: "Is my appointment confirmed instantly?",
              answer: "You’ll get confirmation via email or SMS after review."
            }
          ].map((faq, i) => (
            <details key={i} className="bg-white shadow rounded-lg p-4 cursor-pointer">
              <summary className="font-medium text-gray-800">{faq.question}</summary>
              <p className="text-gray-600 mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
