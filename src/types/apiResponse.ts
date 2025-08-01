import { Message } from './../model/User';

export interface ApiResponse {
  success: boolean;
  message?: string; // made optional since it might not always be present
  isAcceptingMessages?: boolean;
  messages?: Message[]; // made optional to avoid errors when not returned
}
