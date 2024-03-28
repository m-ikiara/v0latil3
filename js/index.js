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
			await tick_stream.onUpdate().subscribe(console.log);
		}

		const unsubscribe_ticks = async () => {
			await tick_stream().unsubscribe();
		}

		const subscribe_ticks_button = document.querySelector('#ticks');
		subscribe_ticks_button.addEventListener('click', subscribe_ticks);

		const unsubscribe_ticks_button = document.querySelector('#ticks');
		unsubscribe_ticks_button.addEventListener('click', unsubscribe_ticks);
	})
	.catch((err) => console.log(err));
