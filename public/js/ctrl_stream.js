let streaming = {
	ui: ui_builder()
};


(() => {
  // UI
  let ui = ui_builder();

  // WebSocker connection
  let ws = new WebSocket('ws://localhost:9999');
  ws.onmessage = data => {
  console.dir(data)
  }
  window.ws = ws;

  // Streaming player
  let player = new jsmpeg(ws, { canvas: ui.canvas });
 
  console.dir(ui)
})();