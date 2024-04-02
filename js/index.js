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
		const ticks_request_block = {
			ticks_history: 'R_100',
			adjust_start_time: 1,
			count: 10,
			end: 'latest',
			start: 1,
			style: 'ticks',
		};
		const ticks_request = {
			...ticks_request_block,
			subscribe: 1,
		};
		const tick_stream = () => api.subscribe(ticks_request);
		const ticks_stream_response = async (response) => {
			const ticks_data = JSON.parse(response.data);
			if (ticks_data.error) {
				console.error('[ERROR] Failed to parse the message type');
				console.log(ticks_data.error.message);
				web_socket.removeEventListener(
					'message',
					ticks_stream_response,
					false,
				);
				await api.disconnect();
			}
			if (ticks_data.msg_type === 'tick') console.log(ticks_data.tick);
		};
		const ticks_history_response = async (response) => {
			console.log(response.json());
			const ticks_data = JSON.parse(response.data);
			if (ticks_data.error) {
				console.error('[ERROR] Failed to parse the message type');
				console.log(ticks_data.error.message);
				web_socket.removeEventListener(
					'message',
					ticks_history_response,
					false,
				);
				await api.disconnect();
			}
			if (ticks_data.msg_type === 'history')
				console.log(ticks_data.history);
		};
		const subscribe_ticks = async () => {
			console.log('[INFO] Starting the Tick Stream');
			web_socket.addEventListener('message', ticks_stream_response);
			await tick_stream();
			console.log('[INFO] Tick Stream initialized. Outputting...');
		};
		const unsubscribe_ticks = async () => {
			console.log('[INFO] Stopping the Tick Stream');
			web_socket.removeEventListener(
				'message',
				ticks_history_response,
				false,
			);
			await tick_stream().unsubscribe();
			console.log('[INFO] Tick Stream stopped');
		};
		const get_ticks_history = async () => {
			console.log('[INFO] Fetching the Ticks History...');
			web_socket.addEventListener('message', ticks_history_response);
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
