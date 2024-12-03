use std::fmt::format;

use super::{AppPlatform, Client};
use crate::{
  options::client::InputClientOptions,
  service::{ClientRequestConfig, Request, RestFuiApi},
  utils::error::Result,
};
use napi::Env;
use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[napi]
pub struct CreateAppModal {
  pub app_key: String,
  pub id: i32,
}

#[napi]
pub struct AndroidClient {
  platform: AppPlatform,
  input_options: InputClientOptions,
}

#[napi]
impl AndroidClient {
  #[napi(constructor)]
  pub fn new(_env: Env, input_options: InputClientOptions) -> Self {
    Self { platform: AppPlatform::from_str("android"), input_options }
  }

  #[napi]
  pub async fn upload(&self) -> napi::Result<Vec<CreateAppModal>> {
    let mut request = Request::new(self.input_options.base_url.to_string());
    request.authentication(self.input_options.user_token.to_string());

    let result = request
      .get::<RestFuiApi<Vec<CreateAppModal>>>(ClientRequestConfig::new(
        "/apps/androids".to_string(),
      ))
      .await?;
    println!("{:?}", result);
    Ok(result.data)
  }
}

impl Client for AndroidClient {
  fn platform(&self) -> &AppPlatform {
    &self.platform
  }

  async fn upload_dist(&self) -> Result<()> {
    Ok(())
  }
}
