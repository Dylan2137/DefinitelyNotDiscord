export default function Messages({messages, userId, setGifs, gifs}){
    const addGif = async (gifPath) => {
        try{
            const response = await fetch ("http://localhost:3000/gifs/add-gif", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({gifPath, userId})
            });
            const data = await response.json();
            if (response.ok){
                setGifs([...gifs, gifPath]);
            }
            else{
                console.log(data.message)
            }

        }catch (err){
            console.log(err);
        }
    }
    return (
        <>
        {messages.map((msg, index) => (
            <div key={index} className={"text-gray-300 w-fit rounded-3xl p-1 max-w-[95%] wrap-break-word"}>{index !== 0 && msg.sender === messages[index-1].sender ? <></>:
                <><b className={"text-lg text-blue-600 flex m-0 p-0"}><img src={msg.pfp} alt={"PFP"} className={"w-7 h-7 border border-gray-100 rounded-[100%] mr-2"}/>{msg.sender}</b><br /></>}
                {msg.isPhoto ? msg.text.endsWith(".gif") ?
                <><img src={`http://localhost:3000${msg.text}`} className={"max-w-150 max-h-100"} alt={"Gif"}/>
                <button className={"bg-gray-900 hover:bg-gray-600 w-15 h-8 rounded-xl"} onClick={() => {
                    addGif(msg.text);
                }}>fav</button></>
                :<img src={`http://localhost:3000${msg.text}`} className={"max-w-150 max-h-100"} alt={"Image"}/> : msg.text}</div>
        ))}
        </>
    )
}

