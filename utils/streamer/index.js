import { spawn } from 'child_process';
import ws from 'ws';
import db from 'db';
import buildUrl from 'build-url';
import * as settings from 'settings';
import { dbManager }  from 'db';

class streamer {
	constructor () {
		this.ws = null;
		this.stream = null;
		this.active = false;
		this.options = {
			device: {
				video: {},
				audio: {}
			},
			youtube: { }
		};
		this.startTime = 0;

		// set default parameters
		this.init();
	}

	setActiveVideoDevice(path) {
		this.options.device.video.source = path;
	}

	setActiveAudioDevice(path) {
		this.options.device.audio.source = path;
	}

	setGeneralSettings(youtube) {
		this.options.youtube.url = youtube['youtube_url'];
		this.options.youtube.key = youtube['youtube_key'];
	}

	ffmpegTemplate () {
		let params,
			options = this.options,
			target_url = buildUrl(options.youtube.url, { path: options.youtube.key }),
			forwardOption = '-f mpeg1video -b:v 800k -r 30 -';

		if(this.active) { //-i "Микрофон (Устройство с поддержкой High Definition Audio)"
			params = `-f lavfi -i anullsrc -rtsp_transport udp -i ${options.device.video.source} -f dshow -i audio="Микрофон (Устройство с поддержкой High Definition Audio)" -vcodec libx264 -pix_fmt + -c:v copy -c:a aac -strict experimental -f flv ${target_url} ${forwardOption}`;
		}
		else {
			params = `-rtsp_transport udp -i ${options.device.video.source} ${forwardOption}`;
		}
console.log(params)
		return params.split(' ');
	}

	getVideoInfo (source) {
		let info = '';

		return new Promise((resolve, reject) => {
			let ffprobe = spawn('ffprobe', `-v quiet -print_format json -show_streams -i ${source}`.split(' '), {
				detached: false
			});

			ffprobe.stdout.on('data', data => {
				info += data.toString();
			});

			ffprobe.on('exit', out => {
				try {
					let data = JSON.parse(info),
						params = {};

					if(data && data.streams) {
						data = data.streams;

						for(let i=0; i<data.length; i++) {
							if(data[i].codec_type == 'video') {
								params.video = {
									width: data[i].width,
									height: data[i].height
								}
							}
						}

						resolve(params);
					}
				}
				catch (e) {
					reject(e);
				}
			});
		});
	}

	wsStart (port) {
		this.ws = new ws.Server({ port });

		this.ws.on('connection', (socket) => {
			this.streamerSendHeader(socket);
			socket.on('message', msg => this.wsEvent(socket, 'data', msg));
		});
	}

	wsEvent (socket, type, data) {
		data = data.split('.');

		if(data[0] == 'server-status') {
			if(data[1] == 'start') {
				this.startTime = new Date();
				this.active = true;
				this.streamerStart();
			}
			else if(data[1] == 'stop') {
				this.startTime = 0;
				this.active = false;
				this.streamerStart();
			}
		}
	}

	wsSendBroadcast (data) {
		if(this.ws) {
			this.ws.clients.forEach(client => {
				if(!client._closeFrameSent && client.readyState != 2) {
				// if(client.readyState === ws.OPEN) {
					client.send(data);
				}
			});
		}
	}

	wsStop () {
		if(this.ws) {
			console.log('STOP CALLED');
		}
	}

	streamerStart (socket) {
		let videoDevice = this.options.device.video;

		if(!videoDevice) return;

		if(!this.stream) {
			this.stream = spawn('ffmpeg', this.ffmpegTemplate(), {
				detached: false
			});

			this.stream.stdout.on('data', data => {
				this.wsSendBroadcast(data);
			});
			// this.stream.stderr.on('data', data => {
			// 	return self.emit('ffmpegError', data);
			// });
		}
	}

	streamerSendHeader (socket) {
		let video_info = this.options.device.video;

		let streamHeader = new Buffer(8);
			streamHeader.write('jsmp');
			streamHeader.writeUInt16BE(video_info.width, 4);
			streamHeader.writeUInt16BE(video_info.height, 6);

		socket.send(streamHeader, {
			binary: true
		});

		console.log("ON SEND")
	}

	streamerStop () {
		if(this.stream) {
			this.stream.kill();
			this.stream = null;
		}
	}

	streamerRestart () {
		this.streamerStop();
		this.streamerStart();

console.log(this.ws.clients.size)

		this.ws.clients.forEach(client => {
			this.streamerSendHeader(client);
		});
		//streamServer.wsStart(settings.general.streamer.server.port);
	}

	init () {
		return dbManager.getActiveVideoDevice()
		.then(out => {
			if(out.result) {
				this.setActiveVideoDevice(out.result.source);
				
				return this.getVideoInfo(out.result.source);
			}
			else {
				throw 'Cannot set default video device';
			}
		})
		.then(out => {
			if(out && out.video) {
				this.options.device.video.width = out.video.width;
				this.options.device.video.height = out.video.height;

				return dbManager.getActiveAudioDevice();
			}
			else {
				throw 'Cannot get information about the video';
			}
		})
		.then(out => {
			if(out.result) {
				this.setActiveAudioDevice(out.result.path);
				return dbManager.getGeneralSettings();
			}
			else {
				throw 'Cannot set default audio device';
			}
		})
		.then(out => {
			if(out.result) {
				this.setGeneralSettings(out.result);
			}
			else {
				throw 'Cannot set general settings';
			}
		})
		.catch(err => {
			return { status: 1, error: 'streamer: ' + err };
		});
	}
};


let streamServer = new streamer();
streamServer.wsStart(settings.general.streamer.server.port);
streamServer.init();

module.exports = streamServer;