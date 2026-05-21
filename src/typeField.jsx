export default function TypeField({ textValue, onTextChange, keyDown, userId, roomId, socket, login}){
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

            <textarea onKeyDown={keyDown} className={"w-[80%]  text-gray-300 min-h-20 bg-gray-600 rounded-2xl border-2 border-cyan-950 focus:outline-none pl-2 pt-2 resize-none"}
                      id={"textField"}
                      value={textValue}
                      onChange={(e) => onTextChange(e.target.value)}/>
            <input type={"file"} className={"w-10 bg-gray-500 h-10"} onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile){
                    sendPhoto(selectedFile);
                }
            }}/>
        </div>

    )
}