# Kwegonian Translator
Node.js Server and Vue.js client for kwegonian number conversion.
For a live preview, [try this link](https://kwego.txto.com.br).

## Running locally
You must have [Node.js](https://nodejs.org) installed in your environment.
Then, run in a shell:
```
npm run start
```
There are tests covering the translation core. You can run then with:
```
npm run test
```
The Kwegonian Translator will be running in [localhost:9000](http://localhost:9000).
If you want to override the default port, create a file named ".env" in the root folder,
containing:
```
PORT=DESIRED_PORT
```
## Deploying with docker
Included in the source is a docker-compose, for easy deploying the app.
This docker-compose is the same that runs the [currently deployed sample](https://kwego.txto.com.br). To
correctly doing so, [this traefik image](https://github.com/ploissken/traefik) is necessary to routes subdomains and add SSL certificates.

## Structure
```
  src
  ├── kwego-dictionary  # json containing translations to roman and decimal
  ├── server            # express configuration, routes and web listener
  └── translator        # core translation module

  test
  └── translator        # test coverage for translator module
```

## Usage
To translate using the API, you can either access it thru
the browser or via curl:
```
curl "http://localhost:9000/kwego?k=KWEGOALGARISMS"
```
where KWEGOALGARISMS are a set of kwegonian algarisms separated
by spaces (encoded as %20) or commas. For [example](https://kwego.txto.com.br/kwego?k=kil,pol):

```
$ curl "http://localhost:9000/kwego?k=kil,pol"
{"kwego":"kil pol","roman":"IX","decimal":9}

$ curl "http://localhost:9988/kwego?k=pol%20kil%20kil"
{"kwego":"pol kil kil","roman":"XII","decimal":12}
```

If you want only the decimals to be returned, just [pass the parameter](https://kwego.txto.com.br/kwego?k=pol%20jin%20kil&dec=1) dec = 1
```
$ curl "http://localhost:9900/kwego?k=pol%20jin%20kil&dec=1"
16
```
