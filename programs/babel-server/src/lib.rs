use anchor_lang::prelude::*;

declare_id!("CBoo3NzDQgy9h2F7sJ4QSJKBJfWyDACFjJgRQLh7fhgg");

#[program]
pub mod babel_server {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
