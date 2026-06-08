export default function GifDisplay({gifs, socket, roomId, login, show}){
    const sendGif = (selectedGif) => {
        const messageData = {
            roomId: roomId,
            message: selectedGif,
            senderLogin: login,
            isPhoto: true
        }
        socket.emit('sendMessage', messageData);
    }
    return(
        <div className={`p-2 w-120 h-100 bg-gray-900 border-2 border-gray-950 gap-2 overflow-y-auto fixed right-45 bottom-20 rounded-2xl  ${show ? "flex" : "hidden"}`}>
            <div className="flex flex-col gap-2 w-1/2">
                {gifs.filter((_, i) => i % 2 === 0).map((gif, index) => (
                    <img key={index} src={gif} alt={gif} className="w-full rounded hover:border-2 hover:border-gray-400"
                         onClick={() => sendGif(gif)} />
                ))}
            </div>
            <div className="flex flex-col gap-2 w-1/2">
                {gifs.filter((_, i) => i % 2 === 1).map((gif, index) => (
                    <img key={index} src={gif} alt={gif} className="w-full rounded hover:border-2 hover:border-gray-400"
                         onClick={() => sendGif(gif)} />
                ))}
            </div>
        </div>
    );
}