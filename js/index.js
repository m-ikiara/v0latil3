const connection = new Promise((resolve, reject) => {
	const web_socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=53083');
	web_socket.onopen = () => resolve(web_socket);
	web_socket.onerror = reject;
});

connection
	.then(async (web_socket) => {
		const api = await new DerivAPIBasic({ app_id: 53272, web_socket  });
		const tick_stream = () => api.subscribe({ ticks: 'R_100' });

		const tick_response = async (response) => {
			const data = JSON.parse(response.data);
			if (data.error !== undefined) {
				console.error(`[ERROR] ${data.error.message}`);
				connection.removeListener('message', tickResponse, false);
				await api.disconnect();
			}
			if (data.msg_type === 'tick') console.log(data.tick);
		};

		const subscribe_ticks = async () => {
			await tick_stream();
			connection.addListener('message', tick_response);
		}

		const unsubscribe_ticks = async () => {
			await connection.removeListener('message', tick_response, false);
			tick_stream().unsubscribe();
		}

		const subscribe_ticks_button = document.querySelector('#ticks');
		subscribe_ticks_button.addListener('click', subscribe_ticks);

		const unsubscribe_ticks_button = document.querySelector('#ticks');
		unsubscribe_ticks_button.addListener('click', unsubscribe_ticks);
	})
	.catch((err) => console.log(err));
