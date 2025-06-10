import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { fetchLocation } from "../utils/api";

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifiedAttendees, setVerifiedAttendees] = useState([]);
  const allEvents = useSelector((state) => state.event.events);
  const users = useSelector((state) => state.user.allUsers);

  // Function to verify location
  const verifyLocation = async (userLocation, eventLocation) => {
    if (!userLocation || !eventLocation) return false;

    const location = await fetchLocation(
      userLocation.coords.latitude,
      userLocation.coords.longitude
    );
    if (location.display_name === eventLocation) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = allEvents.find((ev) => ev.id === eventId);
        if (eventData) {
          setEvent(eventData);

          const verified = await Promise.all(
            eventData.attendees?.map(async (attendee) => {
              const isVerified = await verifyLocation(
                attendee.location,
                eventData.location
              );
              return {
                ...attendee,
                locationVerified: isVerified,
              };
            }) || []
          );
          setVerifiedAttendees(verified);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, allEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return <div className="min-h-screen bg-gray-100 p-4">Event not found</div>;
  }

  // Calculate attendance statistics
  const totalInvitees = event.invitees?.length || 0;
  const validAttendees = verifiedAttendees.filter(
    (att) => att.locationVerified
  );

  const isOnTime = (arrivalTime, startTime) => {
    const thirtyMinutesInMs = 30 * 60 * 1000;
    const timeDiff = Math.abs(new Date(arrivalTime) - new Date(startTime));
    return timeDiff <= thirtyMinutesInMs;
  };

  const earlyArrivals = validAttendees.filter((att) => {
    const arrivalTime = new Date(att.timestamp);
    const startTime = new Date(event.startTime);
    return arrivalTime < startTime && !isOnTime(att.timestamp, event.startTime);
  });

  const lateArrivals = validAttendees.filter((att) => {
    const arrivalTime = new Date(att.timestamp);
    const startTime = new Date(event.startTime);
    return (
      arrivalTime >= startTime && !isOnTime(att.timestamp, event.startTime)
    );
  });

  const absentCount = totalInvitees - validAttendees.length;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-15">
          <h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-700">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-700">
                {new Date(event.startTime).toLocaleString()} -{" "}
                {new Date(event.endTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-semibold">Early Arrivals</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {earlyArrivals.length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                <span className="font-semibold">Late Arrivals</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {lateArrivals.length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserX className="w-5 h-5 mr-2 text-red-600" />
                <span className="font-semibold">Absent</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-semibold">Total Invited</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {totalInvitees}
              </p>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Guest List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrival Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {event.invitees?.map((email) => {
                  const user = users?.find((u) => u.email === email);
                  const attendance = validAttendees.find(
                    (a) => a.userId === user?.id
                  );
                  let status = "Absent";
                  if (attendance && attendance.locationVerified) {
                    if (isOnTime(attendance.timestamp, event.startTime)) {
                      status = "On Time";
                    } else {
                      status =
                        new Date(attendance.timestamp) <
                        new Date(event.startTime)
                          ? "Early"
                          : "Late";
                    }
                  }

                  return (
                    <tr key={email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user
                            ? `${user.first_name} ${user.last_name}`
                            : email}
                        </div>
                        <div className="text-sm text-gray-500">{email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            status === "Early"
                              ? "bg-green-100 text-green-800"
                              : status === "Late"
                              ? "bg-yellow-100 text-yellow-800"
                              : status === "On Time"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendance ? (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              attendance.locationVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {attendance.locationVerified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance
                          ? new Date(attendance.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
