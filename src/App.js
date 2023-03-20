import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import "./Mobile.css";

import AuthService from "./services/auth.service";
import AuthVerify from "./components/AuthVerify";
import UserService from "./services/user.service";

import Login from "./components/Login";
import Home from "./components/Home";
import Search from "./components/Search";
import Details from "./components/Details";
import NotFound from "./components/NotFound";
import SectionUnderDevelopment from "./components/SectionUnderDevelopment"

import avatar from "./images/user-avatar.png";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);
setDefaultLocale('ru');

const PrivateRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();
  return user ? children : <Navigate to="/home" />;
}

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [usedCompanyCount, setUsedCompanyCount] = useState(0);
  const [companyLimit, setCompanyLimit] = useState(0);
  const [showUserMenu, setUserMenuState] = useState(false);

  const userMenu = () => {
    setUserMenuState(!showUserMenu)
  }

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setLoading(true);
      UserService.getAccountInfo()
        .then(
          (response) => {
            setUsedCompanyCount(response.data.eventFiltersInfo.usedCompanyCount);
            setCompanyLimit(response.data.eventFiltersInfo.companyLimit);
          },
          (error) => {
            if (error.response && error.response.status === 401) {
              document.dispatchEvent(new CustomEvent("logout"));
            }
          }
        )
        .finally(() => {
          setLoading(false);
        });
    }

    document.addEventListener("logout", logOut);

    return () => {
      document.removeEventListener("logout", logOut);
    };

  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <>
      <div className={`page-container ${showUserMenu ? 'page-container__mobile-menu' : ''}`}>
        <div className="content-wrap">
          <header className="header">
            <nav className="header__wrapper">
              <Link to={"/"} className={`header__inner header__inner--logo ${showUserMenu ? 'header__inner--logo__mobile-menu' : ''}`}></Link>
              <div className="header__inner header__inner--nav">
                <div className="header__nav nav">
                  <div className={`nav__btn ${showUserMenu ? 'nav__btn-close' : ''}`} onClick={() => userMenu()}></div>
                  <ul className={`nav__list ${showUserMenu ? 'nav__list__mobile-menu' : ''}`}>
                    <li className="nav__item">
                      <Link to="/home" onClick={() => userMenu()} className="nav__link">Главная</Link>
                    </li>
                    <li className="nav__item">
                      <Link to="/tariff" onClick={() => userMenu()} className="nav__link">Тарифы</Link>
                    </li>
                    <li className="nav__item">
                      <Link to="/faq" onClick={() => userMenu()} className="nav__link">FAQ</Link>
                    </li>
                  </ul>
                  {currentUser ? (
                    <div className={`header__user ${showUserMenu ? 'header__user-mobile_menu' : ''}`} >
                      <div className="header__inner header__inner--info">
                        <div className="header__info-loading" hidden={!loading}>
                          <span className="spinner24px"></span>
                        </div>
                        <div className="header__info" hidden={loading}>
                          <div className="header__info-row">
                            <div className="header__info-cell">Использовано компаний</div>
                            <div className="header__info-cell">{usedCompanyCount}</div>
                          </div>
                          <div className="header__info-row">
                            <div className="header__info-cell">Лимит по компаниям</div>
                            <div className="header__info-cell green">{companyLimit}</div>
                          </div>
                        </div>
                      </div>
                      <div className="header__inner header__inner--user">
                        <div className="header__user-text">
                          <div className="header__name">Алексей А.</div>
                          <button className={`header__btn-out ${showUserMenu ? 'header__btn-out__mobile-menu' : ''}`} onClick={logOut}>
                            Выйти
                          </button>
                        </div>
                        <div className="header__avatar">
                          <img src={avatar} alt="" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ul className={`header__login ${showUserMenu ? 'header__login-mobile_menu' : ''}`}>
                      <li className="header__login-item">
                        <span className="header__login-item_disabled">Зарегистрироваться</span>
                      </li>
                      <li className="header__user-vertical_line"></li>
                      <li className="header__login-item">
                        <Link to={"/login"} role="button" className="login-link" onClick={() => userMenu()}>
                          Войти
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </nav>
          </header>
          <main className={`main-container ${showUserMenu ? 'main-container__mobile-menu' : ''}`} >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tariff" element={<SectionUnderDevelopment />} />
              <Route path="/faq" element={<SectionUnderDevelopment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              } />
              <Route path="/details" element={
                <PrivateRoute>
                  <Details />
                </PrivateRoute>
              } />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <AuthVerify logOut={logOut} />
          </main>
          <footer className={`footer ${showUserMenu ? 'footer__mobile-menu' : ''}`} >
            <div className="footer__wrapper">
              <div className="footer__inner footer__inner--logo"></div>
              <div className="footer__inner footer__inner--contacts">
                <div className="footer__contacts">
                  г. Москва, Цветной б-р, 40<br />
                  +7 495 771 21 11<br />
                  info@skan.ru
                </div>
                <div className="footer__copyright">
                  Copyright. 2022
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;

