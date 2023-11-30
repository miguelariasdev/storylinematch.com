import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    // Aquí implementarías la lógica para verificar si el usuario está autenticado
    // Por ejemplo, comprobando la existencia de un token JWT en el almacenamiento local
    return !!localStorage.getItem('token');
  }
}
