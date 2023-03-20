import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import DataService from "../services/data.service";
import { Navigation } from 'swiper';
import { format } from 'date-fns'
import defaultImg from "../images/preview-news.jpg";

const Details = () => {
    const documentsPerPage = 10; //документов на странице
    const location = useLocation();
    const navigate = useNavigate();
    const [histogramsInfo, setHistogramsInfo] = useState({});
    const [histogramsInfoTotal, setHistogramsInfoTotal] = useState(0);
    const [histogramsError, setHistogramsError] = useState(null);
    const [searchResultItems, setSearchResultItems] = useState([]);
    const [objectsError, setObjectsError] = useState(null);
    const [arrayForHoldingDocuments, setArrayForHoldingDocuments] = useState([]); //массив для хранения документов
    const [hasMore, setHasMore] = useState(false);
    const [next, setNext] = useState(documentsPerPage);
    const [loaded, setLoaded] = useState(false);

    const formatDate = (date) => {
        return format(Date.parse(date), 'dd.MM.yyyy');
    }

    const extractImageUrl = (str) => {
        var test = str.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
        return test ? test[1] : defaultImg;
    }

    const extractContent = (str) => {
        return str.replace(/(<\/?(?:p|br)[^>]*>)|<[^>]+>/ig, '$1') //оставляем только p и br тэги
            .replace(/(<br[\s]*\/?>[\s]*)+/ig, '<br>') //удаляем подряд идущие дубли br                   
            .replace(/<.[^>]*>(\s+|()|(&nbsp;)*|\s+(&nbsp;)*|(&nbsp;)*\s+|\s+(&nbsp;)*\s+)<\/.[^>]*>/ig, '') //удаляем пустые тэги
    }

    const load_more = () => {
        const idsArray = searchResultItems.slice(next, next + documentsPerPage);
        search(idsArray)
        setNext(next + documentsPerPage);
        setHasMore(searchResultItems.length > next + documentsPerPage)
    };

    const search = useCallback((idsArray) => {
        
        if (idsArray.length === 0) {
            setLoaded(true);
            return;
        }

        const data = {
            ids: idsArray
        }
        setLoaded(false);
        DataService.getListDocuments(data).then(
            (response) => {
                const documents = response.data.map((doc) => {
                    const html = doc.ok.content.markup.replace(/<\/?[^>]+>/gi, "");//удаляем все xml тэги, оставляем не декодированый html контент                    
                    let e = document.createElement("div");
                    e.innerHTML = html; //декодируем html контент
                    const content = e.childNodes.length === 0 ? "" : extractContent(e.childNodes[0].nodeValue); //извлекаем текст
                    const imgUrl = e.childNodes.length === 0 ? defaultImg : extractImageUrl(e.childNodes[0].nodeValue); //извлекаем ссылку на изображение                    
                    const issueDate = formatDate(doc.ok.issueDate);
                    return {
                        issueDate: issueDate,
                        url: doc.ok.url,
                        sourceName: doc.ok.source.name,
                        titleText: doc.ok.title.text,
                        isTechNews: doc.ok.attributes.isTechNews,
                        isAnnouncement: doc.ok.attributes.isAnnouncement,
                        isDigest: doc.ok.attributes.isDigest,
                        wordCount: doc.ok.attributes.wordCount,
                        content: content,
                        imgUrl: imgUrl,
                    }
                })
                setArrayForHoldingDocuments((prevValue) => [...prevValue, ...documents]);
                setLoaded(true);
            },
            (error) => {
                setLoaded(true);
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setObjectsError(message);

                if (error.response && error.response.status === 401) {
                    document.dispatchEvent(new CustomEvent("logout"));
                }
            }
        );
    }, [])

    useEffect(() => {

        if (!location.state) {
            navigate("/search");
            return;
        }

        const { inn, limit, tonality, startDate, endDate, maxFullness, inBusinessNews, onlyMainRole,
            onlyWithRiskFactors, includeTechNews, includeAnnouncements, includeDigests } = location.state;

        const requestBody = {
            "issueDateInterval": {
                "startDate": startDate,
                "endDate": endDate
            },
            "searchContext": {
                "targetSearchEntitiesContext": {
                    "targetSearchEntities": [
                        {
                            "type": "company",
                            "sparkId": null,
                            "entityId": null,
                            "inn": inn,
                            "maxFullness": maxFullness,
                            "inBusinessNews": inBusinessNews
                        }
                    ],
                    "onlyMainRole": onlyMainRole,
                    "tonality": tonality,
                    "onlyWithRiskFactors": onlyWithRiskFactors,
                    "riskFactors": {
                        "and": [],
                        "or": [],
                        "not": []
                    },
                    "themes": {
                        "and": [],
                        "or": [],
                        "not": []
                    }
                },
                "themesFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                }
            },
            "searchArea": {
                "includedSources": [],
                "excludedSources": [],
                "includedSourceGroups": [],
                "excludedSourceGroups": []
            },
            "attributeFilters": {
                "excludeTechNews": !includeTechNews,
                "excludeAnnouncements": !includeAnnouncements,
                "excludeDigests": !includeDigests
            },
            "similarMode": "duplicates",
            "limit": limit,
            "sortType": "sourceInfluence",
            "sortDirectionType": "desc",
            "intervalType": "month",
            "histogramTypes": [
                "totalDocuments",
                "riskFactors"
            ]
        };

        const getHistogramsInfo = () => {
            DataService.getHistogramsInfo(requestBody).then(
                (response) => {

                    const totalDocumentsArr = response.data.data.find(a => a.histogramType === "totalDocuments").data;
                    const riskFactorsArr = response.data.data.find(a => a.histogramType === "riskFactors").data;

                    let histogramsInfo = totalDocumentsArr
                        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
                        .map((totalDocument, index) => {
                            return ({
                                date: formatDate(totalDocument.date),
                                totalDocumentValue: totalDocument.value,
                                riskFactorValue: riskFactorsArr.find((riskFactor) => riskFactor.date === totalDocumentsArr[index].date)?.value
                            })
                        })
                    setHistogramsInfoTotal(totalDocumentsArr.length)
                    setHistogramsInfo(histogramsInfo)
                },
                (error) => {
                    const message =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setHistogramsError(message);

                    if (error.response && error.response.status === 401) {
                        document.dispatchEvent(new CustomEvent("logout"));
                    }
                }
            );
        }

        const getObjectsInfo = () => {
            DataService.getObjectsInfo(requestBody).then(
                (response) => {
                    const searchResultItems = response.data.items.map(a => a.encodedId);
                    setSearchResultItems(searchResultItems);
                    const idsArray = searchResultItems.slice(0, documentsPerPage);
                    search(idsArray)
                    setHasMore(searchResultItems.length > documentsPerPage);
                },
                (error) => {
                    const message =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setObjectsError(message);

                    if (error.response && error.response.status === 401) {
                        document.dispatchEvent(new CustomEvent("logout"));
                    }
                }
            );
        }

        getHistogramsInfo();
        getObjectsInfo();

    }, [location, navigate, search]);

    return (
        <section className="res">
            <div className="container">
                <div className="details__main-wrapper">
                    <div className="details__main-inner">
                        <h1 className="details__main-title">Ищем. Скоро будут результаты</h1>
                        <div className="details__main-desc">
                            Поиск может занять некоторое время, просим сохранять терпение.
                        </div>
                    </div>
                    <div className="details__main-inner details__main-inner--picture"></div>
                </div>
                <div className="details__info">
                    <h2 className="details__info-sub-title">Общая сводка</h2>
                    <div className="details__info-desc">Найдено {histogramsInfoTotal} вариантов</div>
                    <div className="details__info-slider-wrap">
                        <div className="slidePrev-btn" />
                        <div className="details__info-list">
                            <div className="details__info-list-item">Период</div>
                            <div className="details__info-list-item details__info-list-totalitem">Всего</div>
                            <div className="details__info-list-item">Риски</div>
                        </div>
                        {histogramsInfo.length > 0 ?
                            <Swiper {...{
                                className: "details__info-slider",
                                modules: [Navigation],
                                rewind: true,
                                breakpoints: {
                                    360: {
                                        slidesPerView: 1,
                                    },
                                    1440: {
                                        slidesPerView: 8,
                                    }
                                },
                                navigation: {
                                    nextEl: '.slideNext-btn',
                                    prevEl: '.slidePrev-btn'
                                }
                            }}
                            >
                                {histogramsInfo.map((info, index) => (
                                    <SwiperSlide key={index} className="details__info-slide swiper-slide">
                                        <div className="details__info-date">{info.date}</div>
                                        <div className="details__info-total">{info.totalDocumentValue}</div>
                                        <div className="details__info-risks">{info.riskFactorValue}</div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            :
                            <div className="histograms__info-loading">
                                <div className={loaded && "display-none"}>
                                    <div className="spinner50px"></div>
                                    <div className="loading-text">Загружаем данные</div>
                                    <div className="message__error" hidden={!histogramsError}>{histogramsError}</div>
                                </div>
                                <div className={!loaded && "display-none"}>
                                    Нет данных
                                </div>
                            </div>
                        }
                        <div className="slideNext-btn" />
                    </div>
                </div>
                <div className="details__news">
                    <h2 className="details__news-sub-title">Список документов</h2>
                    <div className="details__news-wrapper">
                        {arrayForHoldingDocuments.map((document, index) => (
                            <div key={index} className="doc-item">
                                <div className="doc-item__info">
                                    <div className="doc-item__date">{document.issueDate}</div>
                                    <a href={document.url} target="_blank" rel="noopener noreferrer" className={document.url ? "doc-item__source" : "doc-item__source link-disabled"}>{document.sourceName}</a>
                                </div>
                                <div className="doc-item__title">{document.titleText}</div>
                                {document.isTechNews &&
                                    (
                                        <div className="n-item__cat n-item__cat--techno">Технические новости</div>
                                    )}
                                {document.isAnnouncement &&
                                    (
                                        <div className="n-item__cat n-item__cat--techno">Анонсы и события</div>
                                    )}
                                {document.isDigest &&
                                    (
                                        <div className="n-item__cat n-item__cat--techno">Сводки новостей</div>
                                    )}
                                <div className="doc-item__picture">
                                    <img src={document.imgUrl} alt="" />
                                </div>
                                <div className="doc-item__desc" dangerouslySetInnerHTML={{ __html: document.content }} />
                                <div className="doc-item__align">
                                    <a href={document.url} target="_blank" rel="noopener noreferrer" className={document.url ? "doc-item__btn" : "visibility-hidden"}>Читать в источнике</a>
                                    <div className="doc-item__more">{document.wordCount} слова</div>
                                </div>
                            </div>
                        ))}
                        <div className="message__error" hidden={!objectsError}>{objectsError}</div>
                    </div>
                    {hasMore && loaded ?
                        (
                            <div className="loadmore__align">
                                <button className="loadmore__btn btn" onClick={load_more}>
                                    <span>Показать больше</span>
                                </button>
                            </div>
                        )
                        :
                        (!loaded &&
                            <div className="loadmore__align">
                                <span className="spinner50px"></span>
                            </div>
                        )}
                </div>
            </div>
        </section>
    )
}

export default Details;