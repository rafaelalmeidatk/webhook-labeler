# 🏷️⚙️ Webhook Labeler

Serverless function to automatically add labels to Pull Requests based on the changed files

## How to install

1. Clone this repo and deploy the code to [Vercel](https://vercel.com/download)

```
$ git clone https://github.com/rafaelalmeidatk/webhook-labeler
$ cd webhook-labeler
$ vercel
```

2. Create a GitHub personal token (instructions [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)) with the `repo` scope. The user that generated the token should have permissions to see the target repo and add labels to the PRs.

3. Inside the Vercel dashboard, access the settings of the deployed project and add the following env variables:

- `GITHUB_TOKEN`: the token that you created on step 2
- `GITHUB_SECRET`: a strong random string, this should not be public available

> A server restart is required, you can do this deploying the code again

4. Add the `labeler.json` file to the target repo, inside the `.github` folder (`.github/labeler.json`). Config example:

```json
{
  "labels": {
    "core": ["src/**", "api/**"],
    "docs": "docs/**"
  }
}
```

5. Go to the Webhooks page inside the repo settings and click the "Add webhook" button

- **Payload URL**
  The URL of the deployment you made on step 1
- **Content type**
  `application/json`
- **Secret**
  The random string you created on step 3
- **Which events would you like to trigger this webhook?**
  `Pull requests`

6. After submiting the form, a `ping` event will be sent to confirm if everything is correct.

You can use the same deploy for multiple repos.

## Development

Run `yarn install` to install the deps and `yarn dev` to start the local server (the [Vercel CLI](https://vercel.com/download) should be globally available).
