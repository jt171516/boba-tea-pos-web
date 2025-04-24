import React, { useEffect } from "react";

const Translate = () => {
  useEffect(() => {
    // Create a script element to load the Google Translate API
    const addScript = document.createElement("script");
    addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.id = "googleTranslateScript";
    document.body.appendChild(addScript);
    
    // Define the callback function to initialize the Google Translate element
    window.googleTranslateElementInit = () => {
      // Check if the element already exists to avoid duplication
      if (document.getElementById("googleTranslateElement")) {
        document.getElementById("googleTranslateElement").innerHTML = "";
      }

      // Create a new Google Translate element
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: true,
      }, "googleTranslateElement");
    }

    return () => {
      // Remove the script element after the component unmounts
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