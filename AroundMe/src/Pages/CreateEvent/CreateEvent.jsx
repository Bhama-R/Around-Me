import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName"); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: userId, 
    startDate: "",
    endDate: "",
    capacity: "",
    foodPreference: "",
    fee: "",
    city: "",
    address: "",
    mapLink: "",
    gender: "",
    ageMin: "",
    ageMax: "",
    place: "",
    accountNumber: "",
    upiId: "",
    ifscCode: "",
    agenda: [{ time: "", title: "" }],
    contacts: [{ name: "", phone: "" }],
    parkingAvailable: "",
    parkingSpace: "",
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/category/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  // handle array fields
  const handleAgendaChange = (index, e) => {
    const updated = [...formData.agenda];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, agenda: updated });
  };

  const handleContactsChange = (index, e) => {
    const updated = [...formData.contacts];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, contacts: updated });
  };

  const addAgenda = () => {
    setFormData({ ...formData, agenda: [...formData.agenda, { time: "", title: "" }] });
  };

  const addContact = () => {
    setFormData({ ...formData, contacts: [...formData.contacts, { name: "", phone: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // Flatten and append
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("createdBy", userId);

      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
      form.append("capacity", formData.capacity);
      form.append("foodPreference", formData.foodPreference);
      form.append("fee", formData.fee);

      // nested objects
      form.append(
        "location",
        JSON.stringify({ city: formData.city, address: formData.address, mapLink: formData.mapLink })
      );

      form.append(
        "restrictions",
        JSON.stringify({
          gender: formData.gender,
          age: { min: formData.ageMin, max: formData.ageMax },
          place: formData.place,
        })
      );

      form.append(
        "paymentDetails",
        JSON.stringify({
          AccountNumber: formData.accountNumber,
          UPIID: formData.upiId,
          IFSCcode: formData.ifscCode,
        })
      );

      form.append("agenda", JSON.stringify(formData.agenda));
      form.append("contacts", JSON.stringify(formData.contacts));

      form.append(
        "parking",
        JSON.stringify({
          parkingAvailable: formData.parkingAvailable,
          parkingSpace: formData.parkingSpace,
        })
      );

      if (image) form.append("image", image);
      attachments.forEach((file) => form.append("attachments", file));

      await axios.post("http://localhost:3000/event", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Event created:", formData);
      navigate("/manage-events");
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className="create-event-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <div>
          <h1>Create New Event</h1>
          <p>Fill in the details to create your event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        {/* Basic Information */}
        <div className="card">
          <h2>Basic Information</h2>
          <div className="grid">
            <div className="form-group">
              <label>Event Title*</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category*</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
           <div className="form-group">
              <label>Created By</label>
              <input
                type="text"
                value={userName || "Unknown User"}
                readOnly
              />
            </div>


          </div>
          <div className="form-group">
            <label>Description*</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
        </div>

        {/* Dates & Capacity */}
        <div className="card">
          <h2>Dates & Capacity</h2>
          <div className="grid">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2>Location</h2>
          <div className="form-group">
            <label>City*</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Map Link</label>
            <input type="url" name="mapLink" value={formData.mapLink} onChange={handleChange} />
          </div>
        </div>

        {/* Restrictions */}
        <div className="card">
          <h2>Restrictions</h2>
          <div className="grid">
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Any</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
                <option value="trans">Trans</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age Min</label>
              <input type="number" name="ageMin" value={formData.ageMin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Age Max</label>
              <input type="number" name="ageMax" value={formData.ageMax} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Place Restriction</label>
            <input type="text" name="place" value={formData.place} onChange={handleChange} />
          </div>
        </div>

        {/* Payment Details */}
        <div className="card">
          <h2>Payment Details</h2>
          <div className="grid">
            <div className="form-group">
              <label>Account Number</label>
              <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Agenda */}
        <div className="card">
          <h2>Agenda</h2>
          {formData.agenda.map((item, i) => (
            <div key={i} className="grid">
              <input
                type="time"
                name="time"
                value={item.time}
                onChange={(e) => handleAgendaChange(i, e)}
              />
              <input
                type="text"
                name="title"
                placeholder="Agenda Title"
                value={item.title}
                onChange={(e) => handleAgendaChange(i, e)}
              />
            </div>
          ))}
          <button type="button" onClick={addAgenda}>
            + Add Agenda Item
          </button>
        </div>

        {/* Contacts */}
        <div className="card">
          <h2>Contacts</h2>
          {formData.contacts.map((c, i) => (
            <div key={i} className="grid">
              <input
                type="text"
                name="name"
                placeholder="Contact Name"
                value={c.name}
                onChange={(e) => handleContactsChange(i, e)}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={c.phone}
                onChange={(e) => handleContactsChange(i, e)}
              />
            </div>
          ))}
          <button type="button" onClick={addContact}>
            + Add Contact
          </button>
        </div>

        {/* Parking */}
        <div className="card">
          <h2>Parking</h2>
          <div className="grid">
            <div className="form-group">
              <label>Parking Available</label>
              <input
                type="text"
                name="parkingAvailable"
                value={formData.parkingAvailable}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Parking Space</label>
              <input
                type="text"
                name="parkingSpace"
                value={formData.parkingSpace}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="form-group">
          <label>Main Event Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label>Attachments</label>
          <input type="file" multiple onChange={(e) => setAttachments(Array.from(e.target.files))} />
        </div>

        {/* Fee & Food */}
        <div className="card">
          <h2>Food & Fee</h2>
          <div className="grid">
            <div className="form-group">
              <label>Food Preference</label>
              <select name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
                <option value="">None</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="jain">Jain</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fee</label>
              <input type="number" name="fee" value={formData.fee} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("/home")}>
            Cancel
          </button>
          <button 
          type="submit" 
          className="btn-primary"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
