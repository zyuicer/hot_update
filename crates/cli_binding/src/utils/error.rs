use std::fmt::Display;

pub type Result<T> = anyhow::Result<T, CliError>;

#[derive(Debug)]
pub enum CliError {
  Customer(String),
}

impl Display for CliError {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      Self::Customer(value) => {
        write!(f, "faild msg: {}", value)
      }
    }
  }
}

impl From<CliError> for napi::Error {
  fn from(value: CliError) -> Self {
    match value {
      CliError::Customer(v) => Self::from_reason(v),
    }
  }
}

impl<T> From<T> for CliError
where
  T: std::error::Error + Send + Sync,
{
  fn from(value: T) -> Self {
    Self::Customer(value.to_string())
  }
}
