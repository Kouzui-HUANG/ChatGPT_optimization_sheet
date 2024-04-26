# README for GPT Prompt Generation System

## Overview

This script provides a structured framework for generating and evaluating GPT-4 prompts based on given descriptions and test cases. The system uses Google Sheets (or a similar service) to manage and retrieve data, which is then used to dynamically generate prompts and assess their effectiveness through a series of comparative tests. The main functionalities include prompt generation, prompt testing, ranking, and Elo rating updates for each prompt based on comparative evaluations.

## Features

- **Dynamic Prompt Generation:** Generates new prompts based on a predefined number of times fetched from a spreadsheet, taking into consideration previously had prompts.
- **Prompt Evaluation:** Compares generated prompts through a pairwise test set to determine the most effective ones.
- **Elo Rating System:** Updates the Elo rating for each prompt based on their comparative evaluations to rank them in terms of effectiveness.
- **Logging and Results Management:** Outputs necessary logs for debugging and manages the results directly within a spreadsheet.

## System Components

### 1. `generate_candidate_prompts()`
- Fetches necessary information such as the number of required prompts from the spreadsheet.
- Generates prompts using GPT-4 based on the provided system description and logs the results.
- Calculates the number of prompt comparisons needed and updates the spreadsheet with the new prompt data.

### 2. `match_list()`
- Retrieves all generated prompts and organizes them into pairs for comparison.
- Each pair of prompts is compared across various test cases.

### 3. `ranking(prompt_A, prompt_B, test_question)`
- This function receives two prompts and a test question, generates responses from GPT-3.5-turbo, and then evaluates which prompt produces a better response using a detailed comparison and ranking system.

### 4. `main_process()`
- Manages the full lifecycle of testing and updating scores based on the ranking results.
- Updates the Elo ratings of prompts based on the outcomes of their pairwise comparisons.

## Usage

To use this script, ensure that:
- You have a Google Spreadsheet set up with the appropriate structure to store prompt numbers, test cases, and results.
- The `OPENAI_API_KEY` is set with a valid API key for OpenAI services.

## Setup

1. **Spreadsheet Configuration:**
   - Configure your spreadsheet with columns designated for prompt storage, test cases, ratings, and results.
2. **API Key:**
   - Insert your OpenAI API key in the script where `OPENAI_API_KEY` is defined.

## Requirements

- Google Apps Script environment or similar that supports JavaScript.
- Access to OpenAI API with a valid API key.

## Note

This script is designed to work in environments that support JavaScript execution and can manage HTTP requests to interact with the OpenAI API. Ensure that all external service integrations comply with OpenAI's usage policies and the terms of service of the spreadsheet provider.
