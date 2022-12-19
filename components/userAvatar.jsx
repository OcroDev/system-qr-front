//MATERIAL UI
import {
  Avatar,
  Divider,
  ListSubheader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
//MATERIAL ICONS
import { ExpandLess, ExpandMore, Logout } from "@mui/icons-material";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { dropdownSetter } from "../redux/reducers/navbar/navbarSlice";

export default function UserAvatar() {
  const dispatch = useDispatch();
  const { openUserAvatar } = useSelector((state) => state.navbar);

  return (
    <>
      <div
        style={{
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          marginBottom: ".5rem",
        }}
      >
        <Avatar alt="User Name" src="" sx={{ width: 75, height: 75 }} />
      </div>
      <div>
        <List
          sx={{
            bgcolor: "background.paper",
            color: "#efefef",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
            ></ListSubheader>
          }
        >
          <ListItemButton onClick={() => dispatch(dropdownSetter("avatar"))}>
            <ListItemIcon>{/* <PeopleIcon /> */}</ListItemIcon>
            <ListItemText primary="User Name" />
            {openUserAvatar ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUserAvatar} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </div>

      <Divider variant="middle" />
    </>
  );
}
