import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { UploadCloud } from 'lucide-react';
import DatePicker from "react-datepicker";
import appointmentService from '../services/appointmentServices';
import "react-datepicker/dist/react-datepicker.css";


const BookAppointment = () => {
  const token = localStorage.getItem("token");
  const [reportFile, setReportFile] = useState(null);
  const [reportError, setReportError] = useState('');


  const formik = useFormik({
    initialValues: {
      dateTime: '',
      department: '',
      comments: '',
    },
    validationSchema: Yup.object({
      dateTime: Yup.string().required('Date and time is required'),
      department: Yup.string().required('Please select a department'),
      comments: Yup.string().required('Comments are required'),
    }),

    onSubmit: async (values, { resetForm }) => {
      if (!reportFile) {
        setReportError("Report file is required");
        return;
      } else {
        setReportError('');
      }

      const form = new FormData();
      form.append('datetime', values.dateTime);
      form.append('department', values.department);
      form.append('comments', values.comments);
      form.append('report', reportFile);

      try {
        const res = await appointmentService.bookAppointment(form, token);
        toast.success(res.data.message || 'Appointment booked');
        resetForm();
        setReportFile(null);
        setReportError('');
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Error booking appointment');
      }
    }
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-10" >
      <h2 className="text-3xl font-semibold text-center text-[#6a1b9a] mb-6">
        Book an Appointment
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div>
          <label htmlFor="dateTime" className="block font-medium text-gray-700 mb-1">
            Select Date & Time
          </label>
          <DatePicker
            id="dateTime"
            selected={formik.values.dateTime ? new Date(formik.values.dateTime) : null}
            onChange={(date) => formik.setFieldValue('dateTime', date.toISOString())}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy h:mm aa"
            placeholderText="Select date and time..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition"
          />
          {formik.touched.dateTime && formik.errors.dateTime && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.dateTime}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition"
          >
            <option value="">Select</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
          {formik.touched.department && formik.errors.department && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.department}</p>
          )}
        </div>



        {/* Upload Reports */}
        <div>
          <label className="block font-medium text-gray-700 mb-1 flex items-center gap-1">
            <UploadCloud size={18} /> Upload Reports
          </label>
          <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium px-4 py-2 rounded inline-block transition">
            Choose File
            <input
              type="file"
              name="reports"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setReportFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          {/*  {reportFile && (
            <div className="text-sm text-gray-600 mt-2">
              Selected: {reportFile.name}
            </div>
          )}
           {reportError && (
            <p className="text-red-600 text-sm mt-1">{reportError}</p>
          )} */}
          {reportFile && (
            <div className="mt-2">
              <div className="text-sm text-gray-600">Selected: {reportFile.name}</div>

              {reportFile.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(reportFile)}
                  alt="Report Preview"
                  className="mt-2 w-40 h-40 object-cover rounded border"
                />
              )}

              {reportFile.type === 'application/pdf' && (
                <a
                  href={URL.createObjectURL(reportFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-blue-600 underline"
                >
                  Preview PDF
                </a>
              )}
            </div>
          )}

          {reportError && (
            <p className="text-red-600 text-sm mt-1">{reportError}</p>
          )}


        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition"
            placeholder="Any concerns or additional info..."
          />
          {formik.touched.comments && formik.errors.comments && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.comments}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#6a1b9a] hover:bg-[#58117d] text-white font-semibold py-2 rounded-lg transition"
        >
          Book Appointment
        </button>
      </form>
    </div >
  );
};

export default BookAppointment;
