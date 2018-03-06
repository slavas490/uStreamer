const secondsToTime = second => {
    var sec_num = parseInt(second, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return { hours, minutes, seconds };
};

let streaming = {
    ui: ui_builder(),
    ws: null,
    player: null,
    start: (sec_left = 0) => {
        let ui = streaming.ui;

        // header status
        ui['g_stream-status'].stop.classList.add('display-none');
        ui['g_stream-status'].active.classList.remove('display-none');

        // btn_streaming
        ui.g_btn_streaming.start.classList.add('display-none');
        ui.g_btn_streaming.stop.classList.remove('display-none');

        // timer
        ui.g_timer.main.classList.remove('display-none');

        const calcTime = (sec) => {
            let time = secondsToTime(sec_left),
                html = time.hours + '<span>:</span>' + time.minutes + '<span>:</span>' + time.seconds;

            ui.g_timer.main.innerHTML = html;
            ui.g_timer.header.innerHTML = html;
            
            sec_left++;
        };

        streaming._timer = setInterval(() => calcTime(), 1000);
        calcTime();
    },
    stop: () => {
        let ui = streaming.ui;

        // header status
        ui['g_stream-status'].stop.classList.remove('display-none');
        ui['g_stream-status'].active.classList.add('display-none');

        // btn_streaming
        ui.g_btn_streaming.start.classList.remove('display-none');
        ui.g_btn_streaming.stop.classList.add('display-none');

        // timer
        ui.g_timer.main.classList.add('display-none');
        ui.g_timer.main.innerHTML = '00:00:00';
        ui.g_timer.header.innerHTML = '00:00:00';

        clearInterval(streaming._timer);
    },
    selectVideoDevice: self => {
        let list = streaming.ui['video-devices'].children,
            id = self.dataset.id;

        for(let i=0; i<list.length; i++) {
            if(list[i].dataset.id == id) {
                list[i].classList.add('active');
            }
            else {
                list[i].classList.remove('active');
            }
        }

        fetch('selectDevice?type=video&id=' + id, { method: 'PUT' });
    }
};


(() => {
    // UI
    let ui = streaming.ui;

    // WebSocket
    let ws = new WebSocket('ws://localhost:9999');

    streaming.ws = ws;

    // Streaming player
    streaming.player = new jsmpeg(ws, { canvas: ui.canvas });
    console.log('WS', streaming.ws);
    console.log('PLAYER', streaming.player);

    /*  ui bindings */
    // start
    ui.g_btn_streaming.start.onclick = e => {
        streaming.start(0);
        ws.send('server-status.start');
    };

    // stop
    ui.g_btn_streaming.stop.onclick = e => {
        streaming.stop();
        ws.send('server-status.stop');
    };

    console.dir(ui)
})();