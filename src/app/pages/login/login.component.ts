import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";

import { UserModel } from "../../models/usuario.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: UserModel = new UserModel();
  recordarUser = false;

  constructor(private auth: AuthService, private router: Router) {}

  /* Para Que El Checkbox Este Activado */
  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.user.email = localStorage.getItem("email");
      this.recordarUser = true;
    }
  }

  onSubmit(e, form: NgForm) {
    e.preventDefault();

    if (form.invalid) {
      return;
    }

    /* Alerta Con Loading */
    Swal.fire({
      title: "Espere Por Favor",
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(
      (res) => {
        // console.log(res);

        /* Para Que El Checkbox Este Activado(true) */
        if (this.recordarUser) {
          localStorage.setItem("email", this.user.email);
        }

        Swal.close();
        this.router.navigateByUrl("/home");
      },
      (err) => {
        // console.log(err.error.error.message);
        Swal.fire({
          title: err.error.error.message,
        });
      }
    );
  }
}
