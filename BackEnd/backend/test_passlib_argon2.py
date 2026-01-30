# test_passlib_argon2.py
from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    hash = pwd_context.hash("testpassword")
    print(f"Hash: {hash}")
    print(f"Verify: {pwd_context.verify('testpassword', hash)}")
except Exception as e:
    print(f"Error: {e}")
