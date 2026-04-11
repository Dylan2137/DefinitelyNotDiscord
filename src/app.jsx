import {useEffect, useState, useRef} from "react";
import LoginForm from "./login";
import TypeField from "./typeField"
import RegisterForm from "./register";
import Messages from "./messages";
import FriendRequest from "./friendRequest.jsx";
import FriendList from "./friendList";
import { Link } from "react-router-dom";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");



export default function MyApp(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [login, setLogin] = useState("");
    const [userId, setUserId] = useState(0);
    const [roomId, setRoomId] = useState(0);

    const navigate = useNavigate();

    const contentRef = useRef(null);

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
                const messageData = {
                    roomId: roomId,
                    message: text.trim(),
                    senderLogin: login
                }

                socket.emit('sendMessage', messageData);
                setText("");
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.scrollTop = contentRef.current.scrollHeight;
                    }
                }, 0);
            }
        }

    }
    return (
        <Routes>
            <Route path="/" element={
                isLoggedIn ? (
                        <div className={"flex "}>
                            <div className={"w-[19.8%]  h-screen bg-gray-600"}>
                                <FriendList userId={userId} setRoomId={setRoomId}/>
                            </div>
                            <div className={"w-[80.2%] h-screen flex flex-col bg-gray-900"}>
                                <div id={"header"} className={"bg-gray-950 w-full h-[7vh]"}>
                                    <Link className={"font-bold text-xl self-center align-middle justify-center h-full w-[25%] flex pt-5 hover:bg-gray-800 duration-100"} to={"/friend-requests"}>Friend requests</Link>
                                </div>
                            </div>
                        </div>

                ) : (
                    <Navigate to="/login" />
                )
            } />

            <Route path="/chat" element={
                <div className={"h-screen flex flex-col"}>
                    <FriendRequest userId={userId}/>
                    <div id={"content"} ref={contentRef} className={"flex-1 flex flex-col overflow-y-auto p-4 pb-13 pt-20 justify-end-safe ml-35 mb-20"}>
                        <Messages messages={messages}/>
                    </div>
                    <div id={"input"} className={"fixed bottom-0 w-full flex justify-center"}>
                        <TypeField textValue={text} onTextChange={setText} keyDown={handleSendMessage}/>
                    </div>
                </div>
            }/>
            <Route path="/login" element={
                <LoginForm
                    onLoginSuccess={() => {
                        setIsLoggedIn(true);
                        navigate("/");
                    }}
                    login={login}
                    setLogin={setLogin}
                    setUserId={setUserId}
                />
            } />

            <Route path="/register" element={
                <RegisterForm />
            } />
            <Route path="/friend-requests" element={
                    <FriendRequest userId={userId}/>
            }/>
        </Routes>
    )
}