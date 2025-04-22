import React, { useEffect } from "react";

const Translate = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.id = "googleTranslateScript";
    document.body.appendChild(addScript);
    
    window.googleTranslateElementInit = () => {
      if (document.getElementById("googleTranslateElement")) {
        document.getElementById("googleTranslateElement").innerHTML = "";
      }
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: true,
      }, "googleTranslateElement");
    }

    return () => {
      const script = document.getElementById("googleTranslateScript");
      if (script) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div>
      <div id="googleTranslateElement"></div>
    </div>
    
  );
};

export default Translate;