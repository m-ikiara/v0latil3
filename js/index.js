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

		const tick_stream = api.ticks('R_100');
		const subscribe_ticks = async () => {
			await tick_stream.subscribe(console.log);
		};
		const unsubscribe_ticks = async () => {
			await tick_stream().unsubscribe();
		};
		const get_ticks_history = async () => {
			const ticks_history = await tick_stream.history({
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
