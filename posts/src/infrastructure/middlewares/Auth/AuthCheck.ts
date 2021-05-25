import fetch from 'node-fetch'

export function AuthCheck(): any {
  return async function (request: any, response: any, next: any) {
    const authHeader = request.headers.authorization;

    const authRequest = await fetch('http://localhost:3000/users/verify/token', {
      headers: {"Authorization": authHeader}
    })

    if(!authRequest.ok) {
      return response.status(401).send({ status: 403, message: 'Unauthorized!' });
    }

    let loggedUser = await authRequest.json();
    console.log(loggedUser);
    
    loggedUser.authHeader = authHeader;

    request.loggedUser = loggedUser;

    return next();
  };
}