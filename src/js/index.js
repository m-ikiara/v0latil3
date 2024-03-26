const app_id = 53272;
const connection = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);

connection.onopen = () => {
	const api = new DerivAPIBasic({ connection });
	const tick_stream = () => api.subscribe({ ticks: 'R_100' });

	const tick_response = async (response) => {
		const data = JSON.parse(response.data);
		if (data.error !== undefined) {
			console.error(`[ERROR] ${data.error.message}`);
			connection.removeEventListener('message', tickResponse, false);
			api.disconnect();
		}
		await if (data.msg_type === 'tick') console.log(data.tick);
	};

	const subscribe_ticks = async () => {
		await tick_stream();
		connection.addEventListener('message', tick_response);
	}

	const unsubscribe_ticks = async () => {
		await connection.removeEventListener('message', tick_response, false);
		tick_stream().unsubscribe();
	}

	const subscribe_ticks_button = document.querySelector('#ticks');
	subscribe_ticks_button.addEventListener('click', subscribe_ticks);

	const unsubscribe_ticks_button = document.querySelector('#ticks');
	unsubscribe_ticks_button.addEventListener('click', unsubscribe_ticks);
});

connection.onerror = (err) => console.log(`[ERROR] Failed to create a Web Socket Connection: ${err}`);
