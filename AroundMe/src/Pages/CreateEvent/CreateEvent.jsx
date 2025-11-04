import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("role");

  console.log("👤 Logged-in User ID:", userId);
  console.log("👤 Logged-in Role:", userRole);

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
   location: {
    city: "",
    address: "",
    mapLink: "",
  },
  restrictions: {
    gender: "",
    age: {
    min: "",
    max: "",
    },
    place: "",
  },
    paymentDetails: {
      AccountNumber: "",
      UPIID: "",
      IFSCcode: "",
    },
    agenda: [{ time: "", title: "" }],
    contacts: [{ name: "", phone: "" }],
    parkingAvailable: "",
    parkingSpace: "",
    image: "",
    attachments: [],
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  // ✅ Role check
  useEffect(() => {
    if (!userId || !userRole) {
      alert("Please log in to create an event.");
      navigate("/login");
      return;
    }

    if (!["admin", "event_manager", "member"].includes(userRole)) {
      alert("You do not have permission to create events.");
      navigate("/home");
    }
  }, [userId, userRole, navigate]);

  // ✅ Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/category/categories")
      .then((res) => {
        setCategories(
          Array.isArray(res.data) ? res.data : res.data.categories || []
        );
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Input Handlers
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAgendaChange = (i, e) => {
    const updated = [...formData.agenda];
    updated[i][e.target.name] = e.target.value;
    setFormData({ ...formData, agenda: updated });
  };

  const addAgenda = () =>
    setFormData({
      ...formData,
      agenda: [...formData.agenda, { time: "", title: "" }],
    });

  const handleContactsChange = (i, e) => {
    const updated = [...formData.contacts];
    updated[i][e.target.name] = e.target.value;
    setFormData({ ...formData, contacts: updated });
  };

  const addContact = () =>
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: "", phone: "" }],
    });

  // ✅ Image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImage(reader.result);
    }
  };

  // ✅ Attachments to Base64
  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((base64Files) => {
      setFormData((prev) => ({ ...prev, attachments: base64Files }));
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, image };

    try {
      await axios.post("http://localhost:3000/event", finalData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error("❌ Error creating event:", err.response?.data || err.message);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="create-event-page">

      <div className="create-event-container">
        <div className="create-event-header">
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
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dates & Capacity */}
          <div className="card">
            <h2>Dates & Capacity</h2>
            <div className="grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <h2>Location</h2>
            <div className="form-group">
              <label>City*</label>
                   <select
          name="city"
          value={formData.location.city}
          onChange={(e) =>
        setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, city: e.target.value },
      }))
      }
          required
        >
          <option value="">Select your city</option>
          <option value=" Kochi"> Kochi</option>
          <option value="Fort Kochi">Fort Kochi</option>
          <option value="Mattancherry">Mattancherry</option>
          <option value="Marine Drive">Marine Drive</option>
          <option value="Ernakulam">Ernakulam</option>
          <option value="Kaloor">Kaloor</option>
          <option value="Edappally">Edappally</option>
          <option value="Vyttila">Vyttila</option>
          <option value="Kakkanad">Kakkanad</option>
          <option value="Thrippunithura">Thrippunithura</option>
          <option value="Palarivattom">Palarivattom</option>
          <option value="Panampilly Nagar">Panampilly Nagar</option>
          <option value="Thevara">Thevara</option>
          <option value="Willingdon Island">Willingdon Island</option>
          <option value="Kadavanthra">Kadavanthra</option>
          <option value="Aluva">Aluva</option>
        </select>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, address: e.target.value },
      }))
    }

              />
            </div>
            <div className="form-group">
              <label>Map Link</label>
              <input
                type="url"
                name="mapLink"
                value={formData.location.mapLink}
                  onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, mapLink: e.target.value },
      }))
    }
              />
            </div>
          </div>

          {/* Restrictions */}
<div className="card">
  <h2>Restrictions</h2>
  <div className="grid">
    <div className="form-group">
      <label>Gender</label>
      <select
        name="gender"
        value={formData.restrictions.gender}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            restrictions: { ...prev.restrictions, gender: e.target.value },
          }))
        }
      >
        <option value="">Any</option>
        <option value="male">Male Only</option>
        <option value="female">Female Only</option>
        <option value="trans">Trans</option>
      </select>
    </div>

    <div className="form-group">
      <label>Age Min</label>
      <input
        type="number"
        name="ageMin"
        value={formData.restrictions.age.min}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            restrictions: {
              ...prev.restrictions,
              age: { ...prev.restrictions.age, min: e.target.value },
            },
          }))
        }
      />
    </div>

    <div className="form-group">
      <label>Age Max</label>
      <input
        type="number"
        name="ageMax"
        value={formData.restrictions.age.max}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            restrictions: {
              ...prev.restrictions,
              age: { ...prev.restrictions.age, max: e.target.value },
            },
          }))
        }
      />
    </div>
  </div>

  <div className="form-group">
    <label>Place Restriction</label>
    <input
      type="text"
      name="place"
      value={formData.restrictions.place}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          restrictions: { ...prev.restrictions, place: e.target.value },
        }))
      }
    />
  </div>
</div>


          {/* Payment Details */}
          <div className="card">
            <h2> Fees & Payment Details</h2>
             <div className="grid">
               <div className="form-group">
                <label>Fee</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                />
              </div>
             </div>
            <div className="grid">
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="AccountNumber"
                  value={formData.paymentDetails.AccountNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="UPIID"
                  value={formData.paymentDetails.UPIID}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="IFSCcode"
                  value={formData.paymentDetails.IFSCcode}
                  onChange={handleChange}
                />
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="form-group">
            <label>Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleAttachmentsChange}
            />
          </div>

          {/* Food & Fee */}
          <div className="card">
            <h2>Food</h2>
            <div className="grid">
              <div className="form-group">
                <label>Food Preference</label>
                <select
                  name="foodPreference"
                  value={formData.foodPreference}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="jain">Jain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
