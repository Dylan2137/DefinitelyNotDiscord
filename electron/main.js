import { app, BrowserWindow } from "electron";

let win;
function createWindow() {
    win = new BrowserWindow();

    win.loadURL("http://localhost:5173");
    win.on('closed', () =>{
        win = null;
    })
}

app.on('ready', createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
})