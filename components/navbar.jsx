//STYLES
import styles from "../styles/navbar.module.css";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { dropdownSetter } from "../redux/reducers/navbar/navbarSlice";
//DEPENDENCIES
import UserAvatar from "./userAvatar";
//NEXT
import Link from "next/link";
//MATERIAL UI
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  Inventory,
  AddBox,
  House,
  Apartment,
  ProductionQuantityLimits,
  Archive,
  Unarchive,
  Warehouse,
  DescriptionOutlined,
  PersonPin,
  Edit,
} from "@mui/icons-material";

export default function Navbar() {
  //redux
  const dispatch = useDispatch();
  const {
    openProduct,
    openDepartment,
    openOperation,
    openWarehouse,
    openReport,
    openUser,
  } = useSelector((state) => state.navbar);

  return (
    <aside className={styles.sidebar}>
      <nav>
        <UserAvatar />
        <List
          sx={{
            bgcolor: "background.paper",
            color: "#fff",
          }}
          //style={{ color: "#efefef" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
            ></ListSubheader>
          }
        >
          {/* Home */}
          <Link href="/">
            <ListItemButton>
              <ListItemIcon sx={{ color: "#fff" }}>
                <House />
              </ListItemIcon>
              <ListItemText primary="Home"></ListItemText>
            </ListItemButton>
          </Link>

          {/* Productos */}
          <ListItemButton onClick={() => dispatch(dropdownSetter("products"))}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Productos" />
            {!openProduct ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openProduct}>
            <Link href="/products/create">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="Crear" />
                </ListItemButton>
              </List>
            </Link>
            <Link href="/products/update">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText primary="Actualiar / Eliminar" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>

          {/* Operation */}
          <ListItemButton onClick={() => dispatch(dropdownSetter("operation"))}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <ProductionQuantityLimits />
            </ListItemIcon>
            <ListItemText primary="Operaciones"></ListItemText>
            {!openOperation ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openOperation}>
            <Link href="">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Archive />
                  </ListItemIcon>
                  <ListItemText primary="Entrada" />
                </ListItemButton>
              </List>
            </Link>
            <Link href="">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Unarchive />
                  </ListItemIcon>
                  <ListItemText primary="Salida" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>

          {/* Departements */}
          <ListItemButton
            onClick={() => dispatch(dropdownSetter("department"))}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Apartment />
            </ListItemIcon>
            <ListItemText primary="Departmentos"></ListItemText>
            {!openDepartment ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openDepartment}>
            <Link href="/departments/create">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="Crear" />
                </ListItemButton>
              </List>
            </Link>
            <Link href="/departments/update">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText primary="Actualiar / Eliminar" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>

          {/* Warehouse */}
          <ListItemButton onClick={() => dispatch(dropdownSetter("warehouse"))}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Warehouse />
            </ListItemIcon>
            <ListItemText primary="Almacenes"></ListItemText>
            {!openWarehouse ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openWarehouse}>
            <Link href="/warehouse/create">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="Crear" />
                </ListItemButton>
              </List>
            </Link>
            <Link href="/warehouse/update">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText primary="Actualiar / Eliminar" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>

          {/* Reports */}
          <ListItemButton onClick={() => dispatch(dropdownSetter("report"))}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <DescriptionOutlined />
            </ListItemIcon>
            <ListItemText primary="Reportes"></ListItemText>
            {!openReport ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openReport}>
            <Link href="/reports/create">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="Crear" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>

          {/* Users */}
          <ListItemButton onClick={() => dispatch(dropdownSetter("user"))}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <PersonPin />
            </ListItemIcon>
            <ListItemText primary="Usuario"></ListItemText>
            {!openUser ? <ExpandMore /> : <ExpandLess />}
          </ListItemButton>
          <Collapse in={openUser}>
            <Link href="/users/create">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="Crear" />
                </ListItemButton>
              </List>
            </Link>
            <Link href="/users/update">
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText primary="Actualiar / Eliminar" />
                </ListItemButton>
              </List>
            </Link>
          </Collapse>
        </List>
      </nav>
    </aside>
  );
}
