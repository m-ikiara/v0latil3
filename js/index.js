const connection = new Promise((resolve, reject) => {
	const web_socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=53272');
	web_socket.onopen = () => resolve(web_socket);
	web_socket.onerror = reject;
});

connection
	.then(async (web_socket) => {
		const api = await new DerivAPIBasic({ 
			endpoint: 'ws.derivws.com',
			app_id: 53272,
			connection: web_socket,
			lang: 'EN',
		});

		const subscribe_ticks = async () => {
			const tick_stream = api.ticks({ subscribe: 1, ticks: 'R_100'});
			console.log(tick_stream);
		};
		const unsubscribe_ticks = async () => {
			const tick_stream = api.ticks({ subscribe: 0, ticks: 'R_100' });
		};
		const get_ticks_history = async () => {
			const ticks_history = await tick_stream.ticksHistory({
				count: 100,
				end: Date.now(),
			});
			console.log(ticks_history);
		};

		document.getElementById('subscribe-ticks').onclick = () => {
			subscribe_ticks();
		};
		document.getElementById('unsubscribe-ticks').onclick = () => {
			unsubscribe_ticks();
		};
		document.getElementById('get-ticks-history').onclick = () => {
			get_ticks_history();
		};
	})
	.catch((err) => console.log(err));
