import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  console.log(services);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">Our Services</h2>

      <Slider {...sliderSettings} className="mb-12">
        {services.map((service, index) => (
          <div key={index} className="px-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <img
                src={`http://localhost:5000${service.serviceImagePath}`}
                alt={service.service}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center text-gray-800">{service.service}</h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">FAQs</h2>
        <div className="space-y-4">
          {[
            {
              question: "How do I book an appointment with a doctor?",
              answer: "Simply visit the 'Book Appointment' section, select your preferred department, date, and time, and submit the form."
            },
            {
              question: "Can I upload medical reports while booking?",
              answer: "Yes, you can upload relevant medical reports in PDF, JPG, or PNG format while booking your appointment."
            },
            {
              question: "Is my appointment confirmed instantly?",
              answer: "Once you book, the doctor reviews your request. You'll receive a confirmation via email or SMS."
            }
          ].map((faq, idx) => (
            <details
              key={idx}
              className="bg-white shadow rounded-lg p-4 cursor-pointer open:shadow-md open:ring-2 open:ring-purple-300 transition duration-300"
            >
              <summary className="font-semibold text-lg text-gray-800 mb-1">
                {faq.question}
              </summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
