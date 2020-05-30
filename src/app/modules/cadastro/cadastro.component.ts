import { Component } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


function validateUsername(formControl) {
  const url = `http://localhost:3200/users/validation/${formControl.value}`;
  formControl.markAsTouched();
  return fetch(url)
    .then((respostaDoServer) => {
      if(respostaDoServer.ok) {
        return null;
      }
      throw new Error('Usuário já foi pego :(')
    })
    .catch(() => {
      return { userTaken: true }
    });
}

@Component({
  selector: 'cmail-cadastro-page',
  templateUrl: './cadastro.component.html',
})
export class CmailCadastroComponent {
  formCadastro = new FormGroup({
    name: new FormControl('Fernanda', [Validators.required, Validators.minLength(4)]),
    username: new FormControl(
      'Fernanda17ize',
      [Validators.required],
      [this.validateUsernameComRxJS.bind(this)]),
    phone: new FormControl('11112222', [
      Validators.required,
      Validators.pattern('[0-9]{4}-?[0-9]{4}[0-9]?')
      // https://regex101.com/r/a2JcP0/1
    ]),
    avatar: new FormControl('asusahuuhsa', [Validators.required]),
    password: new FormControl('123', [Validators.required]),
    // lidar com tamanho
    // só numeros
    //  ter 9 digitos
  });


  constructor(private httpClient: HttpClient) {

    const url = `http://localhost:3200/users/validation/fernanda17ize`;

    this.httpClient.get(url)
    // Processamento
      .pipe(
        map((input: string) => {
          console.warn('Dentro do map:', input);
          return input.toUpperCase();
        }),
        catchError(() => {
         
          return 'Deu ruim';
        })
      )
    // Saída 
      .subscribe(
        (dados) => {
          console.warn('Deu certo!', dados)
        },
        () => {
          console.log('Deu ruim!')
        },
        () => {
          console.log('terminou')
        },
      )
  }

  validateUsernameComRxJS(formControl) {
    const url = `http://localhost:3200/users/validation/${formControl.value}`;
    return this.httpClient.get(url)

  }

  handleCadastroDeUsuario() {
    if(this.formCadastro.valid) {
      // Troca os dados do objeto no body pra vir os do form
      fetch('http://localhost:3200/users', {
        method: 'POST',
        body: JSON.stringify({
          "name": "Fernanda",
          "username": "fernanda17ize",
          "phone": "2997668200",
          "password": "123",
          "avatar": "aaaa"
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(() => {

      })
      .catch(() => {

      })
      // !!! checar aqui: http://localhost:3200/users
    } else {

      Object.keys(this.formCadastro.controls).forEach((nomeDoCampo) => {
          console.log('[this]', this);
          this.formCadastro.get(nomeDoCampo).markAsTouched({ onlySelf: true })
      })
    }
  }

}
