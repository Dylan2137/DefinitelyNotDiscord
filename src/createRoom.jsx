import { useState } from "react";


export default function CreateRoom({userId, setRoomId, setUserLogin}) {
    const [roomLogin, setRoomLogin] = useState("");
    const [message,setMessage] = useState("");
    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/messages/createroom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId, roomLogin}),

            });
            const data = await response.json();
            if (response.ok){
                setMessage(data.message);
                setRoomId(data.roomId);
                setUserLogin(roomLogin)
            }
            else{
                setMessage(data.message);
            }
        }
        catch(err){
            console.log(err);
            setMessage(err)
        }


    }
    return (
        <>

        <input type={"text"} className={"bg-gray-500 rounded-md ml-2 focus:outline-none pl-2"} onChange={(e) => {setRoomLogin(e.target.value)}}></input>
        <button type={"button"} className={"ml-3 bg-gray-700 p-1 rounded-md hover:bg-gray-600"} onClick={handleCreateRoom}>Create Room</button>
        <span className={"ml-2 text-red-200"}>{message}</span>
        </>
    )
}