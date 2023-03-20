import React from "react";
import DatePicker from "react-datepicker";
import Checkbox from "./Checkbox";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const validateLimit = (value) => {
    value = Number(value);
    return value > 0 && value <= 1000;
}

const validateInn = (value) => {
    return (value.length === 10) &&
        (+value[9] === ((2 * value[0] + 4 * value[1] + 10 * value[2] + 3 * value[3] + 5 * value[4] + 9 * value[5] + 4 * value[6] + 6 * value[7] + 8 * value[8]) % 11) % 10);
};

const numberOnly = (e) => {
    !/[0-9]/.test(e.key) &&
        !(e.key === "ArrowLeft") &&
        !(e.key === "ArrowRight") &&
        !(e.key === "Backspace") &&
        !(e.key === "Delete") &&
        !(e.keyCode === 86 && e.ctrlKey) && //Ctrl+V
        e.preventDefault();
}

const dateNotFuture = (date) => {
    return date < Date.now();
};

const Search = () => {

    const navigate = useNavigate();

    const { control, trigger, register, handleSubmit, getValues ,formState } = useForm({
        mode: "onChange",
        defaultValues: {
            inn: "",
            limit: "",
            tonality: "any",
            startDate: null,
            endDate: null,
            maxFullness: true,
            inBusinessNews: true,
            onlyMainRole: true,
            onlyWithRiskFactors: false,
            includeTechNews: false,
            includeAnnouncements: true,
            includeDigests: false
        }
    });

    const onSubmit = (data) => {        
        navigate(
            '/details',
            { state: data }
        );
    }

    return (<section className="search">
        <div className="container">
            <div className="search__fly-picture--one"></div>
            <div className="search__fly-picture--two"></div>
            <div className="search__wrapper">
                <h1 className="search__title title">Найдите необходимые данные в пару кликов.</h1>
                <div className="search__desc">Задайте параметры поиска.<br />Чем больше заполните, тем точнее поиск</div>
                <form className="search__form" onSubmit={handleSubmit(onSubmit)} >
                    <div className="search__form-wrapper">
                        <div className="search__form-inner">
                            <div className="search__item">
                                <label htmlFor="inn" className="search__label">ИНН компании <sup className={formState.errors.inn ? "is-invalid-sup sup" : "sup"}>*</sup></label>
                                <input type="text"
                                    className={formState.errors.inn ? "is-invalid-input search__input input" : "search__input input"}
                                    placeholder="10 цифр"
                                    onKeyDown={numberOnly}
                                    {...register("inn", { required: true, maxLength: 10, validate: validateInn })}
                                />
                                {formState.errors.inn && <div className="input-error">Введите корректные данные</div>}
                            </div>
                            <div className="search__item">
                                <label htmlFor="tonality" className="search__label">Тональность</label>
                                <select name="tonality" {...register("tonality")} className="tonality-select minimal">
                                    <option value="any">любая</option>
                                    <option value="positive">позитивная</option>
                                    <option value="negative">негативная</option>
                                    <option value="neutral">нейтральная</option>
                                </select>
                            </div>
                            <div className="search__item">
                                <label htmlFor="limit" className="search__label">
                                    Количество документов в выдаче
                                    <sup className={formState.errors.inn ? "is-invalid-sup sup" : "sup"}>*</sup>
                                </label>
                                <input type="text"
                                    name="limit"
                                    className={formState.errors.limit ? "is-invalid-input search__input input" : "search__input input"}
                                    placeholder="От 1 до 1000"
                                    onKeyDown={numberOnly}
                                    {...register("limit", { required: true, validate: validateLimit })}
                                />
                                {formState.errors.limit && <div className="input-error">Введите корректные данные</div>}
                            </div>
                            <div className="search__wrap-item">
                                <label htmlFor="startDate" className="search__label label">
                                    Диапазон поиска
                                    <sup className={formState.errors.startDate || formState.errors.endDate ? "is-invalid-sup sup" : "sup"}>*</sup>
                                </label>
                                <div className="search__wrap-input">
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,                                            
                                            validate: (date) => date && getValues("endDate") && date.getTime() <= getValues("endDate").getTime()
                                        }}
                                        name='startDate'
                                        render={({ field }) => (
                                            <DatePicker
                                                locale="ru"
                                                dateFormat='dd.MM.yyyy'
                                                placeholderText={'Дата начала'}
                                                filterDate={dateNotFuture}
                                                todayButton="СЕГОДНЯ"
                                                className={formState.errors.startDate ? "is-invalid-input search__input input date-custom-input" : "search__input input date-custom-input"}
                                                onChange={(date) =>{                                                     
                                                    field.onChange(date)                                                
                                                    trigger("endDate");
                                                }}
                                                selected={field.value}
                                            >
                                                <div className="datepicker-prompt">Дата начала не может быть позже даты конца</div>
                                            </DatePicker>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                            validate: (date) => date && getValues("startDate") && date.getTime() >= getValues("startDate").getTime()
                                        }}
                                        name='endDate'
                                        render={({ field }) => (
                                            <DatePicker
                                                locale="ru"
                                                dateFormat='dd.MM.yyyy'
                                                placeholderText={'Дата конца'}
                                                filterDate={dateNotFuture}
                                                todayButton="СЕГОДНЯ"
                                                className={formState.errors.endDate ? "is-invalid-input search__input input date-custom-input" : "search__input input date-custom-input"}
                                                onChange={(date) => {                                                     
                                                    field.onChange(date);
                                                    trigger("startDate");
                                                }}
                                                selected={field.value}
                                            >
                                                <div className="datepicker-prompt">Дата конца не может быть раньше даты начала</div>
                                            </DatePicker>
                                        )}
                                    />
                                </div>
                                {(formState.errors.startDate || formState.errors.endDate) && <div className="input-error">Введите корректные данные</div>}
                            </div>
                        </div>
                        <div className="search__form-inner">
                            <div className="search__checkbox">
                                <Controller
                                    control={control}
                                    name='maxFullness'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Признак максимальной полноты"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='inBusinessNews'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Упоминания в бизнес-контексте"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='onlyMainRole'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Главная роль в публикации"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='onlyWithRiskFactors'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Публикации только с риск-факторами"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='includeTechNews'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Включать технические новости рынков"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='includeAnnouncements'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Включать анонсы и календари"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='includeDigests'
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Включать сводки новостей"
                                            onChange={(checked) => field.onChange(checked)}
                                            value={field.value}
                                            checked={field.value}
                                        />
                                    )}
                                />
                            </div>
                            <div className="search__align">
                                <button className="search__btn btn" disabled={!formState.isValid}>Поиск</button>
                                <span>* Обязательные к заполнению поля</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="search__bg"></div>
        </div>
    </section>)
}

export default Search;