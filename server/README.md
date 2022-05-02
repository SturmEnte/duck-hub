# Duck Hub Server (With web interface)

## Info

If you don't need or want the web interface then you can disable it in the config file (json/config.json)

## Config

You can set following variables in the environment variables. Any of them are also editable in json/config.json

Note: Variables marked with an \* have no default setting and must therefore be set manually to run the server

- PORT: The port on which the server will run
- MONGODB_URI: The uri to the MongoDB database that you want to use
- ACCESS_TOKEN_SECRET: The secret for the access token\*
- REFRESH_TOKEN_SECRET: The secret for the refresh token\*
