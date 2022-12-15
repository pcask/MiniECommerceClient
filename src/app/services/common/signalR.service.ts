import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  private _connection: HubConnection;

  get connection(): HubConnection {
    return this._connection;
  }

  start(hubURL: string) {
    if (!this._connection || this._connection?.state == HubConnectionState.Disconnected) {
      const builder: HubConnectionBuilder = new HubConnectionBuilder();

      const hubConnection: HubConnection = builder
        .withUrl(hubURL)
        .withAutomaticReconnect([1000, 5000, 10000, 30000]) // Başarılı bir bağlantı ardından kopma olursa, otomatik olarak bağlantı koptuktan sonra 
        // 1. 5. 10. ve 30. saniyelerde tekrar bağlanmayı deneyecektir. Parametresiz kullanımda ise 0. 2. 10. 30. saniyelerde tekrar bağlantı deneyecektir.
        // bu süreçlerde tekrar bağlantı sağlanamazsa bir daha bağlantı denemesi gerçekleşmeyecektir.
        .build();

      hubConnection.start()
        .then(result => console.log("Connection is successful"))
        .catch(err => setTimeout(() => this.start(hubURL), 2000)); // Eğer ilk bağlantı sırasında bir hata alınırsa recursive olarak her 2 saniyede bir tekrar
        // bağlantı isteğinde bulunulacaktır taki başarılı bir bağlantı gerçekleşinceye dek.

      this._connection = hubConnection;
    }

    // Connection için yeniden bağlantı talebi gönderilmeden önce tetiklenecek olan callback func. Örneğin tüm cookie'lerin temizlenmesi gibi işlemler yapılabilir.
    this._connection.onreconnecting(error => console.log("Connection is reconnecting"));
    // Connection yeniden bağlandıktan sonra tetiklenecek callback func. Bu func içerisinde ilgili Client'ın connectionId bilgisini barındırır.
    this._connection.onreconnected(connectionId => console.log(`Connection with ${connectionId} id is reconnected successfully`));
    // Reconnection işlemi gerçekleşemez ise connection kapandıktan sonra tetiklenecek callback function
    this._connection.onclose(error => console.log("Connection is closed."));
  }

  invoke(procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {

    this._connection.invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);

  }

  on(procedureName: string, callBack: (...message: any) => void) {

    this._connection.on(procedureName, callBack);

  }
}
