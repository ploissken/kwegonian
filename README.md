# Kwegonian Translator
Server and client for kwegonian number conversion

## Running locally
You must have [Node.js](https://nodejs.org) installed in your environment.
Then, run in a shell:
```
npm run start
```
The Kwegonian Translator will be running in [localhost:9000](http://localhost:9000).
If you want to override the default port, create a file named ".env" in the root folder,
containing:
```
PORT=DESIRED_PORT
```

## Usage
To translate using the API, you can either access it thru
the browser or via curl:
```
curl http://localhost:9000/kwego?k=KWEGOALGARISMS
```
where KWEGOALGARISMS are a set of kwegonian algarisms separated
by spaces (encoded as %20) or commas. For instance:

```
$ curl http://localhost:9000/kwego?k=kil,pol
{"kwego":"kil pol","roman":"IX","decimal":9}

$ curl http://localhost:9988/kwego?k=pol%20kil%20kil
{"kwego":"pol kil kil","roman":"XII","decimal":12}
```

If you want only the decimals to be returned, just pass the parameter dec = 1
```
$ curl http://localhost:9900/kwego?k=pol%20jin%20kil&dec=1
16
```


## Test coverage
To check test coverage, run
```
npm run test
```
