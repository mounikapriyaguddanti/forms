import React, { useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import { FaUserAlt, FaAddressCard, FaGraduationCap } from 'react-icons/fa';

const graduationDegrees = [
  { name: 'Bachelor of Technology (BTech)', duration: 4 },
  { name: 'Bachelor of Arts (BA)', duration: 3 },
  { name: 'Bachelor of Science (BSc)', duration: 3 },
  { name: 'Bachelor of Commerce (BCom)', duration: 3 }
];

const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',

  // Remaining states...
];

const MultiStepForm = () => {
  const totalSteps = 4;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    mobile: '',
    email: '',
    dob: '',
    gender: '',
    permanentAddress: '',
    currentAddress: '',
    pincode: '',
    state: '',
    city: '',
    country: '',
    isAddressSame: false,
    graduation: '',
    graduationCollege: '',
    graduationSpecialization: '',
    graduationPercentage: '',
    graduationYear: '',
    graduationPassedOutYear: '',
    intermediate: '',
    intermediateCollege: '',
    intermediateSpecialization: '',
    intermediatePercentage: '',
    tenth: '',
    tenthSchool: '',
    tenthPercentage: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (name === 'image') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked
      }));

      if (name === 'isAddressSame' && checked) {
        setFormData(prevState => ({
          ...prevState,
          permanentAddress: prevState.currentAddress,
          pincode: prevState.pincode,
          state: prevState.state,
          city: prevState.city,
          country: prevState.country
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    validateField(name, value);
    if (name === 'graduation') {
      const degree = graduationDegrees.find(degree => degree.name === value);
      setSelectedDegree(degree);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value.includes('@')) {
          error = 'Email must be valid';
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'surname', 'email'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
      return;
    }

    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let storedData = JSON.parse(localStorage.getItem('formData')) || [];
    if (!Array.isArray(storedData)) {
      storedData = [];
    }
    const newData = { ...formData };
    storedData.push(newData);
    localStorage.setItem('formData', JSON.stringify(storedData));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (window.confirm('Form Submitted Successfully! Do you want to download the PDF?')) {
        downloadPDF();
      } else {
        resetForm();
      }
    }
  };

  const validateFormData = (data) => {
    let errors = {};
    if (!data.email.includes('@')) {
      errors.email = 'Email must be valid';
    }
    return errors;
  };

  const generateYearOptions = (degree) => {
    if (!degree) return [];

    const options = [];
    for (let i = 1; i <= degree.duration; i++) {
      options.push(
        <option key={i} value={`Year ${i}`}>
          {`Year ${i}`}
        </option>
      );
    }
    return options;
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add image to the PDF
    if (formData.image) {
      const imgData = new Image();
      imgData.src = URL.createObjectURL(formData.image);
  
      imgData.onload = () => {
        const maxWidth = doc.internal.pageSize.getWidth() - 20; // Maximum width for the image
        const maxHeight = 50; // Maximum height for the image
  
        let imgWidth = imgData.width;
        let imgHeight = imgData.height;
  
        // Calculate aspect ratio to maintain image proportions
        const aspectRatio = imgWidth / imgHeight;
  
        // Calculate dimensions while maintaining aspect ratio
        if (imgWidth > maxWidth) {
          imgWidth = maxWidth;
          imgHeight = imgWidth / aspectRatio;
        }
  
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * aspectRatio;
        }
  
        // Position and size of the image
        const x = doc.internal.pageSize.getWidth() - imgWidth - 20;
        const y = 20;
  
        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        addTextToPDF(doc);
        doc.save('form-data.pdf');
      };
    } else {
      addTextToPDF(doc);
      doc.save('form-data.pdf');
    }
  };
  

  
  const addTextToPDF = (doc) => {
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 40); // Start text after the image
    doc.text(`Surname: ${formData.surname}`, 20, 50);
    doc.text(`Mobile: ${formData.mobile}`, 20, 60);
    doc.text(`Email: ${formData.email}`, 20, 70);
    doc.text(`Date of Birth: ${formData.dob}`, 20, 80);
    doc.text(`Gender: ${formData.gender}`, 20, 90);
    doc.text(`Permanent Address: ${formData.permanentAddress}`, 20, 100);
    doc.text(`Current Address: ${formData.currentAddress}`, 20, 110);
    doc.text(`Pincode: ${formData.pincode}`, 20, 120);
    doc.text(`State: ${formData.state}`, 20, 130);
    doc.text(`City: ${formData.city}`, 20, 140);
    doc.text(`Country: ${formData.country}`, 20, 150);
    doc.text(`Graduation: ${formData.graduation}`, 20, 160);
    doc.text(`Graduation College: ${formData.graduationCollege}`, 20, 170);
    doc.text(`Graduation Specialization: ${formData.graduationSpecialization}`, 20, 180);
    doc.text(`Graduation Percentage: ${formData.graduationPercentage}`, 20, 190);
    doc.text(`Graduation Year: ${formData.graduationYear}`, 20, 200);
    doc.text(`Graduation Passed Out Year: ${formData.graduationPassedOutYear}`, 20, 210);
    doc.text(`Intermediate: ${formData.intermediate}`, 20, 220);
    doc.text(`Intermediate College: ${formData.intermediateCollege}`, 20, 230);
    doc.text(`Intermediate Specialization: ${formData.intermediateSpecialization}`, 20, 240);
    doc.text(`Intermediate Percentage: ${formData.intermediatePercentage}`, 20, 250);
    doc.text(`10th: ${formData.tenth}`, 20, 260);
    doc.text(`10th School: ${formData.tenthSchool}`, 20, 270);
    doc.text(`10th Percentage: ${formData.tenthPercentage}`, 20, 280);
  };
 
 
  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      mobile: '',
      email: '',
      dob: '',
      gender: '',
      permanentAddress: '',
      currentAddress: '',
      pincode: '',
      state: '',
      city: '',
      country: '',
      isAddressSame: false,
      graduation: '',
      graduationCollege: '',
      graduationSpecialization: '',
      graduationPercentage: '',
      graduationYear: '',
      graduationPassedOutYear: '',
      intermediate: '',
      intermediateCollege: '',
      intermediateSpecialization: '',
      intermediatePercentage: '',
      tenth: '',
      tenthSchool: '',
      tenthPercentage: '',
      image: null,
    });
    setStep(1);
    setIsSubmitted(false);
  };

  return (
    <div className="multi-step-form">
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
           {Math.round(progress)}%
          </div>
      </div>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <h2><FaUserAlt /> Personal Details</h2>
            <div className="input-group">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="input-group">
              <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="tel" name="mobile" pattern='[0-9]{10}' placeholder="Mobile" value={formData.mobile} className="input" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>
                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} required /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} required /> Female
              </label>
              <label>
                <input type="radio" name="gender" value="Transgender" checked={formData.gender === 'Transgender'} onChange={handleChange} required /> Transgender
              </label>
            </div>
            <div className="input-group">
              <input type="file" name="image" className='input' accept="image/*" onChange={handleChange} required />
            </div>
            <div className="button-group">
              <button type="submit">Next</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="form-step">
            <h2><FaAddressCard /> Address</h2>
            <div className="input-group">
              <input type="text" name="currentAddress" placeholder="Current Street Address" value={formData.currentAddress} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="city" placeholder="Current City" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input
                className="input"
                list="states"
                name="state"
                placeholder="Current State"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <datalist id="states">
                {indianStates.map((state, index) => (
                  <option key={index} value={state} />
                ))}
              </datalist>
            </div>
            <div className="input-group">
              <input type="text" name="pincode" placeholder="Current Pincode" value={formData.pincode} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="country" placeholder="Current Country" value={formData.country} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>
                <input type="checkbox" name="isAddressSame" checked={formData.isAddressSame} onChange={handleChange} /> Permanent address is same as current address
              </label>
            </div>
            {!formData.isAddressSame && (
              <>
                <div className="input-group">
                  <input type="text" name="permanentAddress" placeholder="Permanent Street Address" value={formData.permanentAddress} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input type="text" name="city" placeholder="Permanent City" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input
                    className="input"
                    list="states"
                    name="state"
                    placeholder="Permanent State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <datalist id="states">
                    {indianStates.map((state, index) => (
                      <option key={index} value={state} />
                    ))}
                  </datalist>
                </div>
                <div className="input-group">
                  <input type="text" name="pincode" placeholder="Permanent Pincode" value={formData.pincode} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input type="text" name="country" placeholder="Permanent Country" value={formData.country} onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="button-group">
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
              <button type="submit">Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="form-step">
            <h2><FaGraduationCap /> Education Details</h2>
            <h3>Degree</h3>
            <div className="input-group">
              <select
                name="graduation"
                placeholder="Graduation" className="input"
                value={formData.graduation}
                onChange={handleChange}
                required
              >
                <option value="">Select Graduation</option>
                {graduationDegrees.map((degree, index) => (
                  <option key={index} value={degree.name}>
                    {degree.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <input type="text" name="graduationCollege" placeholder="College Name" value={formData.graduationCollege} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="graduationSpecialization" placeholder="Specialization" value={formData.graduationSpecialization} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="number" min="0" max="100" className="input" name="graduationPercentage" placeholder="Percentage" value={formData.graduationPercentage} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <select
                name="graduationYear"
                placeholder="Year" className="input"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                {generateYearOptions(selectedDegree)}
              </select>
            </div>
            <div className="input-group">
              <input type="number" name="graduationPassedOutYear" className="input" placeholder="Passed Out Year" value={formData.graduationPassedOutYear} onChange={handleChange} required />
            </div>
            <h3>Intermediate/Diploma</h3>
            <div className="input-group">
              <input type="text" name="intermediate" placeholder="Degree" value={formData.intermediate} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="intermediateCollege" placeholder="College Name" value={formData.intermediateCollege} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="intermediateSpecialization" placeholder="Specialization" value={formData.intermediateSpecialization} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="number" min="0" max="100" className="input" name="intermediatePercentage" placeholder="Percentage" value={formData.intermediatePercentage} onChange={handleChange} required />
            </div>
            <h3>10th</h3>
            <div className="input-group">
              <input type="text" name="tenth" placeholder="School Name" value={formData.tenth} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="number" min="0" max="100" className="input" name="tenthPercentage" placeholder="Percentage" value={formData.tenthPercentage} onChange={handleChange} required />
            </div>
            <div className="button-group">
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
              <button type="submit">Next</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="form-step">
            <h2>Preview</h2>
            <div className="preview-section">
            <p>Name: {formData.name}</p>
            <p>Surname: {formData.surname}</p>
            <p>Image:
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </p>
            <p>Mobile: {formData.mobile}</p>
            <p>Email: {formData.email}</p>
            <p>Date of Birth: {formData.dob}</p>
            <p>Gender: {formData.gender}</p>
            <p>Permanent Address: {formData.permanentAddress}</p>
            <p>Current Address: {formData.currentAddress}</p>
            <p>Pincode: {formData.pincode}</p>
            <p>State: {formData.state}</p>
            <p>City: {formData.city}</p>
            <p>Country: {formData.country}</p>
            <p>Graduation: {formData.graduation}</p>
            <p>Graduation College: {formData.graduationCollege}</p>
            <p>Graduation Specialization: {formData.graduationSpecialization}</p>
            <p>Graduation Percentage: {formData.graduationPercentage}</p>
            <p>Graduation Year: {formData.graduationYear}</p>
            <p>Graduation Passed Out Year: {formData.graduationPassedOutYear}</p>
            <p>Intermediate: {formData.intermediate}</p>
            <p>Intermediate College: {formData.intermediateCollege}</p>
            <p>Intermediate Specialization: {formData.intermediateSpecialization}</p>
            <p>Intermediate Percentage: {formData.intermediatePercentage}</p>
            <p>10th: {formData.tenth}</p>
            <p>10th Percentage: {formData.tenthPercentage}</p>
            </div>
            <div className="button-group">
              <button type="button" onClick={() => setStep(3)}>Update</button>
              <button type="button" onClick={resetForm}>Delete</button>
              <button type="submit" className="final-submit">Submit</button>
            </div>
          </div>
        )}
        {isSubmitted && (
          <div className="success-page">
            <h1>Form Submitted Successfully!</h1>
            <p>Thank you for completing the form.</p>
            <button onClick={() => {
              if (window.confirm('Do you want to download the PDF?')) {
                downloadPDF();
              }
            }}>Download PDF</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MultiStepForm;