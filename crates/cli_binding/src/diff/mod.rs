use crate::utils::error::{CliError, Result};

pub fn diff_apk(old_file: &[u8], new_file: &[u8]) -> Result<Vec<u8>> {
  let mut patch = vec![];

  bsdiff::diff(old_file, new_file, &mut patch).map_err(|e| CliError::Customer(e.to_string()))?;

  let mut patched = Vec::with_capacity(new_file.len());
  bsdiff::patch(&old_file, &mut patch.as_slice(), &mut patched).unwrap();

  Ok(patched)
}

#[cfg(test)]
mod diff_test {
  use super::diff_apk;
  use crate::utils::error::Result;

  #[test]
  fn test_diff() -> Result<()> {
    let patched = diff_apk(&vec![0, 1, 2, 3, 4, 5], &vec![0, 1, 2, 4, 6]);
    match patched {
      Ok(v) => {
        println!("{:?}", v);
      }
      Err(_) => {
        panic!("error")
      }
    }

    Ok(())
  }
}
