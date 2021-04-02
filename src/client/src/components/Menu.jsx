import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

import DynamicIcon from "@utils/DynamicIcon";
import Loading from "./Loading";
import { PanelContext } from "@data/PanelList";
import TitleContext from '@utils/TitleContext';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: theme.palette.menu.main,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 20,
  },
  toolbarIcon: {
    marginRight: 8,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  link: {
    textDecoration: 'none',
    color: '#cccccc',
    '&:hover': {
      color: '#fff'
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  bugLogo: {
    color: theme.palette.secondary.main,
    padding: "0.8rem",
  }
}));

const Menu = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('BUG');
    const panelList = useContext(PanelContext);
  
    const handleTitle = (newTitle) => {
      setTitle(newTitle);
    };

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    const renderMenuItem = (item) => {
        if (!item.enabled) {
            return null;
        }
        return (
            <ListItem button component={Link} to={`/panel/${item.id}`} key={item.id}>
                <ListItemIcon>
                    <DynamicIcon iconName={item._module.icon} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItem>
        );
    };

    const renderMenuItems = (props) => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "succeeded") {
            return (
                <List aria-label="list of enabled modules">
                    {panelList.data.map((panel) => renderMenuItem(panel))}
                </List>
            );
        } else {
            return null;
        }
    };

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>

            <Link className={classes.link} to="/">
                <Typography variant="h6" noWrap className={classes.link}>
                    <FontAwesomeIcon size="lg" icon={faBug} className={classes.toolbarIcon} /> { title }
                </Typography>
            </Link>
        
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>

          <Divider />
          
          {renderMenuItems(props)}

          <Divider />
          
          <List>
            <ListItem button component={Link} to="/settings">
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button component={Link} to="/panels">
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Panels" />
            </ListItem>
          </List>

        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          
          <TitleContext.Provider value={handleTitle} >
            { props.children }
          </TitleContext.Provider>
        
        </main>
      </div>
    );
};

export default Menu;
