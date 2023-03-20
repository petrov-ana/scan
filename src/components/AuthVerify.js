import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Buffer } from 'buffer';

const parseJwt = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  let location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  }, [location, props]);

  return ;
};

export default AuthVerify;