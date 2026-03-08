import { useState } from "react";
export default function LoginForm ({onLoginSuccess, login, setLogin, onRegister, setUserId}){
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const loginCheck = async (e) => {
        e.preventDefault();
        if (login !== "" && password !== ""){
            setLogin(login.trim());
            setPassword(password.trim());
            try{
                const response = await fetch("http://localhost:3000/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({login, password})
                });
                const data = await response.json();
                if (response.ok){
                    setError(data.message);
                    setUserId(data.userId);
                    onLoginSuccess();
                }
                else {
                    setError(data.message);
                }
            }
            catch(err){
                setError(err + " could not connect to the server");
            }
        }
    }
    return(
        <form className={"flex flex-col self-center justify-center bg-gray-600 h-100 w-100 rounded-2xl m-auto mt-[25vh]"} onSubmit={loginCheck}>
            <h1 className={"self-center text-2xl mb-10 font-bold"}>Log In</h1>
            <label htmlFor={"login"} className={"text-center"}>Login</label><input type={"text"} value={login} id={"login"} className={"bg-gray-900 border-2 border-gray-500 rounded-md w-50 h-7 focus:outline-none p-2 self-center"} onChange={(e) => setLogin(e.target.value)}/>
            <label htmlFor={"password"} className={"text-center"}>Password</label><input className={"bg-gray-900 border-2 border-gray-500 rounded-md w-50 h-7 focus:outline-none p-2 self-center"} type={"password"} value={password} id={"password"} onChange={(e) => setPassword(e.target.value)}/>
            <button type={"submit"} className={"bg-gray-900 rounded-xl h-10 w-20 hover:bg-gray-800 duration-250 hover:w-22 hover:h-11 self-center m-3"}>Log In</button>
            <p className={"self-center text-red-100"}>{error}</p>
            <p className={"self-center"}>Don't have an account? <b className={"text-white cursor-pointer"} onClick={onRegister}>Register</b></p>
        </form>
    )


}