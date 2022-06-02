import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function NavBar({string, stringRight}: {string?: string, stringRight?: string}) {
  return (
    <Box component="div" sx={{ flexGrow: 1 }} className="navBar" >
      <AppBar position="fixed" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {!string ? 'Rain Protocol Sale' : string}
          </Typography>
          <Typography className="right" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {!stringRight ? '' : stringRight}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
