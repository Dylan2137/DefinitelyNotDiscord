import {useEffect, useState} from "react";


export default function FriendRequest({userId}) {
    const [targetLogin, setTargetLogin] = useState("");
    const [message,setMessage] = useState("");
    const [requests, setRequests] = useState([]);
    const handleSendRequest = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/friends/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId, targetLogin}),

            });
            const data = await response.json();
            setMessage(data.message);
        }
        catch(err){
            console.log(err);
            setMessage(err.message)
        }
    }
    const acceptRequest = async (e, targetId, senderId, requestId) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/friends/accept-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({senderId, userId, requestId}),

            });
            const data = await response.json();
            setMessage(data.message);
        }
        catch(err){
            console.log(err);
            setMessage(err.message)
        }
    }
    useEffect(() => {
        const getRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/friends/get-requests', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId})
                });
                const data = await response.json();
                if (response.ok){
                    setRequests(data);

                }else{
                    console.log(data.message);
                }
            }catch(err){
                console.log(err);
            }
        }
        getRequests();
    }, [userId])
    return (
        <>
        <div id={"header"} className={"bg-gray-900 fixed top-0 w-full"}>
            <h1 className={" text-blue-700 font-bold text-2xl self-center"}>Add friends</h1>
            <input type={"text"} className={"bg-gray-500 rounded-md ml-2 focus:outline-none pl-2"} onChange={(e) => {setTargetLogin(e.target.value)}}></input>
            <button type={"button"} className={"ml-3 bg-gray-700 p-1 rounded-md hover:bg-gray-600"} onClick={handleSendRequest}>Send friend request</button>
            <span className={"ml-2 text-red-200"}>{message}</span>
        </div>
        <div className={"mt-15 bg-gray-950 flex flex-row justify-between items-center h-10"}>
            {requests.map((req, index) => (
                <div key={index} className={" text-gray-300 w-full flex justify-between items-center"}>
                    <span className={"p-1"}>{req.login}</span>
                    <button className={"bg-gray-600 p-1 m-1 rounded-md hover:bg-gray-500"} onClick={(e) => acceptRequest(e, userId, req.sender_id, req.req_id)}>Accept</button>
                </div>
            ))}
        </div>

        </>
    )
}