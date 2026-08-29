import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr
from llm import analyze_diagram

def handle_analyze(image):
    try:
        data = analyze_diagram(image)
        return json.dumps(data)
    except Exception as e:
        print("Backend error:", e)
        raise gr.Error(str(e))

with gr.Blocks(title="ScribeSync API") as demo:
    gr.Markdown("# ✏️ ScribeSync — Python & Gradio API Backend")
    gr.Markdown("Powers the multimodal LLM synthesis engine for the ScribeSync React frontend.")

    with gr.Row():
        image_in = gr.File(label="Upload Sketch", file_types=[".png", ".jpg", ".jpeg"])
        json_out = gr.Textbox(label="Synthesized Architecture Result", visible=False)

    btn = gr.Button("Synthesize Architecture", variant="primary")

    btn.click(
        fn=handle_analyze,
        inputs=[image_in],
        outputs=[json_out],
        api_name="analyze"
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"Starting Gradio API server on http://127.0.0.1:{port}")
    demo.launch(server_name="0.0.0.0", server_port=port, show_error=True)
