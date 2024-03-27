const app_id = 53272;
const connection_string = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);
const api = new DerivApiBasic({ connection_string });
const tick_stream = () => api.subscribe({ ticks: 'R_100' });

const tick_response = async (response) => {
	const data = JSON.parse(response.data);
	if (data.error !== undefined) {
		console.error(`[ERROR] ${data.error.message}`);
		connection_string.removeEventListener('message', tickResponse, false);
		await api.disconnect();
	}
	if (data.msg_type === 'tick') console.log(data.tick);
};

const subscribe_ticks = async () => {
	await tick_stream();
	connection_string.addEventListener('message', tick_response);
}

const unsubscribe_ticks = async () => {
	connection_string.removeEventListener('message', tick_response, false);
	await tick_stream().unsubscribe();
}

const subscribe_ticks_button = document.querySelector('#ticks');
subscribe_ticks_button.addEventListener('click', subscribe_ticks);

const unsubscribe_ticks_button = document.querySelector('#ticks');
unsubscribe_ticks_button.addEventListener('click', unsubscribe_ticks);
