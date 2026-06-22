import {useState} from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");


export default function FriendMenu({user, chatter, friends}){
    const [members, setMembers] = useState([user, chatter]);
    const [message, setMessage] = useState("");
    const createGroup = async () => {
        if (members.length <= 2){
            setMessage("Group needs at least 3 members")
        }else{
            try{
                const response = await fetch("http://localhost:3000/friends/create-group", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({members}),

                });
                const data = await response.json();
                setMessage(data.message);
                socket.emit('reloadFriends');
            }
            catch(err){
                setMessage(err);
            }
        }


    }
    return (
        <div className={"w-155 h-155 bg-gray-700 rounded-2xl fixed top-[10%] right-[25%] flex  flex-col justify-center align-middle "}>
            {message}
            <div className={"w-full min-h-15 flex"}>
                <button className={"bg-gray-800 m-2 p-1 rounded-xl hover:bg-gray-600 duration-300"} onClick={createGroup}>Create</button>
                {members.length !== 0 ?
                    members.map((member, index) => (
                            <div key={index} className={"bg-gray-800 flex rounded-xl w-30 p-2 m-2"}><img src={member.profile_picture} alt={"pfp"} className={"w-7 h-7 rounded-[100%]"}/>{member.login}</div>
                    )) : <></>}
            </div>
            <div className={"w-150 h-138 bg-gray-600 rounded-2xl self-center"}>
                {friends.map((friend, index) => (
                    friend.login !== chatter.login ?
                        <div className={"border-b border-gray-400"}>
                            <div key={index} className="cursor-pointer flex flex-row h-12 p-1 bg-gray-800 mt-1 mb-1 hover:bg-gray-700 duration-200 rounded-2xl" onClick={() => {
                                if (!members.includes(friend)){
                                    setMembers([...members, friend])}}
                            }>
                                <img src={friend.profile_picture} className={"w-10 h-10 border border-gray-100 rounded-[100%]"} alt={"pfp"}/><span className={"font-bold text-xl"}>{friend.login}</span></div>
                        </div> : <></>
                ))}
            </div>
        </div>

    )
}