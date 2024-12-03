use std::{fs, path::PathBuf};

use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UpdateJson {
  pub app_id: String,
  pub user_token: String,
}

pub fn read_update_json(path: &PathBuf) -> Result<UpdateJson> {
  let bytes = fs::read_to_string(&path)?;
  let update_file_json: UpdateJson = serde_json::from_str(&bytes)?;

  Ok(update_file_json)
}
