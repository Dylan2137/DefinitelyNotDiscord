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
        <div className={`p-2 w-120 h-100 bg-gray-900 border-2 border-gray-950 flex-wrap gap-2 overflow-y-auto fixed right-45 bottom-20 rounded-2xl flex-row ${show ? "flex" : "hidden"}`}>
            {gifs.map((gif, index) => (
                <img key={index}
                src={gif}
                alt={gif}
                className={"w-[48%]"}
                onClick={() => {sendGif(gif)}}
                />
            ))}
        </div>
    );
}