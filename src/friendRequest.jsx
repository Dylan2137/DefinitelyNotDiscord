import {useEffect, useState, useCallback} from "react";


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
            getRequests();
        }
        catch(err){
            console.log(err);
            setMessage(err.message)
        }

    }
    const rejectRequest = async (e, requestId) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/friends/reject-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({requestId})
            });
            setMessage(response.message);
            getRequests();
        }
        catch(err){
            console.log(err);
        }
    }
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
    useEffect(() => {
        getRequests();
    }, [userId])
    return (
        <div className={"flex flex-col h-screen w-full"}>
            <div id={"header"} className={"bg-gray-900 top-0 w-full h-25"}>
                <h1 className={" text-blue-700 font-bold text-2xl self-center"}>Add friends</h1>
                <input type={"text"} className={"bg-gray-500 rounded-md ml-2 focus:outline-none pl-2"} onChange={(e) => {setTargetLogin(e.target.value)}}></input>
                <button type={"button"} className={"ml-3 bg-gray-700 p-1 rounded-md hover:bg-gray-600"} onClick={handleSendRequest}>Send friend request</button>
                 <span className={"ml-2 text-red-200"}>{message}</span>
            </div>
                {requests.map((req, index) => (
                    <div key={index} className={" bg-gray-950  h-10 rounded-xl w-[25%] text-gray-300  flex justify-between items-center"}>
                        <span className={"p-1"}><b>{req.login}</b></span>
                        <div>
                            <button className={"bg-gray-600 p-1 m-1 rounded-md hover:bg-gray-500"} onClick={(e) => acceptRequest(e, userId, req.sender_id, req.req_id)}>Accept</button>
                            <button className={"bg-gray-600 p-1 m-1 rounded-md hover:bg-gray-500"} onClick={(e) => rejectRequest(e, req.req_id)}>Reject</button>
                        </div>

                    </div>
                ))}
        </div>
    )
}