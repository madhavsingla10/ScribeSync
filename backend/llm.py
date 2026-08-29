import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")

class Endpoint(BaseModel):
    method: str
    path: str
    description: str

class AnalysisResult(BaseModel):
    title: str
    summary: str
    mermaidDiagram: str
    prismaSchema: str
    sqlSchema: str
    endpoints: list[Endpoint]

def analyze_diagram(image_input):
    if isinstance(image_input, dict):
        image_path = image_input.get("path") or image_input.get("url")
    elif hasattr(image_input, "path"):
        image_path = image_input.path
    else:
        image_path = image_input

    if isinstance(image_path, str) and os.path.exists(image_path):
        with open(image_path, "rb") as f:
            image_bytes = f.read()
    elif isinstance(image_input, bytes):
        image_bytes = image_input
    elif hasattr(image_input, "read"):
        image_bytes = image_input.read()
    else:
        raise ValueError(f"Cannot read image from: {image_input}")

    client = genai.Client()
    contents = [
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        "Analyze this hand-drawn sketch or whiteboard diagram."
    ]
    config = {
        "system_instruction": (
            "You are an elite Principal Software Architect. Inspect the sketch. "
            "Output clean, valid Mermaid, Prisma, and SQL schemas matching the schema."
        ),
        "response_mime_type": "application/json",
        "response_schema": AnalysisResult,
    }

    try:
        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=contents,
            config=config
        )
    except Exception:
        # Fallback to gemini-3.5-flash if 3.7 experiences temporary high demand
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=contents,
            config=config
        )

    return json.loads(response.text)
