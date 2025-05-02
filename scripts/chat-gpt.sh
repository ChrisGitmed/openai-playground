# Script to initiate a conversation with ChatGPT from within the terminal.
# Usage: sh chat-gpt.sh

# Set the filepath to the chat history file
HISTORY_FILE="chat_history.json"

# Delete the history file if the process is killed
trap 'rm $HISTORY_FILE; exit 1' SIGTERM SIGINT

# If no history file exists, create one and write an empty JSON array
if [ ! -f "$HISTORY_FILE" ]; then
  echo '[]' > $HISTORY_FILE
fi

# Begin the conversation
echo
echo "Type 'exit' to end the conversation at any time."
echo "Beginning conversation with ChatGPT (model gpt-4.1)..."
while true; do
  # Get user input
  echo
  read -p $'\x1b[32mYou:\x1b[0m ' USER_MSG
  echo

  # If the User types 'exit', exit the chat
  [[ "$USER_MSG" == "exit" ]] && break

  # Append user message to history
  jq \
    --arg content "$USER_MSG" \
    '. += [{"role": "user", "content": $content}]' \
    $HISTORY_FILE > tmp && mv tmp $HISTORY_FILE

  # Prepare request JSON
  REQ_JSON=$(jq -c '.' $HISTORY_FILE)

  # Send the request to OpenAI
  RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "gpt-4.1", "messages": '"$REQ_JSON"', "temperature": 0.7}'
  )

  # Extract assistant reply
  ASSISTANT_REPLY=$(echo $RESPONSE | jq -Rnr '[inputs] | join("\\n") | fromjson | .choices[0].message.content')
  echo $'\x1b[33mAssistant:\x1b[0m '"$ASSISTANT_REPLY"

  # Append assistant reply to history
  jq \
    --arg content "$ASSISTANT_REPLY" \
    '. += [{"role": "assistant", "content": $content}]' \
    $HISTORY_FILE > tmp && mv tmp $HISTORY_FILE
done

# Delete the history file
rm $HISTORY_FILE
