# Splits a large CSV into (potentially) many smaller CSVs, preserving
# headers. The size of each chunked CSV is determined by the
# second parameter. Outputs the resulting CSVs to a
# subdirectory `split/` residing in the directory where this
# script is invoked.

# Params: 
#   $1: The prompt which will be sent to ChatGPT
#   $2: The model to use (defaults to gpt-4.1) // TODO

# Invoke the script like this:
# sh chat-gpt.sh "Tell me a joke"

# TODO: Validate a prompt was entered

# Prompt ChatGPT for a response
echo "Prompting ChatGPT (model gpt-4.1)...\n"
echo "\x1b[33m\"$1\"\x1b[0m\n\x1b[32m"
curl -s "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "{
    \"model\": \"gpt-4.1\",
    \"input\": \"$1\"
  }" |

# Parse the output text from the full response
jq -r '.output | first | .content | first | .text'
echo "\x1b[0m"
