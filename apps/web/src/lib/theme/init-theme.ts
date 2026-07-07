export const THEME_STORAGE_KEY = "restaurant_theme";

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.setAttribute("data-theme",(t==="light"||t==="dark")?t:"light");}catch(e){}})();`;