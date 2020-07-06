import { map } from "rxjs/operators/";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { UserModel } from "../models/usuario.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = `https://identitytoolkit.googleapis.com/v1`;
  private apiKey = `AIzaSyBMG6dxErXTwR5ujXjprLGUc7oZHPPTUWw`;
  private userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
    // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  }

  logout() {
    localStorage.removeItem("token");
  }

  login(usuario: UserModel) {
    /* const authData = {
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    }; */

    /* Optmización Con El Spread Operator */
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    /* Antes de suscribirme al observable y obtener la data, se activa el pipe, */

    /* y el map filtra la información que esta recibiendo a traves del http.post u observable */

    /* Si el observable entrega un error el map nunca se dispara, se captura con un catchError, pero en este caso no es necesario */

    /* Utilizarlo por que ya estamos capturando un error en el suscribe */

    /* El pipe y los methodos se ejecutan antes de suscribirme, eso es muy importante tener en cuenta */

    /* se retorna la respuesta para que me retorne la respuesta en el suscribe y no me la detenga en el map */

    return this.http
      .post(
        `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
        authData
      )
      .pipe(
        map((res) => {
          // tslint:disable-next-line: no-string-literal
          this.guardarToken(res["idToken"]);
          return res;
        })
      );
  }

  nuevoUsuario(usuario: UserModel) {
    /* const authData = {
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    }; */

    /* Optmización Con El Spread Operator */
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    /* Antes de suscribirme al observable y obtener la data, se activa el pipe, */

    /* y el map filtra la información que esta recibiendo a traves del http.post u observable */

    /* Si el observable entrega un error el map nunca se dispara, se captura con un catchError, pero en este caso no es necesario */

    /* Utilizarlo por que ya estamos capturando un error en el suscribe */

    /* El pipe y los methodos se ejecutan antes de suscribirme, eso es muy importante tener en cuenta */

    /* se retorna la respuesta para que me retorne la respuesta en el suscribe y no me la detenga en el map */
    return this.http
      .post(`${this.url}/accounts:signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((res) => {
          // tslint:disable-next-line: no-string-literal
          this.guardarToken(res["idToken"]);
          return res;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    /* Una Hora De Expiracion Despues De Obtenido El Token */
    const hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    /* Validacion de un tiempo de expiracion para el token en el frontend */
    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
