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
        const tick_stream = () => api.subscribe({ ticks: 'R_100' });
        const ticks_stream_response = async (response) => {
            const ticks_data = JSON.parse(response.data);
            if (ticks_data.error !== undefined) {
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
            const ticks_data = JSON.parse(response.data);
            if (ticks_data.error !== undefined) {
                console.log(ticks_data.error.message);
                web_socket.removeEventListener(
                    'message',
                    ticks_history_response,
                    false,
                );
                await api.disconnect();
            }
            if (ticks_data.msg_type === 'history') console.log(ticks_data.history);
        };
        const subscribe_ticks = async () => {
            web_socket.addEventListener('message', ticks_stream_response);
            await tick_stream();
        };
        const unsubscribe_ticks = async () => {
            web_socket.removeEventListener(
                'message',
                ticks_stream_response,
                false,
            );
            await tick_stream().unsubscribe();
        };
        const get_ticks_history = async () => {
            web_socket.addEventListener('message', ticks_history_response);
            await api.ticksHistory(ticks_request_block);
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
