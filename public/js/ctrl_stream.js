(() => {
  // UI
  let ui = ui_builder();

  // WebSocker connection
  let ws = new WebSocket('ws://localhost:9999');
 
  // Streaming player
  let player = new jsmpeg(ws, { canvas: ui.canvas });
 
  console.dir(ui)
})();