import { useState, useEffect } from "react";

export default function FriendList({userId}) {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await fetch('http://localhost:3000/friends/get-friends', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId})
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
    }, []);
}