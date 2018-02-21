import { spawn } from 'child_process';
import ws from 'ws';
import db from 'db';
import buildUrl from 'build-url';

class streamer {
	constructor () {
		this.ws = null;
		this.stream = null;
		this.active = false;
	}

	ffmpegTemplate (options) {
		let params,
			target_url = buildUrl(options.youtube.url, { path: options.youtube.key }),
			forwardOption = '-f mpeg1video -b:v 800k -r 30 -';

		if(options.youtube.active) {
			params = `-f lavfi -i anullsrc -rtsp_transport udp -i ${options.video_source} -tune zerolatency -vcodec libx264 -pix_fmt + -c:v copy -c:a aac -strict experimental -f flv ${target_url} ${forwardOption}`;
		}
		else {
			params = `-rtsp_transport tcp -i ${options.video_source} ${forwardOption}`;
		}

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
			this.streamerStart(socket, this.active);
			socket.on('message', msg => this.wsEvent(socket, 'data', msg));
		});
	}

	wsEvent (socket, type, data) {
		data = data.split('.'); 

		if(data[0] == 'server-status') {
			if(data[1] == 'start') {
				this.active = true;
				this.streamerStart(socket, true);
			}
			else if(data[1] == 'stop') {
				this.active = false;
				this.streamerStart(socket, false);
			}
		}
	}

	wsSendBroadcast (data) {
		if(this.ws) {
			this.ws.clients.forEach(client => {
				if(!client._closeFrameSent) {
					client.send(data);
				}
			});
		}
	}

	wsStop () {
		if(this.ws) {

		}
	}

	streamerStart (socket, isYoutubeActive) {
		let options;

		if(isYoutubeActive) {
			options = this.ffmpegTemplate({
				video_source: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov',
				youtube: {
					url: 'rtmp://a.rtmp.youtube.com/live2',
					key: 'femr-hz8z-55ad-b78f',
					active: true
				}
			});
		}
		else {
			options = this.ffmpegTemplate({
				video_source: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov',
				youtube: {
					active: false
				}
			});
		}

		this.getVideoInfo('rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov')
		.then(video_info => {
			this.streamerStop();
			this.streamerSendHeader(socket, video_info);

			this.stream = spawn('ffmpeg', options, {
				detached: false
			});
			this.stream.stdout.on('data', data => {
				this.wsSendBroadcast(data);
			});			
			// this.stream.stderr.on('data', data => {
			// 	return self.emit('ffmpegError', data);
			// });
		})
		.catch(out => {
			console.log('getVideoInfo', out)
		});
	}

	streamerSendHeader (socket, video_info) {
		let streamHeader = new Buffer(8);
			streamHeader.write('jsmp');
			streamHeader.writeUInt16BE(video_info.video.width, 4);
			streamHeader.writeUInt16BE(video_info.video.height, 6);

		socket.send(streamHeader, {
			binary: true
		});
	}

	streamerStop () {
		if(this.stream) {
			this.stream.kill();
		}
	}
};


let server = new streamer();
server.wsStart(9999);

module.exports = server;