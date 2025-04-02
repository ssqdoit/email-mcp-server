# Email MCP Server

MCP Server for the Email.

## Setup

### Environment Variables


### NPX

```json
{
    "mcpServers": {
        "email-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "email-mcp-server"
            ],
            "env": {
                "EMAIL_HOST": "Replace with your SMTP server",
                "EMAIL_PORT": "Replace with your SMTP port",
                "EMAIL_ACCOUNT": "Replace with your email account",
                "EMAIL_PASSWORD": "Replace with your password or app-specific password"
            }
        }
    }
}
```