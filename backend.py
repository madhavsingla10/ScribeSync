import os
import json
import gradio as gr
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables (e.g. GEMINI_API_KEY)
load_dotenv()

# Pydantic Schemas matching ScribeSync AnalysisResult interface
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

def analyze_diagram(image):
    """
    Receives an uploaded sketch image from the Gradio interface / API,
    invokes Gemini 3.7 Flash multimodal vision with structured output,
    and returns the compiled architecture data.
    """
    if image is None:
        raise gr.Error("No image uploaded. Please provide a whiteboard or napkin sketch.")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise gr.Error("GEMINI_API_KEY environment variable is not configured.")

    client = genai.Client(api_key=api_key)

    # Read binary bytes from the image file path provided by Gradio
    if isinstance(image, str):
        with open(image, "rb") as f:
            image_bytes = f.read()
    elif isinstance(image, bytes):
        image_bytes = image
    else:
        import io
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        image_bytes = buf.getvalue()

    try:
        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                "Analyze this hand-drawn sketch or whiteboard diagram."
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are an elite Principal Software Architect. "
                    "Inspect the hand-drawn sketch or whiteboard diagram. "
                    "Identify all entities, fields, relationships (1:1, 1:N, N:M), and architectural components. "
                    "Output clean, syntactically correct Mermaid, Prisma, and SQL schemas. Follow the schema exactly."
                ),
                response_mime_type="application/json",
                response_schema=AnalysisResult,
            )
        )

        if not response.text:
            raise gr.Error("Received empty response from Gemini.")

        parsed = json.loads(response.text)
        return parsed

    except Exception as e:
        raise gr.Error(f"Synthesis failed: {str(e)}")

# Define Gradio UI and API interface
with gr.Blocks(title="ScribeSync LLM Backend API", theme=gr.themes.Base()) as demo:
    gr.Markdown("# ✏️ ScribeSync — Python & Gradio API Backend")
    gr.Markdown("This Gradio server powers the multimodal LLM synthesis engine for the ScribeSync Node/React frontend.")

    with gr.Row():
        image_in = gr.Image(type="filepath", label="Upload Sketch")
        json_out = gr.JSON(label="Synthesized Architecture Result")

    btn = gr.Button("Synthesize Architecture", variant="primary")

    # Connect function to button and expose API endpoint '/analyze'
    btn.click(
        fn=analyze_diagram,
        inputs=[image_in],
        outputs=[json_out],
        api_name="analyze"
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"Starting Gradio API server on http://localhost:{port}")
    demo.launch(server_name="0.0.0.0", server_port=port, cors_allowed_origins=["*"])
