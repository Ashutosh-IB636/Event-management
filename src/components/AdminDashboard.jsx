import React, { useState } from "react";
import Button from "./Button";
import EventCreation from "./EventCreation";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Plus, ArrowRight } from "lucide-react";

function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const allEvents = useSelector((state) => state.event.events);
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    setShowForm(true);
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const getEventStatus = (startTime) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diffTime = eventTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: "Past", color: "bg-gray-100 text-gray-800" };
    if (diffDays === 0)
      return { text: "Today", color: "bg-blue-100 text-blue-800" };
    if (diffDays <= 7)
      return { text: "This Week", color: "bg-green-100 text-green-800" };
    return { text: "Upcoming", color: "bg-purple-100 text-purple-800" };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mt-1">Manage and track your events</p>
            </div>
            <EventCreation />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.map((event) => {
            const status = getEventStatus(event.startTime);
            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {event.eventName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {new Date(event.startTime).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {new Date(event.startTime).toLocaleTimeString(
                          undefined,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400"/>
                        <span className="text-sm truncate">
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.invitees && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-sm">
                          {event.invitees.length} invited
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-fourth group-hover:text-fourth/80">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {allEvents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first event to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
