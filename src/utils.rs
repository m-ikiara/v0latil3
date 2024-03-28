use std::str;

pub fn
print_usage(context: &str) -> Result<(), ()>
{
    eprintln!("
Welcome to v0latil3's Commandline Utility! ^-^
Wondering how to use this amazing resource? Check out the below arguments to
get started.

Usage: {context} [ARGS]
Args:
    hello   Displays this message
    serve   Spawns the HTTP server

Hope you found this info useful. Check out the GitHub repo for more details.
Link:   https://github.com/m-ikiara/v0latil3
            ");
    Err(())
}
