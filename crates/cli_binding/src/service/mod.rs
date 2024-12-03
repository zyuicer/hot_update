use napi::bindgen_prelude::FromNapiValue;
use napi_derive::napi;
use std::time::Duration;

use reqwest::{header::HeaderMap, Client, Method};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::utils::error::Result;
pub struct Request {
  base_url: String,
  headers: HeaderMap,
  authentication: Option<String>,
  timeout: u64,
  instance: Client,
}

impl Request {
  pub fn new(base_url: String) -> Self {
    let client = Client::new();

    Self {
      base_url,
      instance: client,
      authentication: None,
      timeout: 5000,
      headers: HeaderMap::default(),
    }
  }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RestFuiApi<T> {
  pub data: T,
  pub code: u16,
  pub msg: Option<String>,
}

pub struct ClientRequestConfig {
  url: String,
}

impl Default for ClientRequestConfig {
  fn default() -> Self {
    Self { url: String::new() }
  }
}

impl ClientRequestConfig {
  pub fn new(url: String) -> Self {
    Self { url }
  }
}

impl Request {
  pub fn authentication(&mut self, authentication: String) {
    self.authentication = Some(authentication);
  }

  pub fn headers(&mut self, header: HeaderMap) {
    self.headers = header;
  }

  pub async fn request<T>(&self, config: ClientRequestConfig, method: Method) -> Result<T>
  where
    T: DeserializeOwned,
  {
    let url = self.resolve_url(config.url);
    println!("{url}");
    let mut req = self
      .instance
      .request(method.clone(), url.clone())
      .headers(self.headers.clone())
      .timeout(Duration::from_micros(self.timeout));
    let mut req_test = self.instance.request(method, url).build()?;

    if let Some(token) = &self.authentication {
      req = req.bearer_auth(token);
    };

    let req = req.build()?;

    println!("after");
    let text = self.instance.execute(req_test).await?.text().await?;
    println!("text:{text}");
    let response = self.instance.execute(req).await?.json::<T>().await?;

    Ok(response)
  }

  pub async fn delete<T>(&self, config: ClientRequestConfig) -> Result<T>
  where
    T: DeserializeOwned,
  {
    let response = self.request::<T>(config, Method::DELETE).await?;

    Ok(response)
  }

  pub async fn post<T>(&self, config: ClientRequestConfig) -> Result<T>
  where
    T: DeserializeOwned,
  {
    let response = self.request::<T>(config, Method::POST).await?;

    Ok(response)
  }

  pub async fn put<T>(&self, config: ClientRequestConfig) -> Result<T>
  where
    T: DeserializeOwned,
  {
    let response = self.request::<T>(config, Method::PUT).await?;

    Ok(response)
  }

  pub async fn get<T>(&self, config: ClientRequestConfig) -> Result<T>
  where
    T: DeserializeOwned,
  {
    let response = self.request::<T>(config, Method::GET).await?;

    Ok(response)
  }

  fn resolve_url(&self, url: String) -> String {
    return format!("{}{}", &self.base_url, url);
  }
}
