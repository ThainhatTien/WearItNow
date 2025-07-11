import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

const App = (): ReactElement => {
  return (
    <SnackbarProvider maxSnack={3}anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Outlet />
  </SnackbarProvider>
)
  
};

export default App;
