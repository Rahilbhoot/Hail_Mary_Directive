import json
from openai import AsyncOpenAI

from brain.config import ENVIRONMENT_VARIABLES, SYSTEM_PROMPT
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR


class LLMRouter:
    def __init__(self):
        self.llm = AsyncOpenAI(
            api_key=ENVIRONMENT_VARIABLES.OPENAI_API_KEY,
            base_url=ENVIRONMENT_VARIABLES.OPENAI_BASE_URL,
        )

    async def generate_response(self, user_message):
        try:
            response = await self.llm.responses.create(
                model="auto",
                instructions=SYSTEM_PROMPT,
                input=[{"role": "user", "content": user_message}],
            )

            assistant_message = response.output_text
            return {"status_code": SUCCESS, "assistant_message": assistant_message}
        except Exception as e:
            return {"status_code": INTERNAL_SERVER_ERROR, "assistant_message": None}
