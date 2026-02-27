cat - | jq -r .response | base64 -d | sed '1,/^\r$/d' | jsluice urls -j
