import React, { useState, useEffect } from "react";

// App
import Error from "../../components/Error/Error";

type ErrorContainerTypes = {
  errorCode: number;
};

const ErrorContainer = ({ errorCode }: ErrorContainerTypes) => {
  const [errorMessage, setErrorMessage] = useState("");

  const getErrorMessage = (errorCode: number) => {
    switch (errorCode) {
      case 404:
        setErrorMessage("Page Not Found.");
        break;
      default:
        setErrorMessage("Page Not Found.");
    }
  };

  useEffect(() => {
    getErrorMessage(errorCode);
  }, [errorCode]);

  return <Error errorCode={errorCode} errorMessage={errorMessage} />;
};

export default ErrorContainer;
