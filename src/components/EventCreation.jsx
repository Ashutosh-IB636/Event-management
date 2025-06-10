import { MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../redux/slice/eventSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { fetchLocation, fetchSuggestions } from "../utils/api";

function EventCreation() {
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [invitees, setInvitees] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.allUsers);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: nanoid(),
      eventName,
      startTime,
      endTime,
      location,
      invitees,
      attendees: [],
    };
    dispatch(addEvent(newEvent));
    setShowModal(false);
  };

  const fetchCurrentLocation = () => {
    const permission = confirm("Are you ready to share your location");
    if (permission) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const data = await fetchLocation(latitude, longitude);

            if (data.address) {
              setLocation(data.display_name);
            } else {
              alert("Unable to fetch address. Please try again.");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            alert("Failed to fetch address. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Failed to get your location. Please enable location services."
          );
        }
      );
    } else {
      console.log("you denied the location permission");
    }
  };

  const handleAddressChange = async (e) => {
    const input = e.target.value;
    setLocation(input);

    if (input.length > 4) {
      setSuggestions([]);
      try {
        const data = await fetchSuggestions(input);

        if (Array.isArray(data)) {
          const fetchedSuggestions = data.map((item) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
          }));
          setSuggestions(fetchedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name);
    setSuggestions([]);
  };

  const selectManagers = () => {
    setInvitees([]);
    try {
      const allManagers = users.filter((user) => user.group === "manager");
      if (allManagers) {
        allManagers.map((manager) =>
          setInvitees((prev) => [...prev, manager.email])
        );
      }
    } catch (error) {
      console.error("Some error occured while fetching managers", error);
    }
  };

  const selectEmployees = () => {
    setInvitees([]);
    try {
      const allEmployees = users.filter((user) => user.group === "employee");
      if (allEmployees) {
        allEmployees.map((emp) => setInvitees((prev) => [...prev, emp.email]));
      }
    } catch (error) {
      console.error("Some error occured while selecting managers", error);
    }
  };

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  return (
    <div>
      <button
        onClick={handleCreateEvent}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fourth hover:bg-fourth/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fourth transition-colors duration-200"
      >
        <Plus className="h-5 w-5 mr-2" />

        Create Event
      </button>
      {showModal && <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8">
        <div className="bg-first rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Create New Event
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="eventName"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  placeholder="Enter event name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="startTime"
                  >
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="endTime"
                  >
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <button
                    type="button"
                    onClick={fetchCurrentLocation}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <MapPin size={16} />
                    Use current location
                  </button>
                </div>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => handleAddressChange(e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  placeholder="Enter event location"
                />
                {suggestions.length > 0 && (
                  <ul className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="invitees"
                >
                  Invitees
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    id="invitees"
                    value={invitees}
                    onChange={(e) =>
                      setInvitees((prev) => [...prev, e.target.value])
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter email addresses (comma separated)"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={selectManagers}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Select All Managers
                    </button>
                    <button
                      type="button"
                      onClick={selectEmployees}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Select All Employees
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-third text-white py-3 px-6 rounded-lg hover:bg-fourth transition-colors font-medium text-lg"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default EventCreation;
