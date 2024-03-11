use std::io;
use std::result::Result;
use std::str;

use tiny_http::{Header, Method, Request, Response, Server, StatusCode};

pub fn
serve_page(request: Request, bytes: &[u8],
           content_type: &str) -> io::Result<()> 
{
    let header = Header::from_bytes(
        "Content-Type", content_type) .expect("no garbage in header");
    request.respond(Response::from_data(bytes).with_header(header))
}

pub fn
handle_404(request: Request, bytes: &[u8]) -> io::Result<()>
{
    request.respond(
            Response::from_data(bytes).with_status_code(StatusCode(404))
    )
}

pub fn
handle_request(request: Request) -> io::Result<()>
{
    println!(
        "[SERVER] Received a request! method: {:?}, url: {:?}, headers: {:?}",
             request.method(),
             request.url(),
             request.headers()
    );

    match (request.method(), request.url()) {
        (Method::Get, "/index.js") => {
            serve_page(request,
                       include_bytes!("./js/index.js"),
                       "text/javascript; charset=utf-8"
            )
        }

        (Method::Get, "/") | (Method::Get, "/index.html") => {
            serve_page(request,
                       include_bytes!("./index.html"),
                       "text/html; charset=utf-8"
            )
        }

        _ => {
            handle_404(request, include_bytes!("404.html"))
        }
    }
}

pub fn
start_server(address: &str) -> Result<(), ()>
{
    let server = Server::http(&address).map_err(|err| {
        eprintln!(
            "[ERR_SERVER] Failed to start HTTP Server at {address}: {err}"
        );
    })?;

    println!("[SERVER] v0latil3 now running at http://{address}/");

    for request in server.incoming_requests() {
        handle_request(request).map_err(|err| {
            eprintln!("[ERR_SERVER] Couldn't respond: {err}")
        }).ok().expect("all requests have been handled")
    }

    eprintln!("[ERR_SERVER] Socket has shutdown! T-T");
    Err(())
}
