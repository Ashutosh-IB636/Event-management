import { useEffect, useState } from "react";
import CameraAccess from "./CameraAccess";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { addAttendance } from "../../redux/slice/eventSlice";

function AttendEvent({ eventId, userId }) {
    const [showModal, setShowModal] = useState(false);
    const [permission, setPermission] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [attended, setAttended] = useState(false);
    const allEvents = useSelector(state => state.event.events);
    const dispatch = useDispatch();

    useEffect(() => {
        const event = allEvents.filter(event => event.id === eventId);
        const attends = event[0].attendees?.filter(attendee => attendee.userId === userId).length > 0;
        if(attends){
            setAttended(true);
        }
    }, []);

    function handleAttendEvent(userPhoto, userLocation, timestamp) {
        const attendanceData = {
            userId: userId,
            location: userLocation,
            photo: userPhoto,
            timestamp: timestamp,
        };
        dispatch(addAttendance({ eventId, attendanceData }));
        setShowModal(false);
    }

    function handleAccept() {
        setAttended(true);
        setAccepted(true);
    }

    return (
        <div className='text-white font-semibold rounded-lg flex justify-end hover:cursor-pointer'>
            <Button title={attended ? 'Attended' : 'Attend'} click={()=>!attended && setShowModal(true)} color={attended && 'hover:bg-gray-400'} />

            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 flex-col overflow-auto">
                    {!accepted ? (<div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-center">Terms & Conditions</h2>
                        <p className="text-gray-700 text-sm mb-4">
                            By clicking "Accept", you agree to the following:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                            <li>we need you location access.</li>
                            <li>we will take your camera access.</li>
                        </ul>
                        <input type="checkbox" onClick={() => setPermission(true)} />
                        <p className='text-gray-400 inline pl-2 hover:font-semibold'>I accept all the terms and conditions.</p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-red-400 transition"
                            >
                                Decline
                            </button>
                            <button
                                onClick={permission && handleAccept}
                                className={`px-4 py-2 ${!permission ? 'bg-gray-300' : 'bg-green-500 hover:cursor-pointer'} text-white rounded-xl transition`}
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>) : <CameraAccess onAttend={handleAttendEvent} />}
                </div>
            )}
        </div>
    )
}

export default AttendEvent;