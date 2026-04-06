import React from "react"
import ReactDOM from "react-dom/client"
import "./output.css"
import { BrowserRouter } from "react-router-dom"; // Import this
import "./output.css"
import MyApp from "./app";


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <BrowserRouter>
        <MyApp />
    </BrowserRouter>
</React.StrictMode>
)