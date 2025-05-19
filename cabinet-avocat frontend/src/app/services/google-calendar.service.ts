import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {

  private clientId = 'TON_CLIENT_ID.apps.googleusercontent.com'; // << Remplace par ton vrai Client ID
  private redirectUri = 'http://localhost:4200'; // L'URL où Google redirige après connexion
  private scope = 'https://www.googleapis.com/auth/calendar';
  private authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(private http: HttpClient) {
    // Optionnel : initialiser des choses si besoin
  }

  // Fonction pour obtenir l'URL d'autorisation Google
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'token', // ou 'code' si tu fais serveur -> serveur
      scope: this.scope,
      include_granted_scopes: 'true',
      state: 'state_parameter_passthrough_value' // optionnel pour sécuriser
    });

    return `${this.authEndpoint}?${params.toString()}`;
  }

  // (Optionnel) Fonction pour créer un événement sur Google Calendar
  createEvent(accessToken: string, event: any) {
    const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    return this.http.post(url, event, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

}
