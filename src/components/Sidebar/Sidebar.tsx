import React, { useEffect, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/ImportContacts';
import PostAddIcon from '@material-ui/icons/PostAdd';

// Components
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

// Localization
import { FormattedMessage, useIntl } from 'react-intl';
import messages from '~/components/NewRenter/messages';

const pageNames = {
  '/': messages.catalog,
  '/create': messages.newRenter,
};

type Path = '/' | '/create' | undefined;

const Sidebar: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname as Path;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, setTitle] = useState(path ? pageNames[path] : messages.notFound);

  useEffect(() => {
    setTitle(path ? pageNames[path] : messages.notFound);
  }, [location]);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? (): HTMLElement => window.document.body : undefined;

  const drawer = (
    <div>
      <div className="toolbar" />
      <Divider />
      <List>
        <ListItem button onClick={(): void => history.push('/')}>
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.catalog)} />
        </ListItem>
        <ListItem button onClick={(): void => history.push('/create')}>
          <ListItemIcon><PostAddIcon /></ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.newRenter)} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText secondary={intl.formatMessage(messages.projectFirstStep)} />
        </ListItem>
        <ListItem>
          <ListItemText secondary={intl.formatMessage(messages.projectSecondStep)} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <CssBaseline />
      {/* Upper header */}
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <FormattedMessage {...title} />
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className="drawer" aria-label="mailbox folders">
        {/* The sidebar for the mobile */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: 'drawer-paper',
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/* The sidebar for the desktop */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: 'drawer-paper',
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </>
  );
};

export default Sidebar;
