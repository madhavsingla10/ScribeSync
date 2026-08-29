import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gradio as gr
from llm import analyze_diagram

def handle_analyze(image):
    try:
        return analyze_diagram(image)
    except Exception as e:
        raise gr.Error(str(e))

with gr.Blocks(title="ScribeSync API") as demo:
    gr.Markdown("# ✏️ ScribeSync — Python & Gradio API Backend")
    gr.Markdown("Powers the multimodal LLM synthesis engine for the ScribeSync React frontend.")

    with gr.Row():
        image_in = gr.Image(type="filepath", label="Upload Sketch")
        json_out = gr.JSON(label="Synthesized Architecture Result")

    btn = gr.Button("Synthesize Architecture", variant="primary")

    btn.click(
        fn=handle_analyze,
        inputs=[image_in],
        outputs=[json_out],
        api_name="analyze"
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"Starting Gradio API server on http://localhost:{port}")
    demo.launch(server_name="0.0.0.0", server_port=port)
