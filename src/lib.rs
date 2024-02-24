use std::net::SocketAddr;
use tokio::net::TCPListener;

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let address = SocketAddr::from(([0,0,0,0], 5000));

    let listener = TcpListener::bind(address).await?;
    println!("[SERVER_INFO] Listening on http://", addr);

    Ok(())
}