import {useState} from "react";




export default function Messages({messages, userId, setGifs, gifs}){
    const [gifPath, setGifPath] = useState("");
    const [error, setError] = useState("");
    const addGif = async () => {
        try{
            const response = await fetch ("http://localhost:3000/gifs/add-gif", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({gifPath, userId})
            });
            if (response.ok){
                const data = await response.json();
                setError(data.message);
                setGifs(...gifs, gifPath);
            }

        }catch (err){
            console.log(err);
        }
    }
    return (
        <>
        {messages.map((msg, index) => (
            <div key={index} className={"text-gray-300 w-fit rounded-3xl p-1 max-w-[95%] wrap-break-word"}>{index !== 0 && msg.sender === messages[index-1].sender ? <></>:
                <><b className={"text-lg text-blue-600"}>{msg.sender}</b><br /></>}
                {msg.isPhoto ? msg.text.endsWith(".gif") ?
                <><img src={`http://localhost:3000${msg.text}`} className={"max-w-150 max-h-100"} alt={"Gif"}/> <button className={"bg-gray-900 hover:bg-gray-600 w-15 h-8 rounded-xl"} onClick={() => {
                    setGifPath(msg.text);
                    console.log(gifPath);
                    console.log("Trynna save gif")
                    if (gifPath !== ""){
                        addGif();
                    }
                    else{
                        console.log(setError("Click again to confirm"))
                    }
                }}>fav</button>{error}</>
                :<img src={`http://localhost:3000${msg.text}`} className={"max-w-150 max-h-100"} alt={"Image"}/> : msg.text}</div>
        ))}
        </>
    )
}

