import React from "react";

type ErrorType = {
  errorCode: number;
  errorMessage: string;
};

function Error({ errorCode, errorMessage }: ErrorType) {
  return (
    <div>
      <div>Error {errorCode}</div>
      <div>{errorMessage}</div>
    </div>
  );
}

export default Error;
