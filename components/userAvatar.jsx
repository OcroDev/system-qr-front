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
import { unSetUser } from "../redux/reducers/userLogin/userLoginSlice";
import { unsetUser } from "d:/users/rohe/documents/programacion/javascript/redux/learning_redux/redux/src/app/reducers/users/userslice";
import { useRouter } from "next/router";

export default function UserAvatar() {
  const dispatch = useDispatch();
  const { openUserAvatar } = useSelector((state) => state.navbar);
  const { u_firstname, u_lastname } = useSelector((state) => state.userLogin);
  const router = useRouter();
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
        <Avatar
          alt="User Name"
          src=""
          sx={{ width: 75, height: 75, color: "#efefef" }}
        />
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
            <ListItemText>
              <span style={{ fontSize: ".8rem" }}>
                {u_firstname} {u_lastname}
              </span>
            </ListItemText>
            {openUserAvatar ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUserAvatar} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  dispatch(unsetUser());
                  sessionStorage.removeItem("user");
                  router.push("/");
                }}
              >
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
