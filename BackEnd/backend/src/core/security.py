#backend/script/core/security.py
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
# This module provides functions for hashing and verifying passwords using bcrypt algorithm.
# It can be used in user authentication processes to securely store and check passwords.
# Example usage:
# hashed = hash_password("mysecretpassword
# is_valid = verify_password("mysecretpassword", hashed)
# print(is_valid)  # Output: True


        