use derivative::Derivative;
use napi_derive::napi;
use serde::Deserialize;
pub mod client;
mod login;

#[napi]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum PlatformEnum {
  Android,
  Ios,
  All,
}

#[napi(object, object_to_js = false)]
#[derive(Deserialize, Debug, Derivative)]
#[serde(rename_all = "camelCase")]
pub struct BindingInputOptions {
  pub platform: PlatformEnum,
  pub update_file: String,
}

impl Default for BindingInputOptions {
  fn default() -> Self {
    Self { platform: PlatformEnum::All, update_file: "./update.json".to_string() }
  }
}
