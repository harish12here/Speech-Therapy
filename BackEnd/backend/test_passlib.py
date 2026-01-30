# test_passlib.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hash = pwd_context.hash("testpassword")
print(f"Hash: {hash}")
print(f"Verify: {pwd_context.verify('testpassword', hash)}")
