import {TUser} from "./TUser";

export type TAuthResponse = {
  user: TUser;
  token: string;
}