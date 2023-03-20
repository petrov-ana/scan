import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import slide1 from "../images/image-why-me-1.svg";
import slide2 from "../images/image-why-me-2.svg";
import slide3 from "../images/image-why-me-3.svg";
import imageAbstract from "../images/bg-why-me.svg";

const Home = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <>
      <section className="main">
        <div className="container">
          <div className="main__wrapper">
            <div className="main__inner main__inner--text">
              <h1 className="main__main-title main-title">
                СЕРВИС ПО ПОИСКУ <br /> ПУБЛИКАЦИЙ <br /> О КОМПАНИИ <br /> ПО ЕГО ИНН
              </h1>
              <div className="main__desc">
                Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.
              </div>
              {currentUser ?
                (
                  <div className="main__align">
                    <Link to="/search" className="btn main__btn">Запросить данные</Link>
                  </div>
                ) : ""}
            </div>
            <div className="bgmain"></div>
          </div>
        </div>
      </section>
      <section className="slider">
        <h1>Почему именно мы</h1>
        <div className="slider-wrap">
          <Swiper {...{
            modules: [Navigation],
            rewind: true,            
            navigation: true,
            breakpoints: {
              360: {
                slidesPerView: 1,
              },
              1400: {                
                slidesPerView: 3,
              }
            }
          }}
          >
            <SwiperSlide>
              <div>
                <img src={slide1} alt="" />
              </div>
              <p>
                Высокая и оперативная скорость обработки заявки
              </p>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={slide2} alt="" />
              </div>
              <p>
                Огромная комплексная база данных, обеспечивающая
                объективный ответ на запрос
              </p>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={slide3} alt="" />
              </div>
              <p>
                Защита конфеденциальных сведений, не подлежащих разглашению
                по федеральному законодательству
              </p>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={slide1} alt="" />
              </div>
              <p>
                Высокая и оперативная скорость обработки заявки
              </p>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={slide2} alt="" />
              </div>
              <p>
                Огромная комплексная база данных, обеспечивающая
                объективный ответ на запрос
              </p>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={slide3} alt="" />
              </div>
              <p>
                Защита конфеденциальных сведений, не подлежащих разглашению по
                федеральному законодательству
              </p>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <img src={imageAbstract} alt="abstract" className="image-abstract"></img>
      <section className="tariff">        
          <h2 className="why-me__title title">Наши тарифы</h2>
          <div className="tariff__wrapper">
            <div className={"tariff__card card card--beginner " + (currentUser && "card--beginner_selected")}>
              <div className="card__header">
                <div className="card__title">Beginner</div>
                <div className="card__desc">Для небольшого исследования</div>
                <div className="card__ico1"></div>
              </div>
              <div className="card__body">
                {currentUser && (
                  <div className="card__info">Текущий тариф</div>
                )}
                <div className="card__wrap-price">
                  <div className="card__price card__price-now">799 <span>&#8381;</span></div>
                  <div className="card__price card__price--old">1 200 <span>&#8381;</span></div>
                  <div className="card__price-desc">
                    или 150 ₽/мес. при рассрочке на 24 мес.
                  </div>
                </div>
                <div className="card__sub-title">
                  В тариф входит:
                </div>
                <ul className="card__list">
                  <li className="card__item">Безлимитная история запросов</li>
                  <li className="card__item">Безопасная сделка</li>
                  <li className="card__item">Поддержка 24/7</li>
                </ul>
              </div>
              <div className="card__footer">
                {currentUser ?
                  (
                    <button className="card__btn btn btn--link">Перейти в личный кабинет</button>) :
                  (
                    <button className="card__btn btn">Подробнее</button>
                  )}
              </div>
            </div>
            <div className="tariff__card card card--pro">
              <div className="card__header">
                <div className="card__title">Pro</div>
                <div className="card__desc">Для HR и фрилансеров</div>
                <div className="card__ico2"></div>
              </div>
              <div className="card__body">
                <div className="card__wrap-price">
                  <div className="card__price card__price-now">1 299 <span>&#8381;</span></div>
                  <div className="card__price card__price--old">2 600 <span>&#8381;</span></div>
                  <div className="card__price-desc">
                    или 279 ₽/мес. при рассрочке на 24 мес.
                  </div>
                </div>
                <div className="card__sub-title">
                  В тариф входит:
                </div>
                <ul className="card__list">
                  <li className="card__item">Все пункты тарифа Beginner</li>
                  <li className="card__item">Экспорт истории</li>
                  <li className="card__item">Рекомендации по приоритетам</li>
                </ul>
              </div>
              <div className="card__footer">
                <button className="card__btn btn">Подробнее</button>
              </div>
            </div>
            <div className="tariff__card card card--business">
              <div className="card__header">
                <div className="card__title">Business</div>
                <div className="card__desc">Для корпоративных клиентов</div>
                <div className="card__ico3"></div>
              </div>
              <div className="card__body">
                <div className="card__wrap-price">
                  <div className="card__price card__price-now">2 379 <span>&#8381;</span></div>
                  <div className="card__price card__price--old">3 700 <span>&#8381;</span></div>
                  <div className="card__price-desc">
                    или 150 ₽/мес. при рассрочке на 24 мес.
                  </div>
                </div>
                <div className="card__sub-title">
                  В тариф входит:
                </div>
                <ul className="card__list">
                  <li className="card__item">Все пункты тарифа Pro</li>
                  <li className="card__item">Безлимитное количество запросов</li>
                  <li className="card__item">Приоритетная поддержка</li>
                </ul>
              </div>
              <div className="card__footer">
                <button className="card__btn btn">Подробнее</button>
              </div>
            </div>
          </div>        
      </section>
    </>
  );
};

export default Home;