import styled from 'styled-components';
import React from "react";
import Typography from "@mui/material/Typography";

const ConsoleContainer = styled.div`
  text-align: center;
  
  .consoleTextRed {
    color: red;
    user-select: text;
  }
  .consoleTextGreen {
    color: green;
    user-select: text;
  }
`;

export default function Console({consoleColor, consoleData}: any) {
  return (
    <ConsoleContainer className='console'>
      { consoleColor === 'red' && (
        <Typography className="consoleTextRed"><b>{consoleData}</b></Typography>
      )}

      { consoleColor === 'green' && (
        <Typography className="consoleTextGreen"><b>{consoleData}</b></Typography>
      )}
    </ConsoleContainer>
  )
}
