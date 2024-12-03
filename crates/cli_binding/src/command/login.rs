use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[napi(object, object_to_js = false)]
pub struct LoginParams {
  pub password: String,
  pub username: String,
}

#[napi(js_name = "loginCommand")]
pub async fn login_command(params: LoginParams) {
}