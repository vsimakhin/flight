import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { colorSchemes } from './themePrimitives';

function AppTheme(props) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: 'template',
        },
        colorSchemes,
      });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;
