import { useState, useEffect, useCallback } from "react";
import {Link} from "react-router-dom";

export default function FriendList({userId, setRoomId, login, socket, pfp, setPfp}) {
    const [friends, setFriends] = useState([]);
    const [file, setFile] = useState(null);

    const getFriends = useCallback(async () => {
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
                return(data);
            }else{
                console.log(data.message);
                return null;
            }
        }catch(err){
            console.log(err);
            return null;
        }
    }, [userId, login]);
    const uploadImage = async () => {
        if (!file) return alert("Select a file");

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('userId', userId);
        try {
            const response = await fetch('http://localhost:3000/users/upload-pfp', {
                method:'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok){
                console.log("Uploaded file");
                setPfp(data.path);
            }else{
                console.log(data.error);
            }
        }
        catch(err){
            console.error(err);
        }
    }
    useEffect(() => {
        getFriends().then(data => {
            if (data) setFriends(data);
        });
    }, [getFriends]);

    useEffect(() => {
        socket.on('reloadFriends', () => {
            console.log("Reload friends");
            getFriends().then(data => {
                if (data) setFriends(data);
            });
        });
        return () => socket.off('reloadFriends');
    }, [getFriends, socket]);
    return(
        <>
            <div className="flex flex-col h-screen w-[15vw] bg-gray-900">
                <span className={"p-2 text-2xl text-blue-950 bg-gray-500 border-b border-gray-400 flex flex-col"}><Link to={"/"} className={"font-bold"} onClick={() => {setRoomId(0)}}><img src={`http://localhost:3000${pfp}`} alt={login} className={"w-10 h-10"}/>{login}</Link>
                    <input
                        type={"file"}
                        id={"pfp"}
                        name={"pfp"}
                        className={"w-20 text-sm bg-gray-700 "}
                        onChange={(e) => {setFile(e.target.files[0])}}
                    />
                    <button
                        className={"m-2 bg-gray-900 rounded-xl text-gray-50"}
                        onClick={uploadImage}
                    >
                        Upload
                    </button>
                </span>
                {friends.map((friend, index) => (
                    <div className={"border-b border-gray-400"}>
                        <div key={index} className="cursor-pointer p-3 bg-gray-800 mt-1 mb-1 hover:bg-gray-700 duration-200 rounded-2xl" onClick={() => {setRoomId(friend.room_id)}}>{friend.login}</div>
                    </div>

                ))}
            </div>
        </>
    );
}