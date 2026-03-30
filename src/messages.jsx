
export default function Messages({messages}){
    return (
        <>
        {messages.map((msg, index) => (
            <div key={index} className={" text-gray-300 w-fit rounded-3xl p-1 max-w-[80%] wrap-break-word"}>{index !== 0 && msg.sender === messages[index-1].sender ? <></>: <><b className={"text-lg text-blue-600"}>{msg.sender}</b><br /></>}{msg.text}</div>
        ))}
        </>
    )
}

