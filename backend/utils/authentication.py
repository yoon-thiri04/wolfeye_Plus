from fastapi.security import OAuth2PasswordBearer
from fastapi import Security, HTTPException
from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def generate_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=60)
    to_encode.update(
        {"exp": expire}
    )

    encoded_jwt = jwt.encode(to_encode, "33455", algorithm="HS256")
    return encoded_jwt


def decode_jwt_token(token: str):
    try:
        payload = jwt.decode(token, "33455", algorithms="HS256")
        if payload.get("exp") and payload["exp"] >= datetime.now().timestamp():
            return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(token: str = Security(oauth2_scheme)) -> dict:
    return decode_jwt_token(token)