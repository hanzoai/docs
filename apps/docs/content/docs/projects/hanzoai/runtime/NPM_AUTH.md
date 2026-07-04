# NPM Authentication for Publishing

## Method 1: Using .npmrc with Auth Token

1. First, create an access token on npm:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" 
   - Select "Automation" type (bypasses 2FA for CI/CD)
   - Copy the token

2. Add the token to your `.npmrc` file:

```bash
# In your home directory ~/.npmrc
//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE
```

Or for project-specific:
```bash
# In project root .npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

3. If using environment variable, set it:
```bash
export NPM_TOKEN="npm_YOUR_TOKEN_HERE"
```

## Method 2: Using npm login with --auth-type=legacy

For automation tokens that bypass 2FA:
```bash
npm set //registry.npmjs.org/:_authToken "npm_YOUR_TOKEN_HERE"
```

## Method 3: For GitHub Actions / CI

```yaml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    registry-url: 'https://registry.npmjs.org'

- name: Publish
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Publishing with Token

Once configured, you can publish without OTP:
```bash
npm publish --access public --tag beta
```

## Security Notes

- Never commit tokens to git
- Use environment variables for CI/CD
- Automation tokens bypass 2FA, so keep them secure
- Tokens can be revoked at https://www.npmjs.com/settings/YOUR_USERNAME/tokens