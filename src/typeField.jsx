export default function TypeField({ textValue, onTextChange, keyDown}){

    return(
        <textarea onKeyDown={keyDown} className={"w-[80%]  text-gray-300 min-h-20 bg-gray-600 rounded-2xl border-2 border-cyan-950 focus:outline-none pl-2 pt-2 resize-none"}
                  id={"textField"}
                  value={textValue}
                  onChange={(e) => onTextChange(e.target.value)}/>
    )
}