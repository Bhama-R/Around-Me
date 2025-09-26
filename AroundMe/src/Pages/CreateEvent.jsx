import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateEvent.css";

function CreateEvent({ user }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: user?._id || "", // auto-set logged in user
    location: { city: "", address: "", mapLink: "" },
    startDate: "",
    endDate: "",
    capacity: "",
    fee: "",
    restrictions: { gender: "any", age: { min: "", max: "" }, place: "" },
    foodPreference: "none",
    parking: { enabled: false, parkingAvailable: "", parkingSpace: "" },
    agenda: [{ time: "", title: "" }],
    paymentDetails: { AccountNumber: "", UPIID: "", IFSCcode: "" },
  });

  // fetch categories from backend

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category/categories");
        console.log("Categories response:", res.data);
        // If backend sends { categories: [...] }
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]); 
      }
    };
    fetchCategories();
  }, []);
  
  // handle nested field updates
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // toggle parking
  const handleParkingToggle = (val) => {
    setFormData((prev) => ({
      ...prev,
      parking: { ...prev.parking, enabled: val === "yes" },
    }));
  };

  // agenda handlers
  const handleAgendaChange = (index, field, value) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index][field] = value;
    setFormData((prev) => ({ ...prev, agenda: newAgenda }));
  };

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { time: "", title: "" }],
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  // submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/event/", formData);
      alert("Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      <form className="create-event-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <h3>Basic Info</h3>
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        >
        <option value="">Select Category</option>
        {Array.isArray(categories) &&
            categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
            ))}
        </select>

        </div>

        {/* Location */}
        <h3>Location</h3>
        <div className="form-group">
          <label>City</label>
          <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="location.address" value={formData.location.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Google Map Link</label>
          <input type="url" name="location.mapLink" value={formData.location.mapLink} onChange={handleChange} />
        </div>

        {/* Schedule */}
        <h3>Schedule</h3>
        <div className="form-inline">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>

        {/* Capacity  */}
        <h3>Capacity </h3>
        <div className="form-inline">
          <div className="form-group">
            <label>Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
          </div>
        </div>
        
       {/* Payment Type */}
<h3>Payment</h3>
<div className="form-group">
  <label>Event Type</label>
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="isPaid"
        value="false"
        checked={!formData.isPaid}
        onChange={() => setFormData({ ...formData, isPaid: false })}
      />
      Free
    </label>
    <label>
      <input
        type="radio"
        name="isPaid"
        value="true"
        checked={formData.isPaid}
        onChange={() => setFormData({ ...formData, isPaid: true })}
      />
      Paid
    </label>
  </div>
</div>

{/* Payment Details only if Paid */}
{formData.isPaid && (
  <div className="payment-section">
    <h3>Payment Details</h3>
    <div className="form-group">
      <label>Account Number</label>
      <input
        type="text"
        name="paymentDetails.AccountNumber"
        value={formData.paymentDetails.AccountNumber}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>UPI ID</label>
      <input
        type="text"
        name="paymentDetails.UPIID"
        value={formData.paymentDetails.UPIID}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>IFSC Code</label>
      <input
        type="text"
        name="paymentDetails.IFSCcode"
        value={formData.paymentDetails.IFSCcode}
        onChange={handleChange}
      />
    </div>
  </div>
)}


        {/* Restrictions */}
        <h3>Restrictions</h3>
        <div className="form-group">
          <label>Gender Restriction</label>
          <select name="restrictions.gender" value={formData.restrictions.gender} onChange={handleChange}>
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="trans">Trans</option>
          </select>
        </div>
        <div className="form-inline">
          <div className="form-group">
            <label>Min Age</label>
            <input type="number" name="restrictions.age.min" value={formData.restrictions.age.min} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Max Age</label>
            <input type="number" name="restrictions.age.max" value={formData.restrictions.age.max} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Place Restriction</label>
          <input type="text" name="restrictions.place" value={formData.restrictions.place} onChange={handleChange} />
        </div>

        {/* Preferences */}
        <h3>Preferences</h3>
        <div className="form-group">
          <label>Food Preference</label>
          <select name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
            <option value="none">None</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="jain">Jain</option>
          </select>
        </div>

        {/* Parking */}
        <h3>Parking</h3>
        <div className="form-group">
          <label>Parking Available?</label>
          <div className="toggle-options">
            <label>
              <input type="radio" name="parkingToggle" value="yes" checked={formData.parking.enabled === true} onChange={() => handleParkingToggle("yes")} /> Yes
            </label>
            <label>
              <input type="radio" name="parkingToggle" value="no" checked={formData.parking.enabled === false} onChange={() => handleParkingToggle("no")} /> No
            </label>
          </div>
        </div>
        {formData.parking.enabled && (
          <>
            <div className="form-group">
              <label>Parking Type</label>
              <input type="text" name="parking.parkingAvailable" value={formData.parking.parkingAvailable} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Parking Space</label>
              <input type="text" name="parking.parkingSpace" value={formData.parking.parkingSpace} onChange={handleChange} />
            </div>
          </>
        )}

        {/* Agenda */}
        <h3>Agenda</h3>
        {formData.agenda.map((item, index) => (
          <div key={index} className="agenda-row">
            <input type="time" value={item.time} onChange={(e) => handleAgendaChange(index, "time", e.target.value)} />
            <input type="text" placeholder="Activity Title" value={item.title} onChange={(e) => handleAgendaChange(index, "title", e.target.value)} />
            {index > 0 && <button type="button" onClick={() => removeAgendaItem(index)}>Remove</button>}
          </div>
        ))}
        <button type="button" onClick={addAgendaItem}>+ Add Agenda Item</button>


        {/* Submit */}
        <button type="submit" className="submit-btn">Save Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
