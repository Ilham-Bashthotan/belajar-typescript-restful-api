# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```
{
    "username": "IlhamBest",
    "password": "RahasiaBanget",
    "name": "Ilham B"
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "IlhamBest",
        "name": "Ilham B"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "Username must not blank, ..."
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
    "username": "IlhamBest",
    "password": "RahasiaBanget",
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "IlhamBest",
        "name": "Ilham B",
        "token": "uuid"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "Username or password wrong, ..."
}
```

## Get User

Endpoint: GET /api/users/current

Request Header:
- X-API-TOKEN: token

Response Body (Success):
```json
{
    "data": {
        "username": "IlhamBest",
        "name": "Ilham B",
    }
}
```

Response Body (Failed):
```json
{
    "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header:
- X-API-TOKEN: token

Request Body:

```json
{
    "password": "RahasiaBanget", // tidak wajib
    "name": "Ilham B" // tidak wajib
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "IlhamBest",
        "name": "Ilham B"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint: DELETE /api/users/current

Request Header:
- X-API-TOKEN: token

Response Body (Success):
```json
{
    "data": "OK"
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized, ..."
}
```