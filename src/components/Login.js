import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";

const Login = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (data) => {

    setMessage("");
    setLoading(true);

    AuthService.login(data.username, data.password).then(
      () => {
        navigate("/home");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const validationLogin = (inputtxt) => {
    if (inputtxt[0] === '+') {
      return validationPoneNumber(inputtxt);
    }
    return true;
  }

  const validationPoneNumber = (inputtxt) => {
    var phoneno = /^\+?([0-9]{1})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{2})[ ]?([0-9]{2})$/;
    if (inputtxt.match(phoneno)) {
      return true;
    }
    return false;
  }

  return (
    <section className="auth">
      <div className="container">
        <div className="auth__wrapper">
          <div className="auth__inner-left">
            <h1 className="auth__title">Для оформления подписки на тариф, необходимо авторизоваться.</h1>
            <div className="auth__bg auth__bg--desktop"></div>
          </div>
          <div className="auth__inner-right">
            <div className="auth__form form form--auth">
              <div className="form__wrap-btn-select">
                <div className="form__select-form form__select-form_enter active">Войти</div>
                <div className="form__select-form form__select-form_reg">Зарегистрироваться</div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="form__auth active">
                <div className="form__item">
                  <label htmlFor="username" className="form__label label">Логин или номер телефона:</label>
                  <input
                    type="text"
                    className={formState.errors.username ? "is-invalid-input form__input input" : "form__input input"}
                    disabled={loading}
                    {...register("username", { required: true, validate: validationLogin })}
                  />
                  {formState.errors.username && <div className="input-error">Введите корректные данные</div>}
                </div>
                <div className="form__item">
                  <label htmlFor="password" className="form__label label">Пароль:</label>
                  <input
                    type="password"
                    className="form__input input"
                    disabled={loading}
                    {...register("password", { required: true })}
                  />
                  {formState.errors.password && <div className="input-error">Введите корректные данные</div>}
                </div>
                {message && (
                  <div className="form__error">{message}</div>
                )}
                <div className="form__align">
                  <button className="form__btn btn" disabled={!formState.isValid || loading}>
                    {loading && (
                      <span className="spinner24px"></span>
                    )}
                    <span>Войти</span>
                  </button>
                  <Link to="/login" className="form__rem-pass">Восстановить пароль</Link>
                </div>
                <div className="form__enter">
                  <div className="form__enter-title">Войти через:</div>
                  <Link to={{ pathname: "https://google.com/" }} className="form__enter-ico form__enter-image--gg" target="_blank" />
                  <Link to={{ pathname: "https://ru-ru.facebook.com/" }} className="form__enter-ico form__enter-image--fb" target="_blank" />
                  <Link to={{ pathname: "https://ya.ru/" }} className="form__enter-ico form__enter-image--ya" target="_blank" />
                </div>
              </form>
            </div>
            <div className="auth__bg auth__bg--mobile"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;