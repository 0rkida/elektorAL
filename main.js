const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadURL("http://localhost:3000");

  win.on("closed", () => {
    if (serverProcess) serverProcess.kill();
  });
}

app.whenReady().then(() => {
  serverProcess = spawn("node", ["server/index.js"], {
    stdio: "inherit",
    shell: true
  });

  setTimeout(createWindow, 5000);
});