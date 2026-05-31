import GifDisplay from "./gifDisplay.jsx";
import {useState} from "react";


export default function TypeField({ textValue, onTextChange, keyDown, userId, roomId, socket, login, gifs}){
    const [showGifs, setShowGifs] = useState(false);
    const sendPhoto = async (file) => {
        if (!file) return alert("Select a file");

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('userId', userId);
        formData.append('roomId', roomId);
        try {
            const response = await fetch('http://localhost:3000/messages/send-photo', {
                method:'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok){
                socket.emit('sendMessage', {
                    roomId: roomId,
                    message: data.path,
                    senderLogin: login,
                    isPhoto: true
                });
            }else{
                console.log(data.error);
            }
        }
        catch(err){
            console.error(err);
        }
    }

    return(
        <div className={"w-full flex m-0"}>
            <input type={"file"} className={"w-10 bg-gray-500 h-10"} onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile){
                    sendPhoto(selectedFile);
                }
            }}/>
            <textarea onKeyDown={keyDown} className={"w-[70%] text-gray-300 min-h-20 bg-gray-600 rounded-2xl border-2 p-2 border-cyan-950 focus:outline-none resize-none"}
                      id={"textField"}
                      value={textValue}
                      onChange={(e) => onTextChange(e.target.value)}
            />
            <button className={"w-12 h-12 border-gray-700 rounded-xl hover:bg-gray-500 duration-500 border-2 bg-gray-600"} onClick={() => {setShowGifs(!showGifs)}}>Gifs</button>
            <GifDisplay gifs={gifs} socket={socket} roomId={roomId} login={login} show={showGifs}/>


        </div>

    )
}