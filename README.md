# GPT Prompt Generation System

This project is designed to automate the generation of GPT-4 system prompts based on a set of use-cases and test cases. It leverages a Google Sheets backend for data management and uses various custom functions to interact with the OpenAI API, generating and evaluating prompts dynamically.

## Overview

The script consists of multiple functions, each handling a specific part of the prompt generation and evaluation process:

- `generate_candidate_prompts`: Generates new system prompts based on a description and the number of prompts needed.
- `match_list`: Matches generated prompts for comparative evaluation.
- `ranking`: Evaluates two prompts against each other based on a specific test case.
- `main_process`: Coordinates the entire process of generating, evaluating, and updating prompt scores.
- `initialization`: Resets the spreadsheet to initial state for fresh prompt generation.

## Dependencies

To run this script, you need to:
- Have access to Google Apps Script within Google Sheets.
- Obtain and configure your OpenAI API key properly within the script.

## Setup

1. **Google Sheets Preparation**:
    - Open your Google Sheet at [this link](https://docs.google.com/spreadsheets/d/1u2hvxTYtuzlLtk1a8h5ovNsFIzgdPPsHbbs33lXlo4Y/edit?usp=sharing).
    - Copy one for yourself.
    - Ensure that the cells are formatted and named as expected by the script (e.g., `panel`, `candidate`, etc.).

2. **Script Configuration**:
    - Replace `OPENAI_API_KEY` with your actual OpenAI API key.

3. **Initialization**:
    - Run the `initialization()` function by botton to set up or reset the spreadsheet for operations.

## Usage

To use the system:
- Execute the `main_process()` to start the automated process of prompt generation, evaluation, and scoring updates.
- Monitor the process through the Google Sheets interface and the Logger output within Google Apps Script.

## Important Notes

- The script requires permissions to run Google Apps Script and manage your Google Sheets data.
- Ensure API usage limits are monitored to avoid unexpected costs or rate limiting issues.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your proposed changes.

## License

Copyright (c) 2024 Kouzui-HUANG

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


---
