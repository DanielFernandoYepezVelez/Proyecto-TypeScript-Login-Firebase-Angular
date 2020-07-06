import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

import { UserModel } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  user: UserModel;
  recordarUser: false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(e, form: NgForm) {
    e.preventDefault();

    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: "Espere Un Momento....",
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.user).subscribe(
      (res) => {
        // console.log(res);
        if (this.recordarUser) {
          localStorage.setItem("email", this.user.email);
        }

        Swal.fire({
          title: "Registro Exitoso....",
        });
        this.router.navigateByUrl("/login");
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
