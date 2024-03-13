use std::env;
use std::process::ExitCode;
use std::result::Result;

mod utils;
use utils::print_usage;
mod server;

#[allow(unused_must_use)]
fn
entry() -> Result<(), ()>
{
    let mut args = env::args();
    let program = args.next().expect("path to program is provided");

    let subcommand = args.next().ok_or_else(|| {
        print_usage(&program);
        eprintln!("[ERROR] No arguments given");
    })?;

    match subcommand.as_str() {
        "hello" => {
            print_usage(&program)
        }

        "serve" => {
            server::start_server("127.0.0.1:6969")
        }

        _ => {
            print_usage(&program);
            eprintln!("[ERROR] The argument is unknown. T-T");
            Err(())
        }
    }
}

fn
main()
{
    match entry() {
        Ok(()) => ExitCode::SUCCESS,
        Err(()) => ExitCode::FAILURE,
    };
}
