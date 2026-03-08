import { useState } from "react";
import LoginForm from "./login";
import TypeField from "./typeField"
import RegisterForm from "./register";
import CreateRoom from "./createRoom";

export default function MyApp(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [login, setLogin] = useState("");
    const [userId, setUserId] = useState(0);
    const [roomId, setRoomId] = useState(0);
    const [roomLogin, setRoomLogin] = useState("");
    const handleSendMessage = (event) => {
        if (event.key === "Enter") {
            if (text.trim() === ""){
                event.preventDefault();
                return;
            }
            if (!event.shiftKey) {
                event.preventDefault();
                setMessages([...messages, text.trim() ]);
                setText("");
            }
        }

    }
    if (isLoggedIn){
        return(
            <>
                <div id={"header"} className={"bg-gray-900"}>
                    <h1 className={"text-5xl text-blue-300 flex justify-center"}>{userId} {login} : {roomLogin === "" ? "" : roomLogin}</h1>
                    <CreateRoom userId={userId} setRoomId={setRoomId} setUserLogin={setRoomLogin}/>

                </div>
                <div id={"content"} className={"flex flex-col ml-15 mt-5 absolute bottom-40  w-[75%]"}>

                    {messages.map((msg, index) => (
                        <div key={index} className={" text-gray-300 w-fit m-2 rounded-3xl p-2 max-w-[80%] wrap-break-word"}><b>{login}</b><br />{msg}</div>
                    ))}
                </div>
                <div id={"messages"} className={"absolute bottom-5 w-full flex justify-center"}>
                    <TypeField textValue={text} onTextChange={setText} keyDown={handleSendMessage}/>
                </div>

            </>)
    }
    else if (!isRegistered){
        return(<RegisterForm onRegisterSuccess={() => {setIsRegistered(true)}}/>)
    }
    else{
        return(<LoginForm onLoginSuccess={() => setIsLoggedIn(true)} login={login} setLogin={setLogin} onRegister={() => {setIsRegistered(false);}} setUserId={setUserId}/>)
    }
}