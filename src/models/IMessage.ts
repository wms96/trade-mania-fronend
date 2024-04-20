export interface IMessage {
  content: string;
  created_at: Date;
  id: number;
  seen: boolean;
  sent: boolean;
  to_user_id: number;
  updated_at: Date;
  user_id: number;
}
