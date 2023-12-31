# -*- coding: utf-8 -*-

"""
@author: beloved

This app will take japanese text as input, carry out all the NLP tasks, and save everything in a structured database
along with media files in proper folders, uniquely named folders.

Features:
- gradio UI for interfacing
- inputs - Option to input the respective text lines or
- JP text line spliting
- Incorporate Kudasai Preprocessor
-

Todo

- There should be a central DB for all the lines that have been run and sucessfully processed. - sqlite will work
- Add check for internet connectivity
-

"""



import gradio as gr
from transmute import test_list as test_list, test_list_2 as test_list_2
import transmute

# ----------------------------------------------------------------------------------------------------------------------#
# GLOBAL VARIABLES
# ----------------------------------------------------------------------------------------------------------------------#


# ----------------------------------------------------------------------------------------------------------------------#
# GRADIO WEBGUI
# ----------------------------------------------------------------------------------------------------------------------#


class RekaiUI:

    def gradio_web_ui(self):

        def t_function():
            rekai_multiprocessed.Transmute.parse_list_with_jisho(test_list)
            return print('function complete')

        # Frontend
        with gr.Blocks() as self.web_ui:
            gr.Markdown("""# Re:KAI""")

            with gr.Tab("Preprocess") as self.preprocess_tab:
                with gr.Column():
                    Tab1_run_btn = gr.Button('Run')

            # Event Listeners
            Tab1_run_btn.click(fn=t_function, inputs=None, outputs=None)


    def launch(self):
        self.gradio_web_ui()
        self.web_ui.launch(show_error=True)


if __name__ == '__main__':

    try:
        rekai_ui = RekaiUI()
        rekai_ui.launch()
    except Exception as e:
        print(e)
