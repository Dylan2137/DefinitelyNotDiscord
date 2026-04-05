import {useEffect, useState} from "react";
import LoginForm from "./login";
import TypeField from "./typeField"
import RegisterForm from "./register";
import CreateRoom from "./createRoom";
import Messages from "./messages";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");



export default function MyApp(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [login, setLogin] = useState("");
    const [userId, setUserId] = useState(0);
    const [roomId, setRoomId] = useState(0);
    const [roomLogin, setRoomLogin] = useState("");

    useEffect(() => {
        if (roomId !== 0){
            socket.emit('joinRoom', roomId);
            async function getMessages() {
                try{
                    const response = await fetch("http://localhost:3000/messages/get-messages", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({roomId}),

                    });
                    const data = await response.json();
                    if (response.ok){
                        setMessages(data);
                        console.log("Got messages");
                    }
                    else{
                        console.log(response);
                    }
                }
                catch(err){
                    console.log(err);
                }

            }
            getMessages();

        }
    },[roomId]);

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        })

        return () => socket.off('receiveMessage');
    });


    const handleSendMessage = (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (text.trim() === "" || roomId === 0){
                event.preventDefault();
                return;
            }
            if (!event.shiftKey) {
                window.scrollTo(0, document.body.scrollHeight);
                const messageData = {
                    roomId: roomId,
                    message: text.trim(),
                    senderLogin: login
                }

                socket.emit('sendMessage', messageData);
                setText("");
            }
        }

    }
    if (isLoggedIn){
        return(
            <div className={"h-screen flex flex-col"}>

                <div id={"header"} className={"bg-gray-900 fixed top-0 w-full"}>
                    <h1 className={"text-5xl text-blue-300 flex justify-center"}>{userId} {login} : {roomLogin === "" ? "" : roomLogin}</h1>
                    <CreateRoom userId={userId} setRoomId={setRoomId} setUserLogin={setRoomLogin}/>

                </div>
                <div id={"content"} className={"flex-1 flex flex-col overflow-y-auto p-4 ml-35 justify-start mb-20"}>
                    <Messages messages={messages}/>
                </div>
                <div id={"input"} className={"fixed bottom-0 w-full flex justify-center"}>
                    <TypeField textValue={text} onTextChange={setText} keyDown={handleSendMessage}/>
                </div>

            </div>)
    }
    else if (!isRegistered){
        return(<RegisterForm onRegisterSuccess={() => {setIsRegistered(true)}}/>)
    }
    else{
        return(<LoginForm onLoginSuccess={() => setIsLoggedIn(true)} login={login} setLogin={setLogin} onRegister={() => {setIsRegistered(false);}} setUserId={setUserId}/>)
    }
}