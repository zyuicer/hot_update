use napi_derive::napi;

#[napi(object, object_to_js = false)]
pub struct InputClientOptions {
  pub base_url: String,
  pub name: String,
  pub is_dist: bool,
  pub user_token: String,
}
