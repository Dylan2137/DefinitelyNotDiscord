import {useState} from "react";

export default function FriendMenu({userId, chatter, friends}){
    const [memberIds, setMemberIds] = useState([`${userId}/${chatter.user_id}`]);
    return (
        <div className={"w-150 h-150 bg-gray-600 border-20 border-gray-700 fixed top-[10%] right-[25%] rounded-2xl"}>
            {friends.map((friend, index) => (
                friend.login !== chatter.login ?
                <div className={"border-b border-gray-400"}>
                    <div key={index} className="cursor-pointer flex flex-row h-12 p-1 bg-gray-800 mt-1 mb-1 hover:bg-gray-700 duration-200 rounded-2xl" onClick={() => {
                    if (memberIds.includes(friend.user_id)){
                        setMemberIds([...memberIds, friend.uder_id])}}
                    }>
                    <img src={friend.profile_picture} className={"w-10 h-10 border border-gray-100 rounded-[100%]"} alt={"pfp"}/><span className={"font-bold text-xl"}>{friend.login}</span></div>
                </div> : <></>

            ))}
        </div>
    )
}