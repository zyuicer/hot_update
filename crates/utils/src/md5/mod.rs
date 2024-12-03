use md5::{Digest, Md5};

pub fn md5_encode(content: &str) -> String {
  let mut hashed = Md5::new();

  hashed.update(content.as_bytes());

  let hash = hashed.finalize();

  let hex_hash = base16ct::lower::encode_string(&hash);

  hex_hash
}

