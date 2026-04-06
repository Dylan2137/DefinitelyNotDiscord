import { useState } from "react";


export default function FriendRequest({senderId}) {
    const [targetLogin, setTargetLogin] = useState("");
    const [message,setMessage] = useState("");
    const handleFriendRequest = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/messages/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({senderId, targetLogin}),

            });
            const data = await response.json();
            setMessage(data.message);
        }
        catch(err){
            console.log(err);
            setMessage(err)
        }


    }
    return (
        <>

        <input type={"text"} className={"bg-gray-500 rounded-md ml-2 focus:outline-none pl-2"} onChange={(e) => {setTargetLogin(e.target.value)}}></input>
        <button type={"button"} className={"ml-3 bg-gray-700 p-1 rounded-md hover:bg-gray-600"} onClick={handleFriendRequest}>Send friend request</button>
        <span className={"ml-2 text-red-200"}>{message}</span>
        </>
    )
}