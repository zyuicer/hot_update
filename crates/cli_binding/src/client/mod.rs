pub mod android;
pub mod ios;

use crate::utils::error::Result;
use serde::{Deserialize, Serialize};
use std::{env::current_dir, fs, future::Future};

#[derive(Deserialize, Serialize)]
pub struct PackageJson {
  pub version: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AppPlatform {
  Android,
  Ios,
  Unknown,
}

impl AppPlatform {
  pub fn is_app(&self) -> bool {
    match self {
      Self::Android | Self::Ios => true,
      Self::Unknown => false,
    }
  }

  pub fn from_str(s: &str) -> Self {
    match s {
      "android" | "Android" | "ANDROID" => Self::Android,
      "ios" | "Ios" | "IOS" => Self::Ios,
      _ => Self::Unknown,
    }
  }
}

#[derive(Serialize, Deserialize)]
pub struct UserInfo {
  token: String,
}

pub trait Client {
  fn find_version() -> Result<PackageJson> {
    read_cwd_package()
  }
  fn platform(&self) -> &AppPlatform;
  fn upload_dist(&self) -> impl Future<Output = Result<()>>;

  fn read_user_info() -> Result<UserInfo> {
    let user_info_path = current_dir()?.join("user_info.json");

    let json_content = fs::read_to_string(user_info_path)?;

    let user_info = serde_json::from_str::<UserInfo>(&json_content)?;

    Ok(user_info)
  }
}

fn read_cwd_package() -> Result<PackageJson> {
  let package_path = current_dir()?.join("package.json");

  let json_content = fs::read_to_string(package_path)?;

  let package_info: PackageJson = serde_json::from_str(&json_content)?;

  Ok(package_info)
}
