import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CameraAccess from "./AttendanceVerification/CameraAccess";
import AttendEvent from "./AttendanceVerification/AttendEvent";

function EmployeeEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const allEvents = useSelector((state) => state.event.events);
  const currentUser = useSelector((state) => state.user.current);

  useEffect(() => {
    const fetchEvents = () => {
      try {
        const userEvents = allEvents.filter((event) =>
          event.invitees.includes(currentUser.email)
        );
        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Your Invited Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No events found.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {event.eventName}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                      <span className="text-gray-600">
                        <strong className="text-gray-700">Start: </strong>
                        {event.startTime}
                      </span>
                      <span className="text-gray-600">
                        <strong className="text-gray-700">End: </strong>
                        {event.endTime}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-gray-600">
                        <strong className="text-gray-700">Venue: </strong>
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <AttendEvent eventId={event.id} userId={currentUser.id} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeEvents;
