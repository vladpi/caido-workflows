cat - | jq -r .response | base64 -d | sed '1,/^\r$/d' | gitleaks stdin --report-format json -r - --no-banner --no-color --exit-code 0
