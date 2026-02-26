RESPONSE_BODY=$(cat - | jq -r .response | base64 -d | sed '1,/^\r$/d')

if [ -z "$RESPONSE_BODY" ]; then
  echo ''
  exit 0
fi

echo "$RESPONSE_BODY" | jsluice urls -j 2>/dev/null