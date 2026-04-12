import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
export default function FriendList({userId, setRoomId, login}) {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await fetch('http://localhost:3000/friends/get-friends', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId, login})
                });
                const data = await response.json();
                if (response.ok){
                    setFriends(data);
                }else{
                    console.log(data.message);
                }
            }catch(err){
                console.log(err);
            }
        }
        getFriends();
    }, [userId]);
    return(
        <>
            <div className="flex flex-col h-screen w-[15vw] bg-gray-900">
                <span className={"p-2 text-2xl text-blue-950 bg-gray-500 border-b border-gray-400"}><Link to={"/"} className={"font-bold"} onClick={() => {setRoomId(0)}}>{login}</Link></span>
                {friends.map((friend, index) => (
                    <div className={"border-b border-gray-400"}>
                        <div key={index} className="cursor-pointer p-3 bg-gray-800 mt-1 mb-1 hover:bg-gray-700 duration-200 rounded-2xl" onClick={() => {setRoomId(friend.room_id)}}>{friend.login}</div>
                    </div>

                ))}
            </div>
        </>
    );
}