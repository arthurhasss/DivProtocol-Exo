import os
import psycopg2
from contextlib import contextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ["DATABASE_URL"]


def get_connection():
    return psycopg2.connect(DATABASE_URL)


@app.on_event("startup")
def create_table():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS visitors (
                    id   SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL
                )
                """
            )
        conn.commit()


class GreetRequest(BaseModel):
    name: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/greet")
def greet(body: GreetRequest):
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="name cannot be empty")

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM visitors WHERE name = %s", (name,))
                exists = cur.fetchone() is not None
                if exists:
                    message = f"De retour, {name} !"
                else:
                    cur.execute("INSERT INTO visitors (name) VALUES (%s)", (name,))
                    conn.commit()
                    message = f"Bienvenue, {name} !"
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Database error") from exc

    return {"message": message}
