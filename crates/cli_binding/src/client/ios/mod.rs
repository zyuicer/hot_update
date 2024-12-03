use super::{AppPlatform, Client};
use crate::utils::error::Result;

pub struct IosClient {
  platform: AppPlatform,
  is_dist: bool,
  pub name: String,
}

impl IosClient {
  pub fn new(name: String, is_dist: bool) -> Self {
    Self { platform: AppPlatform::from_str("ios"), name, is_dist }
  }
}

impl Client for IosClient {
  fn platform(&self) -> &AppPlatform {
    &self.platform
  }

  async fn upload_dist(&self) -> Result<()> {
    Ok(())
  }
}
