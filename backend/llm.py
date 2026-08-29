import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

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

def analyze_diagram(image_path: str):
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-3.7-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
            "Analyze this hand-drawn sketch or whiteboard diagram."
        ],
        config={
            "system_instruction": (
                "You are an elite Principal Software Architect. Inspect the sketch. "
                "Output clean, valid Mermaid, Prisma, and SQL schemas matching the schema."
            ),
            "response_mime_type": "application/json",
            "response_schema": AnalysisResult,
        }
    )
    return json.loads(response.text)
