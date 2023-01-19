import React from "react"
import { useTranslation } from "react-i18next"

export default function ImageEditorToolbar({ filters, setFilters, setFiltersAreChanged }) {

    const updateFilters = (e) => {
        setFiltersAreChanged(true)
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const { t } = useTranslation()
    
    return (
        <>
        <div className="toolbar">
                <div className="toolbar-item">
                    <label htmlFor="brightness">
                        {t("brightness")}
                    </label>
                    <input 
                      type="range"
                      id="brightness"
                      name="brightness"
                      min="0"
                      max="200"
                      value={filters.brightness}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>

                <div className="toolbar-item">
                    <label htmlFor="saturation">
                        {t("saturation")}
                    </label>
                    <input 
                      type="range"
                      id="saturation"
                      name="saturation"
                      min="0"
                      max="200"
                      value={filters.saturation}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>

                <div className="toolbar-item">
                    <label htmlFor="blur">
                        {t("blur")}
                    </label>
                    <input 
                      type="range"
                      id="blur"
                      name="blur"
                      min="0"
                      max="25"
                      value={filters.blur}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>

                <div className="toolbar-item">
                    <label htmlFor="inversion">
                        {t("inversion")}
                    </label>
                    <input 
                      type="range"
                      id="inversion"
                      name="inversion"
                      min="0"
                      max="100"
                      value={filters.inversion}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>

                <div className="toolbar-item">
                    <label htmlFor="sepia">
                        {t("sepia")}
                    </label>
                    <input 
                      type="range"
                      id="sepia"
                      name="sepia"
                      min="0"
                      max="100"
                      value={filters.sepia}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>

                <div className="toolbar-item">
                    <label htmlFor="grayscale">
                        {t("grayscale")}
                    </label>
                    <input 
                      type="range"
                      id="grayscale"
                      name="grayscale"
                      min="0"
                      max="100"
                      value={filters.grayscale}
                      onChange={(e) => updateFilters(e)}
                    />
                </div>
            </div>
        </>
    )
} 