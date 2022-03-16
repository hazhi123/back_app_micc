import {
  Server,
  Socket,
} from 'socket.io';

import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client}`);
  }

  @SubscribeMessage('event')
  handleEvent(client: Socket, data: string): string {
    return data;
  }

  // @SubscribeMessage('msgToServer')
  // handleMessage(client: Socket, payload: string): void {
  //   console.log('client', client);
  //   console.log('payload', payload);
  //   this.server.emit('msgToClient', payload, client.id);
  // }

}
