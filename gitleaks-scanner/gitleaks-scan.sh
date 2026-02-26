RESPONSE_BODY=$(cat - | jq -r .response | base64 -d | sed '1,/^\r$/d')

if [ -z "$RESPONSE_BODY" ]; then
  echo '[]'
  exit 0
fi

echo "$RESPONSE_BODY" | gitleaks stdin --report-format json -r - --no-banner 2>/dev/null
EXIT_CODE=$?

if [ $EXIT_CODE -ne 1 ]; then
  echo '[]'
fi