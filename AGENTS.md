# Agent Instructions - User Scripts and Chrome Extensions

## Git Workflow

- Always commit your changes when you have completed a task or reached a logical stopping point
- Use clear, descriptive commit messages that explain what was done and why
- Ensure the working directory is clean (all changes committed) before ending your session

## Userscripts

When creating userscripts (also known as monkeyscripts, Greasemonkey scripts, Tampermonkey scripts, etc.):

### Metadata Block

- **Namespace**: Always use `https://elite-ai-assisted-coding.dev/`
- **Version**: Always start with `0.0.1`
  - Increment the revision (third number) with every change to the file
  - Only increment minor (second number) or major (first number) if the user explicitly requests it

### Code Style

- Always include explanatory comments throughout the JavaScript code
- Comments should explain what each part of the code does
- The script should be easily readable at a glance so the user can quickly understand how it works

### Permissions

- Request the minimum set of `@grant` permissions required for the script to function
- Never omit a permission that is actually required
- If no special permissions are needed, use `@grant none`
